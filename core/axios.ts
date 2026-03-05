// src/core/axios.ts
import axios from "axios";

// ─── Clés — doivent correspondre exactement à celles des services ─────────────
const ADMIN_TOKEN_KEY    = "auth_token";
const PROVIDER_TOKEN_KEY = "provider_auth_token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST : injecte le bon token selon la session active ───────────────────
api.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    // Priorité : admin d'abord, provider ensuite
    const adminToken    = localStorage.getItem(ADMIN_TOKEN_KEY);
    const providerToken = localStorage.getItem(PROVIDER_TOKEN_KEY);

    const token = adminToken ?? providerToken ?? null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE : gestion 401 avec redirect contextuelle ───────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") return Promise.reject(error);

    if (error.response?.status === 401) {
      const isProvider = !!localStorage.getItem(PROVIDER_TOKEN_KEY);
      const isAdmin    = !!localStorage.getItem(ADMIN_TOKEN_KEY);

      if (isProvider) {
        // Nettoyage session provider
        [
          PROVIDER_TOKEN_KEY,
          "provider_pending_otp_email",
          "provider_user_email",
          "provider_user_id",
          "provider_user_role",
          "provider_first_name",
          "provider_last_name",
        ].forEach((k) => localStorage.removeItem(k));

        window.location.href = "/provider/login";

      } else if (isAdmin) {
        // Nettoyage session admin
        [
          ADMIN_TOKEN_KEY,
          "user_role",
          "pending_otp_email",
          "first_name",
          "last_name",
          "user_email",
          "user_id",
        ].forEach((k) => localStorage.removeItem(k));

        window.location.href = "/admin/login";

      } else {
        // Fallback — aucune session connue
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;