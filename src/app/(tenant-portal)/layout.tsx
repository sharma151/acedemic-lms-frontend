import { ReactNode } from 'react';
import Link from 'next/link';

export default function TenantPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Tenant Portal</h1>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <Link href="/roles" className="hover:text-primary transition-colors">Roles</Link>
          <Link href="/users" className="hover:text-primary transition-colors">Users</Link>
          <Link href="/settings" className="hover:text-primary transition-colors">Settings</Link>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
