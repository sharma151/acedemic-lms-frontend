import Cookies from 'js-cookie';

const TOKEN_KEY = 'lms_access_token';

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY) || Cookies.get(TOKEN_KEY);
  }
  return null;
};

export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    Cookies.set(TOKEN_KEY, token, { secure: true, sameSite: 'lax' });
  }
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY);
  }
};

const TENANT_KEY = 'lms_tenant_id';

export const getTenantId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TENANT_KEY) || Cookies.get(TENANT_KEY);
  }
  return null;
};

export const setTenantId = (tenantId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TENANT_KEY, tenantId);
    Cookies.set(TENANT_KEY, tenantId, { secure: true, sameSite: 'lax' });
  }
};

export const removeTenantId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TENANT_KEY);
    Cookies.remove(TENANT_KEY);
  }
};
