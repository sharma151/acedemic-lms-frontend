import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon, Mountain } from 'lucide-react';

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

interface SidebarProps {
  items: SidebarNavItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ items, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  // Group items by section
  const sections = items.reduce((acc, item) => {
    const section = item.section || 'General';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, SidebarNavItem[]>);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400">
            <Mountain className="w-6 h-6" />
            <span>LMS Portal</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {Object.entries(sections).map(([section, sectionItems]) => (
            <div key={section} className="mb-6 px-4">
              <h4 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {section}
              </h4>
              <nav className="space-y-1">
                {sectionItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50" 
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
