"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/classNames";
import { navigationItems, secondaryNavigationItems } from "@/components/layout/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-budget-border bg-white lg:sticky lg:top-0 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex h-20 items-center gap-3 border-b border-budget-border px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-budget-green text-base font-bold text-white">
          B
        </div>
        <div>
          <p className="text-base font-semibold text-budget-text">Budgetly</p>
          <p className="text-xs font-medium text-budget-muted">Finanzas personales</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="grid gap-1">
          {navigationItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted transition-colors hover:bg-slate-50 hover:text-budget-text",
                  active && "bg-budget-soft text-budget-dark",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 border-t border-budget-border pt-4">
          {secondaryNavigationItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted transition-colors hover:bg-slate-50 hover:text-budget-text",
                  active && "bg-budget-soft text-budget-dark",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <footer className="border-t border-budget-border p-5 text-xs leading-5 text-budget-muted">
        <p className="font-medium text-budget-text">Budgetly</p>
        <p>Copyright 2026. Todos los derechos reservados.</p>
        <a className="mt-2 block font-medium text-budget-dark hover:text-budget-green" href="mailto:contacto@budgetly.app">
          contacto@budgetly.app
        </a>
      </footer>
    </aside>
  );
}
