import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { TenantThemeProvider } from "@/components/providers/TenantThemeProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "Academic LMS",
  description: "Multi-Tenant Academic Learning Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <AuthProvider>
            <TenantThemeProvider>
              <TooltipProvider>
                {children}
                <Toaster richColors position="top-right" />
              </TooltipProvider>
            </TenantThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
