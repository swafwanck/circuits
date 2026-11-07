# Circuit Holidays — Django REST API + Website (one server / one project)

Everything runs from ONE Django server: the REST API, the admin panel, uploaded
media, Swagger docs **and** the built React website. One folder, one command.

## What's new in this version

* **All form submissions go to email, not Google Form.** Every enquiry, visa
  enquiry, call-back request, contact message and booking request is stored in
  PostgreSQL/SQLite and emailed to **info@circuitholidays.com** with a copy to
  **circuitholidays@gmail.com** through the GoDaddy mail server, in a formal
  email format. (Google Form delivery was removed at the owner's request.)
* **Visa enquiries and call-back requests** additionally open a WhatsApp chat
  (plain `wa.me` deep link — no third-party service).
* **Payments are paused.** The website booking forms now only store the form
  data and email it. The Adyen gateway code stays in the project and returns in
  the next update.
* **Frontend + backend in one project.** Django serves the built website from
  `frontend_dist/` — deploy a single folder to a single host.
* Public website content is readable with or without an admin login.

## 1. Requirements

* Python 3.11+ and PostgreSQL (or use the built-in SQLite for testing).
* Node.js 18+ (only needed to build the website once).

## 2. Backend setup — step by step

```bash
# 1) create an isolated Python environment
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# 2) install dependencies
pip install -r requirements.txt

# 3) configure the environment
copy .env.example .env        # Windows
cp .env.example .env          # macOS / Linux
#   then edit .env:
#   DJANGO_SECRET_KEY          -> a long random string
#   DATABASE_URL               -> your PostgreSQL URL
#   EMAIL_HOST_USER            -> info@circuitholidays.com
#   EMAIL_HOST_PASSWORD        -> the mailbox password
#   NOTIFY_TO_EMAILS / NOTIFY_CC_EMAILS -> already set correctly

# 4) create the database tables
python manage.py migrate

# 5) create the admin account (answers "does the admin panel login")
python manage.py createsuperuser

# 6) optional demo content
python manage.py seed_demo

# 7) start the server
python manage.py runserver
```

* REST API root:  http://localhost:8000/api/
* Swagger docs:   http://localhost:8000/api/docs/
* Admin panel:    http://localhost:8000/admin/

## 3. Build the website into the same server (one folder)

From the **frontend project folder** (the React website):

```bash
npm install
npm run build
```

Then copy the build output into the backend folder so Django serves it:

```bash
# macOS / Linux
cp -r dist/* /path/to/backendcircuit-fixed/frontend_dist/

# Windows (PowerShell)
Copy-Item -Recurse -Force dist\* C:\path\to\backendcircuit-fixed\frontend_dist\
```

Restart Django and open **http://localhost:8000/** — the full website, admin
panel, API and uploaded images now all live on one server.

> The folder Django serves is controlled by `FRONTEND_DIST_DIR` in `.env`
> (default: `frontend_dist` inside the backend folder).

## 4. Email (GoDaddy)

All website submissions are stored in the database first, then emailed in a
formal format. Configure in `.env`:

| Setting | GoDaddy value |
| --- | --- |
| `EMAIL_HOST` | `smtpout.secureserver.net` |
| `EMAIL_PORT` | `465` |
| `EMAIL_USE_SSL` | `True` |
| `EMAIL_HOST_USER` | `info@circuitholidays.com` |
| `EMAIL_HOST_PASSWORD` | the mailbox password |
| `DEFAULT_FROM_EMAIL` | `info@circuitholidays.com` |
| `NOTIFY_TO_EMAILS` | `info@circuitholidays.com` |
| `NOTIFY_CC_EMAILS` | `circuitholidays@gmail.com` |

(Microsoft 365-hosted mail uses `smtp.office365.com` with `EMAIL_USE_TLS=True`
and `EMAIL_USE_SSL=False` instead.)

With `DJANGO_DEBUG=True` and no `EMAIL_HOST_PASSWORD`, emails are printed to
the console instead of sent — handy for local testing.

## 5. Production

```bash
pip install gunicorn
python manage.py collectstatic --noinput
gunicorn backendcircuit.wsgi:application --bind 0.0.0.0:8000
```

Set in `.env` for production:

* `DJANGO_DEBUG=False`
* `DJANGO_ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com`
* `CORS_ALLOWED_ORIGINS=` (empty — the website is served from the same origin)

## 6. API summary

| Area | Endpoint |
| --- | --- |
| Content (public GET, admin write) | `/api/packages/`, `/api/deals/`, `/api/hotels/`, `/api/activities/`, `/api/visas/`, `/api/gallery/`, `/api/testimonials/`, `/api/home-hero-slider/`, `/api/home-gallery-slider/` |
| Submissions (public POST) | `/api/enquiries/`, `/api/contacts/`, `/api/bookings/` |
| Admin management | `/api/payments-log/`, `/api/payment-links/`, `/api/settings/`, `/api/uploads/` |
| Auth (JWT) | `/api/auth/login/`, `/api/auth/refresh/`, `/api/auth/me/` |
| Docs | `/api/docs/` (Swagger), `/api/redoc/`, `/api/schema/` |

Payments (`/api/payments/...`) remain in the codebase but are unused until the
gateway is switched back on in the next update.
