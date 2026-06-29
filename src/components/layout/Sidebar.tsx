"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";
import { cn } from "@/lib/utils/classNames";
import { adminNavigationItem, navigationGroups, secondaryNavigationItems } from "@/components/layout/navigation";

type SettingsResponse = {
  item?: {
    role?: string;
  };
};

export function Sidebar() {
  const pathname = usePathname();
  const profileQuery = useQuery<SettingsResponse>({
    queryKey: ["/api/settings", "sidebar"],
    queryFn: async () => {
      const response = await fetch("/api/settings");

      if (!response.ok) {
        return {};
      }

      return response.json();
    },
  });
  const items = profileQuery.data?.item?.role === "admin"
    ? [adminNavigationItem, ...secondaryNavigationItems]
    : secondaryNavigationItems;

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-budget-border bg-black lg:sticky lg:top-0 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex h-20 items-center gap-3 border-b border-budget-border px-6">
        <BudgetlyLogo />
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="grid gap-5">
          {navigationGroups.map((group) => (
            <section key={group.label} className="grid gap-2">
              <div className="px-3">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">{group.label}</p>
                <p className="mt-1 text-xs text-budget-muted">{group.description}</p>
              </div>
              <div className="grid gap-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted transition-colors hover:bg-budget-hover hover:text-budget-text",
                        active && "bg-budget-soft text-budget-neon",
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 border-t border-budget-border pt-4">
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted transition-colors hover:bg-budget-hover hover:text-budget-text",
                  active && "bg-budget-soft text-budget-neon",
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
        <a className="mt-2 block font-medium text-budget-neon hover:text-budget-green" href="mailto:contacto@budgetly.app">
          contacto@budgetly.app
        </a>
      </footer>
    </aside>
  );
}
