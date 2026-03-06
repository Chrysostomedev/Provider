// "use client";

// /**
//  * useProviderGuard
//  * ─────────────────
//  * Hook à appeler en haut de CHAQUE page /provider/** (sauf /provider/login et /provider/otp).
//  *
//  * Règles :
//  * 1. Si un token admin est présent → nettoyage + redirect /provider/login
//  *    (un admin ne doit pas naviguer dans l'espace provider)
//  * 2. Si aucun token provider → redirect /provider/login
//  * 3. Sinon → OK, l'utilisateur est bien un provider authentifié
//  *
//  * Usage :
//  *   const { isReady } = useProviderGuard();
//  *   if (!isReady) return null; // ou un spinner
//  */

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { providerAuthService } from "@services/providerAuthService";

// interface UseProviderGuardReturn {
//   /** true quand la vérification est terminée et l'accès autorisé */
//   isReady: boolean;
// }

// export function useProviderGuard(): UseProviderGuardReturn {
//   const router   = useRouter();
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     // ── Règle 1 : un admin connecté ne peut pas accéder à l'espace provider ──
//     if (providerAuthService.isAdminLoggedIn()) {
//       // On vide la session admin résiduelle pour éviter les conflits de token
//       ["auth_token", "user_role", "pending_otp_email",
//        "first_name", "last_name", "user_email", "user_id"]
//         .forEach((k) => localStorage.removeItem(k));
// s
//       router.replace("/provider/login");
//       return;
//     }

//     // ── Règle 2 : pas de token provider → login ───────────────────────────────
//     if (!providerAuthService.isAuthenticated()) {
//       router.replace("/provider/login");
//       return;
//     }

//     // ── Règle 3 : accès autorisé ──────────────────────────────────────────────
//     setIsReady(true);
//   }, [router]);

//   return { isReady };
// }