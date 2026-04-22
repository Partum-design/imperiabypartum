import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { AppShell } from "@/components/layout/app-shell";
import { NotificationPermissionPrompt } from "@/components/notifications/permission-prompt";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imperia By Partum",
  description: "Intranet/ERP corporativo",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell>{children}</AppShell>
          <NotificationPermissionPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
