import axiosInstance from "../core/axios";

// ─── Clés localStorage ────────────────────────────────────────────────────────
const AUTH_TOKEN_KEY    = "provider_auth_token";
const PENDING_EMAIL_KEY = "provider_pending_otp_email";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ProviderUser {
  id: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone?: string;
  // Le backend retourne "provider" ou le rôle métier (ex: "PROVIDER")
  role?: string;
}

export interface ProviderAuthResponse {
  user: ProviderUser;
  token: string;
}

export interface ProviderLoginStepResponse {
  otp_required: boolean;
  email: string;
}

// ─── Endpoints ───────────────────────────────────────────────────────────────
const LOGIN_ENDPOINT      = "/provider/login";
const VERIFY_OTP_ENDPOINT = "/provider/verify-otp";
const LOGOUT_ENDPOINT     = "/provider/logout";

// ─── Route dashboard ─────────────────────────────────────────────────────────
export const PROVIDER_DASHBOARD = "/provider/dashboard";

// ─── Service ─────────────────────────────────────────────────────────────────
export const providerAuthService = {

  /**
   * Étape 1 — Login email + password.
   * Laravel envoie l'OTP par mail → retourne { otp_required: true, email }.
   */
  login: async (credentials: { email: string; password: string }): Promise<ProviderLoginStepResponse> => {
    const response = await axiosInstance.post(LOGIN_ENDPOINT, credentials);
    const data = response.data?.data as ProviderLoginStepResponse;

    if (data?.otp_required && data?.email) {
      if (typeof window !== "undefined") {
        localStorage.setItem(PENDING_EMAIL_KEY, data.email);
      }
    }

    return data;
  },

  /**
   * Étape 2 — Vérification OTP.
   * Laravel retourne { user, token } → on persiste la session.
   */
  verifyOtp: async (email: string, code: string): Promise<ProviderAuthResponse> => {
    const response = await axiosInstance.post(VERIFY_OTP_ENDPOINT, { email, code });
    const data = response.data?.data as ProviderAuthResponse;

    if (data?.token && data?.user) {
      providerAuthService._persistSession(data);
    }

    return data;
  },

  /**
   * Persiste la session après OTP validé.
   * NE supprime PAS PENDING_EMAIL_KEY ici — fait dans clearPendingEmail().
   */
  _persistSession: (data: ProviderAuthResponse): void => {
    if (typeof window === "undefined") return;

    const { user, token } = data;

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem("provider_user_email", user.email ?? "");
    localStorage.setItem("provider_user_id", String(user.id ?? ""));
    localStorage.setItem("provider_user_role", user.role ?? "provider");

    // Gestion du nom — first_name/last_name OU name unique
    const firstName = user.first_name ?? "";
    const lastName  = user.last_name  ?? "";

    if (firstName || lastName) {
      localStorage.setItem("provider_first_name", firstName);
      localStorage.setItem("provider_last_name", lastName);
    } else if (user.name) {
      const parts = user.name.trim().split(/\s+/);
      localStorage.setItem("provider_first_name", parts[0] ?? "");
      localStorage.setItem("provider_last_name", parts.slice(1).join(" ") ?? "");
    } else {
      localStorage.setItem("provider_first_name", "");
      localStorage.setItem("provider_last_name", "");
    }
  },

  /**
   * À appeler APRÈS avoir capturé la route cible, AVANT router.replace().
   * Évite la race condition avec le guard de la page OTP.
   */
  clearPendingEmail: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PENDING_EMAIL_KEY);
    }
  },

  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(LOGOUT_ENDPOINT);
    } catch (error) {
      console.warn("Erreur logout provider (ignorée):", error);
    } finally {
      const keys = [
        AUTH_TOKEN_KEY,
        PENDING_EMAIL_KEY,
        "provider_user_email",
        "provider_user_id",
        "provider_user_role",
        "provider_first_name",
        "provider_last_name",
      ];
      if (typeof window !== "undefined") {
        keys.forEach((k) => localStorage.removeItem(k));
        window.location.href = "/provider/login";
      }
    }
  },

  // ─── Getters ───────────────────────────────────────────────────────────────
  getToken       : (): string | null => typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY)          : null,
  getFirstName   : (): string => typeof window !== "undefined" ? localStorage.getItem("provider_first_name") ?? "" : "",
  getLastName    : (): string => typeof window !== "undefined" ? localStorage.getItem("provider_last_name")  ?? "" : "",
  getEmail       : (): string => typeof window !== "undefined" ? localStorage.getItem("provider_user_email") ?? "" : "",
  getUserId      : (): string => typeof window !== "undefined" ? localStorage.getItem("provider_user_id")    ?? "" : "",
  getRole        : (): string => typeof window !== "undefined" ? localStorage.getItem("provider_user_role")  ?? "" : "",
  getPendingEmail: (): string => typeof window !== "undefined" ? localStorage.getItem(PENDING_EMAIL_KEY)     ?? "" : "",

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};