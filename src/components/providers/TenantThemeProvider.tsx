'use client';

import { useEffect } from 'react';
import { useTenantStore } from '@/features/tenants/store/useTenantStore';

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const branding = useTenantStore((state) => state.branding);

  useEffect(() => {
    if (branding) {
      const root = document.documentElement;
      // Inject CSS variables for primary and secondary colors dynamically
      if (branding.primaryColor) {
        // Convert hex to HSL if necessary, or just override Tailwind's variables directly if we adapt globals.css
        root.style.setProperty('--primary', branding.primaryColor);
      }
      if (branding.secondaryColor) {
        root.style.setProperty('--secondary', branding.secondaryColor);
      }
      
      if (branding.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = branding.faviconUrl;
      }
    }
  }, [branding]);

  return <>{children}</>;
}
