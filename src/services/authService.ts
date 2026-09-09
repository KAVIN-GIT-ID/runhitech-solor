import { saveAdminUser, getActiveAdminSession, clearAdminSession } from "./dbService";

export const GOOGLE_CLIENT_ID = "1081442493959-9kfrfuh0vgrlg683h1a3v8siq9vop1sa.apps.googleusercontent.com";

export type UserRole = "admin" | "customer";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
  createdAt: number;
  lastLogin: number;
}

/**
 * Robust Base64URL JWT Decoder
 */
function parseJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    const binaryStr = atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("JWT Decode primary error, trying fallback:", e);
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e2) {
      console.error("JWT Decode fallback error:", e2);
      return null;
    }
  }
}

/**
 * Handle Unified Google Login (100% Dynamic Cloudflare D1 Database Role Sync)
 */
export async function handleGoogleLogin(credential: string): Promise<{ success: boolean; user?: AppUser; error?: string }> {
  try {
    const profile = parseJwt(credential);
    if (!profile || !profile.email) {
      return { success: false, error: "Could not read Google account profile." };
    }

    const emailLower = (profile.email as string).trim().toLowerCase();
    let resolvedRole: UserRole = "customer";

    // 1. Sync with Cloudflare D1 and fetch the TRUE database role
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: profile.sub,
          email: emailLower,
          name: profile.name,
          picture: profile.picture
        })
      });

      if (res.ok) {
        const data = await res.json() as { user?: { role: string } };
        if (data.user?.role === "admin" || data.user?.role === "super_admin") {
          resolvedRole = "admin";
        }
      }
    } catch (apiErr) {
      console.debug("Backend D1 auth sync note:", apiErr);
    }

    const user: AppUser = {
      id: profile.sub || `user_${Date.now()}`,
      email: emailLower,
      name: profile.name || profile.email.split("@")[0],
      picture: profile.picture,
      role: resolvedRole,
      createdAt: Date.now(),
      lastLogin: Date.now()
    };

    // 2. Persist permanently in localStorage
    try {
      localStorage.setItem("runhitech_active_user", JSON.stringify(user));
      if (resolvedRole === "admin") {
        localStorage.setItem("runhitech_active_admin", JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: "super_admin",
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }));
      } else {
        localStorage.removeItem("runhitech_active_admin");
      }
    } catch (lsErr) {
      console.debug("LocalStorage save note:", lsErr);
    }

    // 3. Try IndexedDB background cache safely
    if (resolvedRole === "admin") {
      try {
        saveAdminUser({
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: "super_admin"
        }).catch((e) => console.debug("IndexedDB background save note:", e));
      } catch (idbErr) {
        console.debug("IndexedDB save note:", idbErr);
      }
    }

    // 4. Broadcast auth state to entire application
    window.dispatchEvent(new Event("runhitech_auth_state_changed"));

    return { success: true, user };
  } catch (err: any) {
    console.error("handleGoogleLogin error:", err);
    return { success: false, error: err?.message || "Sign in error" };
  }
}

/**
 * Get active authenticated user (Admin or Customer)
 */
export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("runhitech_active_user");
    if (raw) return JSON.parse(raw);
    
    const adminRaw = getActiveAdminSession();
    if (adminRaw) {
      return {
        ...adminRaw,
        role: "admin"
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Re-validate & sync user role dynamically from Cloudflare D1 on app startup / page refresh
 */
export async function refreshUserSessionFromDB(): Promise<AppUser | null> {
  const current = getCurrentUser();
  if (!current || !current.email) return null;

  try {
    const res = await fetch(`/api/auth?email=${encodeURIComponent(current.email)}`);
    if (res.ok) {
      const data = await res.json() as { user?: { role: string; name?: string; picture?: string } };
      if (data.user && data.user.role) {
        const newRole: UserRole = (data.user.role === "admin" || data.user.role === "super_admin") ? "admin" : "customer";
        
        if (newRole !== current.role) {
          const updated: AppUser = {
            ...current,
            role: newRole
          };
          localStorage.setItem("runhitech_active_user", JSON.stringify(updated));
          
          if (newRole === "admin") {
            localStorage.setItem("runhitech_active_admin", JSON.stringify({
              id: updated.id,
              email: updated.email,
              name: updated.name,
              picture: updated.picture,
              role: "super_admin",
              createdAt: updated.createdAt,
              lastLogin: updated.lastLogin
            }));
          } else {
            localStorage.removeItem("runhitech_active_admin");
          }

          window.dispatchEvent(new Event("runhitech_auth_state_changed"));
          return updated;
        }
      }
    }
  } catch (e) {
    console.debug("Role refresh note:", e);
  }
  return current;
}

/**
 * 100% Complete Logout: Clears all local storage, session storage, disables auto-select, and redirects cleanly
 */
export function logoutUser(redirectToHome: boolean = true): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("runhitech_active_user");
    localStorage.removeItem("runhitech_active_admin");
    localStorage.removeItem("runhitech_crm_session");
    localStorage.removeItem("runhitech_user_session");
    sessionStorage.clear();
  } catch (e) {
    console.debug("Storage clear note:", e);
  }
  
  try {
    clearAdminSession();
  } catch (e) {
    console.debug("clearAdminSession note:", e);
  }

  try {
    const googleApi = (window as unknown as { google?: { accounts?: { id?: { disableAutoSelect: () => void } } } })?.google;
    if (googleApi?.accounts?.id?.disableAutoSelect) {
      googleApi.accounts.id.disableAutoSelect();
    }
  } catch (e) {
    console.debug("Google disableAutoSelect note:", e);
  }

  window.dispatchEvent(new Event("runhitech_auth_state_changed"));

  if (redirectToHome) {
    window.location.href = "/";
  }
}
