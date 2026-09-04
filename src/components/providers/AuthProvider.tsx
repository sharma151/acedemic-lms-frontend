"use client";

import { useEffect, useState } from "react";
import { getAuthToken, removeAuthToken } from "@/lib/auth";
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
          setUser(response.data);
        } else if (isMounted) {
          removeAuthToken();
          setUser(null);
        }
      } catch (error) {
        if (isMounted) {
          removeAuthToken();
          setUser(null);
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [setUser]);

  if (isInitializing) {
    return null; 
  }

  return <>{children}</>;
}
