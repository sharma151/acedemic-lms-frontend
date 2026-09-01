import { ReactNode } from 'react';
import Link from 'next/link';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">LMS Super Admin</h1>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/tenants" className="hover:text-slate-300 transition-colors">Tenants</Link>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
