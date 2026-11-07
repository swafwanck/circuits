"""Regression tests for the issues reported by the project owner.

1. Public content must be readable WITHOUT an admin login (and even with a
   garbage Authorization header present).
2. Admin can toggle the ``is_active`` boolean through a PATCH.
3. Enquiry / contact / booking submissions are stored and emailed to the
   business mailbox (Google Form is no longer used).
"""
from unittest import mock

from django.core import mail
from rest_framework.test import APITestCase

from .models import Package, Enquiry, ContactMessage, Booking


class PublicReadTestCase(APITestCase):
    def test_public_list_without_login(self):
        Package.objects.create(title="Bali Escape", price=999)
        res = self.client.get("/api/packages/")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["results"]), 1)

    def test_public_list_with_garbage_token(self):
        Package.objects.create(title="Bali Escape", price=999)
        res = self.client.get("/api/packages/", HTTP_AUTHORIZATION="Bearer garbage.token.here")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["results"]), 1)

    def test_public_detail_without_login(self):
        Package.objects.create(title="Bali Escape", slug="bali-escape", price=999)
        res = self.client.get("/api/packages/bali-escape/")
        self.assertEqual(res.status_code, 200)


class AdminActiveToggleTestCase(APITestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.admin = User.objects.create_user("admin", password="pass12345", is_staff=True)
        self.package = Package.objects.create(title="Bali Escape", price=999, is_active=True)

    def _login(self):
        res = self.client.post("/api/auth/login/", {"username": "admin", "password": "pass12345"})
        self.assertEqual(res.status_code, 200, res.data)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {res.data['access']}")

    def test_patch_active_false(self):
        self._login()
        res = self.client.patch(f"/api/packages/{self.package.pk}/", {"is_active": False},
                                format="json")
        self.assertEqual(res.status_code, 200, res.data)
        self.package.refresh_from_db()
        self.assertFalse(self.package.is_active)

    def test_patch_active_false_multipart(self):
        """The admin form can also send the toggle as a multipart 'false' string."""
        self._login()
        res = self.client.patch(f"/api/packages/{self.package.pk}/", {"is_active": "false"},
                                format="multipart")
        self.assertEqual(res.status_code, 200, res.data)
        self.package.refresh_from_db()
        self.assertFalse(self.package.is_active)

    def test_patch_active_true_multipart(self):
        self.package.is_active = False
        self.package.save()
        self._login()
        res = self.client.patch(f"/api/packages/{self.package.pk}/", {"is_active": "true"},
                                format="multipart")
        self.assertEqual(res.status_code, 200, res.data)
        self.package.refresh_from_db()
        self.assertTrue(self.package.is_active)


class SubmissionEmailTestCase(APITestCase):
    def _assert_business_mail(self):
        self.assertGreater(len(mail.outbox), 0, "no notification email was sent")
        to = [a for msg in mail.outbox for a in msg.to]
        self.assertIn("info@circuitholidays.com", to)
        cc = [a for msg in mail.outbox for a in (msg.cc or [])]
        self.assertIn("circuitholidays@gmail.com", cc)

    def test_enquiry_stored_and_emailed(self):
        res = self.client.post("/api/enquiries/", {
            "name": "Muhammed", "email": "guest@example.com", "phone": "971501234567",
            "message": "Maldives honeymoon", "service": "package", "source": "package",
        }, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(Enquiry.objects.count(), 1)
        self._assert_business_mail()

    def test_visa_enquiry_whatsapp_link(self):
        res = self.client.post("/api/enquiries/", {
            "name": "Visa Guest", "email": "guest@example.com", "phone": "971501234567",
            "item_type": "visa", "item_title": "UAE Visa",
        }, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        enquiry = Enquiry.objects.get()
        self.assertIn("wa.me", enquiry.whatsapp_url)
        self._assert_business_mail()

    def test_contact_message_stored_and_emailed(self):
        res = self.client.post("/api/contacts/", {
            "name": "Guest", "email": "guest@example.com", "phone": "971501234567",
            "service": "package", "message": "Hello there",
        }, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self._assert_business_mail()

    def test_booking_stored_and_emailed(self):
        res = self.client.post("/api/bookings/", {
            "customer_name": "Guest", "customer_email": "guest@example.com",
            "customer_phone": "971586416434", "item_type": "package",
            "item_title": "Bali Escape", "amount": "500", "currency": "AED",
        }, format="json")
        self.assertEqual(res.status_code, 201, res.data)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertTrue(Booking.objects.get().reference.startswith("BK"))
        self._assert_business_mail()


class BookingAllTypesTestCase(APITestCase):
    def test_booking_for_every_service_is_stored(self):
        for it in ["package", "deal", "visa", "activity", "hotel"]:
            res = self.client.post("/api/bookings/", {
                "customer_name": "A B", "customer_email": "a@b.com", "customer_phone": "+971501234567",
                "item_type": it, "item_title": "X", "item_id": "x", "amount": "100",
                "currency": "AED", "notes": "hi", "status": "pending",
            }, format="json")
            self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(Booking.objects.count(), 5)


class GalleryVideoTestCase(APITestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        get_user_model().objects.create_user("gadmin", password="pass12345", is_staff=True)
        self.client.login(username="gadmin", password="pass12345")
        from django.contrib.auth import get_user_model as g
        self.client.force_authenticate(g().objects.get(username="gadmin"))

    def test_video_item_with_file_thumbnail_and_youtube(self):
        from django.core.files.uploadedfile import SimpleUploadedFile
        import io
        from PIL import Image
        buf = io.BytesIO(); Image.new("RGB", (4, 4)).save(buf, "PNG")
        res = self.client.post("/api/gallery/", {
            "title": "Desert", "kind": "video",
            "image": SimpleUploadedFile("t.png", buf.getvalue(), content_type="image/png"),
            "videos": SimpleUploadedFile("v.mp4", b"\x00\x00\x00\x18ftypmp42", content_type="video/mp4"),
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        }, format="multipart")
        self.assertEqual(res.status_code, 201, res.content)
        self.assertEqual(res.data["kind"], "video")
        self.assertEqual(len(res.data["videos"]), 1)
        self.assertTrue(res.data["image_url"])