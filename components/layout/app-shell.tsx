"use client";

import { Bell, LayoutDashboard, Menu, Package, Users, CalendarDays, BriefcaseBusiness, MoonStar, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/usuarios", label: "Usuarios", icon: Users },
  { href: "/rh", label: "RH y Nominas", icon: BriefcaseBusiness },
  { href: "/cronograma", label: "Cronograma", icon: CalendarDays },
  { href: "/assets", label: "Activos", icon: Package },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const sidebar = useMemo(
    () => (
      <aside
        className={cn(
          "flex h-full flex-col border-r border-white/15 bg-slate-900/85 px-3 py-4 text-slate-100 backdrop-blur-xl transition-all",
          isDesktopCollapsed ? "w-[88px]" : "w-[260px]",
        )}
      >
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">IP</div>
          {!isDesktopCollapsed ? (
            <div>
              <p className="text-sm font-semibold">Imperia</p>
              <p className="text-xs text-slate-300">By Partum</p>
            </div>
          ) : null}
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                  active ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isDesktopCollapsed ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </aside>
    ),
    [isDesktopCollapsed, pathname],
  );

  return (
    <div className="min-h-screen md:flex">
      <div className="hidden md:block">{sidebar}</div>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 px-3 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="md:hidden" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="hidden md:inline-flex" onClick={() => setIsDesktopCollapsed((prev) => !prev)}>
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex-1">
              <Input placeholder="Buscar empleados, eventos, activos..." />
            </div>

            <Button
              variant="outline"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Cambiar tema"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>

            <Button variant="outline" aria-label="Notificaciones">
              <Bell className="h-4 w-4" />
            </Button>

            <div className="hidden rounded-full border border-border px-3 py-1.5 text-sm sm:block">Admin</div>
          </div>
        </header>

        <main className="flex-1 px-3 py-4 sm:px-6">{children}</main>
      </div>

      {isMobileOpen ? (
        <motion.div
          className="fixed inset-0 z-50 bg-slate-950/55 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileOpen(false)}
        >
          <motion.div
            className="h-full w-[85%] max-w-[290px]"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
          >
            {sidebar}
          </motion.div>
        </motion.div>
      ) : null}
    </div>
  );
}
