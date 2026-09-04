"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getAuthMe } from "@/features/auth/api/auth";
import { Role } from "@/configs/constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndRoute = async () => {
      try {
        const response = await getAuthMe();
        
        if (response?.success && response?.data) {
          const role = response.data.role;
          
          if (role === Role.SUPER_ADMIN) {
            router.replace("/super-admin/dashboard");
          } else {
            router.replace("/dashboard");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        // If API fails (e.g. 401 Unauthorized), redirect to login
        router.replace("/login");
      }
    };

    checkAuthAndRoute();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
