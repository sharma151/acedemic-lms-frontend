import { create } from 'zustand';

export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  faviconUrl?: string;
  institutionName: string;
}

interface TenantState {
  tenantId: string | null;
  slug: string | null;
  domain: string | null;
  branding: TenantBranding | null;
  setTenantContext: (slug: string, domain: string) => void;
  setBranding: (branding: TenantBranding) => void;
  setTenantId: (id: string) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenantId: null,
  slug: null,
  domain: null,
  branding: null,
  setTenantContext: (slug, domain) => set({ slug, domain }),
  setBranding: (branding) => set({ branding }),
  setTenantId: (tenantId) => set({ tenantId }),
}));
