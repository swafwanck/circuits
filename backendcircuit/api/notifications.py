"""
Outbound delivery for public form submissions.

Every submission is FIRST stored in PostgreSQL, then fanned out to:

  * Email (GoDaddy SMTP) -> business mailbox, by default:
        To:   info@circuitholidays.com
        Cc:   circuitholidays@gmail.com
    Used for ALL submissions: enquiries, visa enquiries, call-back requests,
    contact messages and booking requests.
  * WhatsApp -> wa.me deep link (NO third-party provider) for visa enquiries
    and "Request a Call Back" submissions, in ADDITION to the email.

Google Form delivery was removed at the owner's request (2026-11-01).
Payment-gateway submissions return in a later update; today a booking stores
the form data and emails it — no Adyen session is started from the website.

Delivery never raises: a transport failure must not lose the database row.
"""
from __future__ import annotations

import logging
import re
import threading
from urllib.parse import quote, urlencode

import requests  # noqa: F401  (kept for future delivery channels)
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

log = logging.getLogger(__name__)

TIMEOUT = 15  # seconds — SMTP can be slower than an API call


def run_in_background(fn, *args, **kwargs):
    """
    Run a delivery job off the request thread so the visitor never waits for
    the SMTP round-trip (and never sees a 500 when it fails).
    Set DELIVERY_ASYNC=False to run inline (tests / debugging).
    """
    if not getattr(settings, "DELIVERY_ASYNC", True):
        try:
            return fn(*args, **kwargs)
        except Exception:
            log.exception("Delivery job failed: %s", getattr(fn, "__name__", fn))
            return None

    def _runner():
        try:
            fn(*args, **kwargs)
        except Exception:
            log.exception("Delivery job failed: %s", getattr(fn, "__name__", fn))

    threading.Thread(target=_runner, daemon=True).start()
    return None


# --------------------------------------------------------------------------- #
# Formal business email (GoDaddy SMTP)
# --------------------------------------------------------------------------- #
def _formal_text(title: str, fields: list[tuple[str, str]], message: str) -> str:
    """Plain-text part of the formal notification email."""
    lines = [
        f"Dear {settings.SITE_NAME} Team,",
        "",
        f"A new {title.lower()} has been received through the website. "
        f"The details are provided below for your follow-up.",
        "",
        "-----------------",
    ]
    for label, value in fields:
        if value:
            lines.append(f"{label}: {value}")
    lines.append("-----------------")
    if message:
        lines += ["", "Message:", message]
    lines += [
        "",
        "Kind regards,",
        f"{settings.SITE_NAME} Website",
        "(This is an automated notification — please do not reply directly.)",
    ]
    return "\n".join(lines)


def _formal_html(title: str, fields: list[tuple[str, str]], message: str) -> str:
    """HTML part of the formal notification email (inline styles only)."""
    esc = lambda s: (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    rows = "".join(
        f'<tr>'
        f'<td style="padding:8px 12px;border:1px solid #e2e8f0;background:#f8fafc;'
        f'font-weight:600;color:#0f172a;">{esc(label)}</td>'
        f'<td style="padding:8px 12px;border:1px solid #e2e8f0;color:#0f172a;">{esc(value)}</td>'
        f'</tr>'
        for label, value in fields if value
    )
    block = (
        f'<table style="border-collapse:collapse;width:100%;font-size:14px;">{rows}</table>'
        if rows else ""
    )
    msg_html = (
        f'<p style="margin:14px 0 0;color:#0f172a;white-space:pre-wrap;">{esc(message)}</p>'
        if message else ""
    )
    return f"""\
<!doctype html>
<html><body style="margin:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:0 auto;padding:24px;">
    <h2 style="margin:0 0 4px;color:#b91c1c;font-size:20px;">{esc(settings.SITE_NAME)}</h2>
    <p style="margin:0 0 16px;color:#334155;font-size:14px;">
      New {esc(title.lower())} — website notification
    </p>
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;">
      Dear {esc(settings.SITE_NAME)} Team,
    </p>
    <p style="margin:0 0 12px;color:#0f172a;font-size:14px;">
      A new {esc(title.lower())} has been received through the website.
      The details are provided below for your follow-up.
    </p>
    {block}{msg_html}
    <p style="margin:20px 0 0;color:#0f172a;font-size:14px;">Kind regards,</p>
    <p style="margin:0;color:#64748b;font-size:13px;">
      {esc(settings.SITE_NAME)} Website — automated notification
    </p>
  </div>
</body></html>"""


def send_business_email(subject: str, title: str, fields: list[tuple[str, str]],
                        message: str = "", reply_to: str = "") -> dict:
    """Send one formal notification email to the business mailbox (To + Cc)."""
    to = [addr for addr in settings.NOTIFY_TO_EMAILS if addr]
    cc = [addr for addr in settings.NOTIFY_CC_EMAILS if addr]
    if not to:
        return {"ok": False, "skipped": True, "reason": "NOTIFY_TO_EMAILS not configured"}
    try:
        msg = EmailMultiAlternatives(
            subject=f"[{settings.SITE_NAME}] {subject}"[:200],
            body=_formal_text(title, fields, message),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=to,
            cc=cc,
            reply_to=[reply_to] if reply_to else None,
        )
        msg.attach_alternative(_formal_html(title, fields, message), "text/html")
        msg.send(fail_silently=False)
        return {"ok": True, "to": to, "cc": cc}
    except Exception as exc:  # pragma: no cover - SMTP
        log.warning("Business email delivery failed: %s", exc)
        return {"ok": False, "error": str(exc)}


# --------------------------------------------------------------------------- #
# WhatsApp (no third-party API/provider — plain wa.me deep link)
# --------------------------------------------------------------------------- #
def build_whatsapp_link(text: str, number: str | None = None) -> str:
    # wa.me accepts an international number containing digits only. Tolerate
    # common .env formats such as "+971 50 247 5643" while rejecting malformed
    # values instead of producing a broken URL.
    number = re.sub(r"\D", "", str(number or settings.WHATSAPP_NUMBER or ""))
    if not 8 <= len(number) <= 15:
        log.error("WHATSAPP_NUMBER is missing or invalid; use 8-15 digits including country code")
        return ""
    return f"https://wa.me/{number}?{urlencode({'text': text}, quote_via=quote)}"


# --------------------------------------------------------------------------- #
# Enquiries (website forms, visa pages, call-back requests)
# --------------------------------------------------------------------------- #
def _enquiry_fields(enquiry) -> list[tuple[str, str]]:
    return [
        ("Reference", f"ENQ-{enquiry.pk}"),
        ("Service", (enquiry.service or enquiry.item_type or "").replace("_", " ").title()),
        ("Item", enquiry.item_title),
        ("Name", enquiry.name),
        ("Email", enquiry.email),
        ("Phone", enquiry.phone),
        ("Submitted From", enquiry.source_page),
    ]


def _enquiry_text(enquiry) -> str:
    lines = [f"{label}: {value}" for label, value in _enquiry_fields(enquiry) if value]
    if enquiry.message:
        lines.append(f"Message: {enquiry.message}")
    return "\n".join(lines)


def _to_whatsapp(enquiry) -> bool:
    """Visa enquiries and call-back (assistance) requests also go to WhatsApp."""
    return bool(
        enquiry.is_visa
        or getattr(enquiry, "channel", "") == "whatsapp"
        or (getattr(enquiry, "source", "") or "") == "assistance"
    )


def prepare_enquiry(enquiry) -> str:
    """
    Synchronous part of delivery: build the wa.me deep link for WhatsApp-routed
    enquiries so it can be returned in the API response. No network calls.
    """
    if not _to_whatsapp(enquiry):
        return ""
    link = build_whatsapp_link(_enquiry_text(enquiry))
    if link != enquiry.whatsapp_url:
        enquiry.whatsapp_url = link
        enquiry.save(update_fields=["whatsapp_url", "updated_at"])
    return link


def deliver_enquiry(enquiry) -> dict:
    """Fan out one stored Enquiry row: business email (+ WhatsApp when routed)."""
    report: dict = {}

    title = "Visa Enquiry" if enquiry.is_visa else (
        "Call Back Request" if (enquiry.source or "") == "assistance" else "Enquiry"
    )
    mail = send_business_email(
        subject=f"New {title} — {enquiry.item_title or enquiry.name}",
        title=title,
        fields=_enquiry_fields(enquiry),
        message=enquiry.message,
        reply_to=enquiry.email,
    )
    enquiry.email_sent = bool(mail.get("ok"))
    report["email"] = mail

    if _to_whatsapp(enquiry):
        link = enquiry.whatsapp_url or build_whatsapp_link(_enquiry_text(enquiry))
        if link:
            enquiry.whatsapp_url = link
        report["whatsapp"] = {"ok": bool(link), "url": link}

    enquiry.google_form_sent = False
    enquiry.delivery_log = report
    enquiry.save(update_fields=[
        "email_sent", "google_form_sent", "whatsapp_url", "delivery_log", "updated_at",
    ])
    return report


# --------------------------------------------------------------------------- #
# Contact page messages
# --------------------------------------------------------------------------- #
def deliver_contact_message(msg) -> dict:
    """Contact page messages: business email (To + Cc) — stored row already saved."""
    mail = send_business_email(
        subject=f"New Contact Message — {msg.service or msg.name}",
        title="Contact Message",
        fields=[
            ("Reference", f"MSG-{msg.pk}"),
            ("Service", (msg.service or "").replace("_", " ").title()),
            ("Name", msg.name),
            ("Email", msg.email),
            ("Phone", msg.phone),
        ],
        message=msg.message,
        reply_to=msg.email,
    )
    msg.email_sent = bool(mail.get("ok"))
    msg.google_form_sent = False
    msg.delivery_log = {"email": mail}
    msg.save(update_fields=["email_sent", "google_form_sent", "delivery_log", "updated_at"])
    return msg.delivery_log


# --------------------------------------------------------------------------- #
# Bookings (form data only for now — payment gateway returns later)
# --------------------------------------------------------------------------- #
def deliver_booking(booking) -> dict:
    """Booking requests: store (done) + formal business email, customer courtesy copy."""
    fields = [
        ("Reference", booking.reference),
        ("Service", (booking.item_type or "").replace("_", " ").title()),
        ("Item", booking.item_title),
        ("Name", booking.customer_name),
        ("Email", booking.customer_email),
        ("Phone", booking.customer_phone),
        ("Amount", f"{booking.total_amount} {booking.currency}" if booking.total_amount else ""),
        ("Status", (booking.status or "").title()),
    ]
    mail = send_business_email(
        subject=f"New Booking Request — {booking.item_title or booking.customer_name} "
                f"({booking.reference})",
        title="Booking Request",
        fields=fields,
        message=booking.notes,
        reply_to=booking.customer_email,
    )

    customer = {"ok": False, "skipped": True, "reason": "no customer email"}
    if booking.customer_email:
        customer = send_business_email(
            subject=f"We received your booking request ({booking.reference})",
            title="Booking Confirmation",
            fields=fields,
            message=(
                f"Thank you for choosing {settings.SITE_NAME}. We have received your booking "
                f"request and our travel consultant will contact you shortly to confirm the "
                f"details and arrange the payment.\n\n{booking.notes}"
            ),
        )

    booking.email_sent = bool(mail.get("ok"))
    booking.delivery_log = {"email": mail, "customer_email": customer}
    booking.save(update_fields=["email_sent", "delivery_log", "updated_at"])
    return booking.delivery_log
