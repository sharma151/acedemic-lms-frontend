import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { TenantThemeProvider } from "@/components/providers/TenantThemeProvider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <QueryProvider>
          <TenantThemeProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </TenantThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
