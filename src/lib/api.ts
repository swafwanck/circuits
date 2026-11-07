// Django REST API client for the admin panel.
// Update API_BASE_URL when your Django backend is deployed, or set VITE_API_URL.
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:8000,https://circuitholidays.com/";

const TOKEN_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg4MjQ3ODA3LCJpYXQiOjE3ODgyNDA2MDcsImp0aSI6IjJkOGNlYmZjZDRhNTRhZGFhZWMzZGJhOThkZTk2YjRhIiwidXNlcl9pZCI6MX0.ASZuJCP8IoMgNYgNhu9_JTUqeqmCXLxYXaBo-08ilJ8";
const REFRESH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc4ODg0NTQwNywiaWF0IjoxNzg4MjQwNjA3LCJqdGkiOiI3OGRhMWM2MmQ5M2U0ODY0OTNhOGIxOGI1ZGVjMDRmNSIsInVzZXJfaWQiOjF9.GS2IupCw-VJkk6wvSDjCLXYCSHLtQrxQRpb_uSSupII";
const USER_KEY = "admin_user";

export type AdminUser = {
  id?: number | string;
  username: string;
  email?: string;
  is_staff?: boolean;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setSession(
  access: string,
  refresh?: string,
  user?: AdminUser,
) {
  window.localStorage.setItem(TOKEN_KEY, access);
  if (refresh) window.localStorage.setItem(REFRESH_KEY, refresh);
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("admin-auth-changed"));
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("admin-auth-changed"));
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? getToken() : null;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(rest.body && !(rest.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string> | undefined),
  };

  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const res = await fetch(url, { ...rest, headers: finalHeaders });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    if (res.status === 401 && auth) {
      clearSession();
      // A stale token must never hide public content: retry once anonymously.
      if (token) {
        return request<T>(path, { ...options, auth: false });
      }
    }
    let message = res.statusText || "Request failed";
    if (isJson && body && typeof body === "object") {
      const obj = body as Record<string, unknown>;
      if (typeof obj.detail === "string") {
        message = obj.detail;
      } else if (typeof obj.message === "string") {
        message = obj.message;
        const details = obj.details;
        if (details && typeof details === "object") {
          const extra = Object.entries(details as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
            .join(" | ");
          if (extra) message = `${message} — ${extra}`;
        }
      } else {
        // DRF field errors: { price: ["A valid number is required."] }
        const parts = Object.entries(obj)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
          .filter(Boolean);
        if (parts.length) message = parts.join(" | ");
      }
    }
    throw new ApiError(res.status, message, body);
  }
  return body as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, data?: unknown, opts?: RequestInit & { auth?: boolean }) =>
    request<T>(path, {
      ...opts,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data ?? {}),
    }),
  put: <T>(path: string, data?: unknown, opts?: RequestInit) =>
    request<T>(path, {
      ...opts,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data ?? {}),
    }),
  patch: <T>(path: string, data?: unknown, opts?: RequestInit) =>
    request<T>(path, {
      ...opts,
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data ?? {}),
    }),
  delete: <T>(path: string, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};

// ---------- Auth ----------
export async function login(username: string, password: string) {
  // Matches the Django zip: /api/auth/login/ returns { access, refresh, user? }
  const data = await api.post<{ access: string; refresh?: string; user?: AdminUser }>(
    "/api/auth/login/",
    { username, password },
    { auth: false },
  );
  setSession(data.access, data.refresh, data.user ?? { username });
  return data;
}

export function logout() {
  clearSession();
}

// ---------- Paginated list helper (DRF default) ----------
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function listAll<T>(path: string): Promise<T[]> {
  const data = await api.get<Paginated<T> | T[]>(path);
  if (Array.isArray(data)) return data;
  return data.results ?? [];
}

// ---------- Typed resource helpers ----------
import type {
  Package, Deal, Hotel, Activity, Visa,
  GalleryItem, Booking, Enquiry, Payment, Testimonial, AdyenSessionResponse,
} from "./types";

export const resources = {
  packages: () => listAll<Package>("/api/packages/"),
  deals: () => listAll<Deal>("/api/deals/"),
  hotels: () => listAll<Hotel>("/api/hotels/"),
  activities: () => listAll<Activity>("/api/activities/"),
  visas: () => listAll<Visa>("/api/visas/"),
  gallery: () => listAll<GalleryItem>("/api/gallery/"),
  testimonials: () => listAll<Testimonial>("/api/testimonials/"),
  bookings: () => listAll<Booking>("/api/bookings/"),
  enquiries: () => listAll<Enquiry>("/api/enquiries/"),
  payments: () => listAll<Payment>("/api/payments-log/"),
};

// Home-page "featured" helpers — mirror Django `is_featured` / `is_trending`.
export const featured = {
  packages: () => listAll<Package>("/api/packages/?is_trending=true"),
  deals: () => listAll<Deal>("/api/deals/?is_featured=true"),
  hotels: () => listAll<Hotel>("/api/hotels/?is_featured=true"),
  activities: () => listAll<Activity>("/api/activities/?is_featured=true"),
  visas: () => listAll<Visa>("/api/visas/?is_featured=true"),
  gallery: () => listAll<GalleryItem>("/api/gallery/?is_featured=true"),
  testimonials: () => listAll<Testimonial>("/api/testimonials/?is_active=true"),
};

export const createBooking = (data: Partial<Booking>) =>
  api.post<Booking>("/api/bookings/", data, { auth: false });

export const createEnquiry = (data: Partial<Enquiry>) =>
  api.post<Enquiry>("/api/enquiries/", data, { auth: false });

export const startAdyenPayment = (data: {
  booking_ref: string;
  amount: number | string;
  currency: string;
  country_code?: string;
  return_url?: string;
  shopper_email?: string;
}) => api.post<AdyenSessionResponse>("/api/payments/sessions/", data, { auth: false });

// Admin-only: generate an Adyen Pay By Link URL (emails customer by default).
export const createPaymentLink = (data: {
  booking_ref: string;
  amount: number | string;
  currency: string;
  description?: string;
  shopper_email?: string;
  send_email?: boolean;
}) => api.post<{ payment_id: number; url: string }>("/api/payments/links/", data);

export const getPaymentStatus = (providerRef: string) =>
  api.get<{ reference: string; amount: string; currency: string; status: string; booking: string }>(
    `/api/payments/${providerRef}/`,
  );