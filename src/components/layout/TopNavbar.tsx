import React from 'react';
import { Menu, Bell, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/ui/logout-button';

interface TopNavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function TopNavbar({ onMenuClick, title = "Academic LMS" }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white dark:bg-slate-950 px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Mail className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-slate-500">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold overflow-hidden">
             <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium hidden sm:block text-slate-700 dark:text-slate-300">
            Admin User
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
