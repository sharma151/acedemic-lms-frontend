"use client";

import { useEffect } from "react";
import { useSession, getSessionState } from "@/lib/session";
import { getAuthMe } from "@/features/auth/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isInitializing = useSession((state) => state.isInitializing);
  const initialize = useSession((state) => state.initialize);
  const clearSession = useSession((state) => state.clearSession);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { token } = getSessionState();
        if (!token) {
          if (isMounted) initialize(null);
          return;
        }

        const response = await getAuthMe();
        if (response?.success && response?.data && isMounted) {
          initialize(response.data); // response.data contains the user profile fields
        } else if (isMounted) {
          clearSession();
          initialize(null); // Just to clear initializing state
        }
      } catch (error) {
        if (isMounted) {
          clearSession();
          initialize(null);
          console.log("Error during auth initialization:", error);
        }
      }
    };

    const handleUnauthorized = () => {
      if (isMounted) {
        clearSession();
        window.location.href = "/login"; // Force full reload to clean any deep states
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    initAuth();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [initialize, clearSession]);

  if (isInitializing) {
    return null;
  }

  return <>{children}</>;
}
