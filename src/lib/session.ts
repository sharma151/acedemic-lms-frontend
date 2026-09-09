import { create } from 'zustand';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  tenantId?: string | null;
}

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  tenantId: string | null;
  isInitializing: boolean;
  
  // Actions
  initialize: (userData: User | null) => void;
  setSession: (token: string, tenantId: string | null, user: User) => void;
  clearSession: () => void;
  setUser: (user: User | null) => void;
  updateToken: (token: string) => void;
}

const TOKEN_KEY = 'lms_access_token';
const TENANT_KEY = 'lms_tenant_id';

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY) || null;
  }
  return null;
};

const getInitialTenantId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TENANT_KEY) || Cookies.get(TENANT_KEY) || null;
  }
  return null;
};

export const useSession = create<SessionState>()((set) => ({
  user: null,
  isAuthenticated: false,
  token: getInitialToken(),
  tenantId: getInitialTenantId(),
  isInitializing: true,

  initialize: (userData) => {
    set({ user: userData, isAuthenticated: !!userData, isInitializing: false });
  },

  setSession: (token, tenantId, user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: 'lax' });
      
      if (tenantId) {
        localStorage.setItem(TENANT_KEY, tenantId);
        Cookies.set(TENANT_KEY, tenantId, { secure: true, sameSite: 'lax' });
      } else {
        localStorage.removeItem(TENANT_KEY);
        Cookies.remove(TENANT_KEY);
      }
    }
    set({ token, tenantId, user, isAuthenticated: true });
  },

  updateToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: 'lax' });
    }
    set({ token });
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      Cookies.remove(TOKEN_KEY);
      localStorage.removeItem(TENANT_KEY);
      Cookies.remove(TENANT_KEY);
    }
    set({ token: null, tenantId: null, user: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

export const getSessionState = () => useSession.getState();
