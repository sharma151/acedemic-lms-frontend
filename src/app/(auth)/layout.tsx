import { headers } from 'next/headers';
import { ReactNode } from 'react';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  // Use headers() and wrap in Promise.resolve() or await it per Next 15 guidelines.
  // Although in Next.js 15, headers() is synchronous in some contexts, it's recommended to treat it as async or use standard methods.
  const headersList = await headers();
  const tenantSlug = headersList.get('x-tenant-slug');
  const tenantDomain = headersList.get('x-tenant-domain');

  // In a real app, you would fetch branding data server-side here based on the tenantSlug
  // const branding = await fetchBranding(tenantSlug);
  
  const branding = {
    institutionName: tenantSlug ? `${tenantSlug.toUpperCase()} LMS` : 'SuperAdmin Portal',
    primaryColor: 'hsl(var(--primary))',
    logoUrl: '/placeholder-logo.png', // Fallback logo
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Column - Branding Showcase */}
      <div 
        className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white bg-slate-900"
        style={{
          // Use CSS variables for dynamic theming injected by TenantThemeProvider on client,
          // but we can set inline styles for SSR if we fetch real colors here.
          backgroundColor: branding.primaryColor !== 'hsl(var(--primary))' ? branding.primaryColor : undefined
        }}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold">
            {branding.institutionName.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {branding.institutionName}
          </h1>
        </div>
        
        <div className="max-w-lg mt-auto mb-12">
          <h2 className="text-4xl font-semibold mb-4 leading-tight">
            Empowering education through advanced technology.
          </h2>
          <p className="text-lg opacity-80">
            Join thousands of students and educators in a seamless learning experience designed for the modern academic institution.
          </p>
        </div>
      </div>

      {/* Right Column - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
