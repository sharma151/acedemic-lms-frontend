"use client";

import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken, removeTenantId } from "@/lib/auth";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { getAuthMe } from "@/features/auth/api/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          if (isMounted) setIsInitializing(false);
          return;
        }

        const response = await getAuthMe();
        if (response?.success && response?.data && isMounted) {
          setUser(response.data); // response.data contains the user profile fields
        } else if (isMounted) {
          removeAuthToken();
          removeTenantId();
          setUser(null);
        }
      } catch (error) {
        if (isMounted) {
          removeAuthToken();
          removeTenantId();
          setUser(null);
          console.log("Error during auth initialization:", error);
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    const handleUnauthorized = () => {
      if (isMounted) {
        removeAuthToken();
        removeTenantId();
        setUser(null);
        window.location.href = "/login"; // Force full reload to clean any deep states, or router.push('/login') for client-side
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    initAuth();

    return () => {
      isMounted = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [setUser]);

  if (isInitializing) {
    return null;
  }

  return <>{children}</>;
}
