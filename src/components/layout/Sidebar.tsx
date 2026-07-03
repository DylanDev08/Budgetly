"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";
import { cn } from "@/lib/utils/classNames";
import { adminNavigationItems, navigationGroups, secondaryNavigationItems } from "@/components/layout/navigation";

type SettingsResponse = {
  item?: {
    role?: string;
  };
};

export function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
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
  const isAdmin = profileQuery.data?.item?.role === "admin";

  function toggleGroup(label: string, defaultOpen = false) {
    setOpenGroups((current) => ({ ...current, [label]: !(current[label] ?? defaultOpen) }));
  }

  function trackNavigation(label: string, href: string, section: string) {
    const payload = JSON.stringify({ action: "navigation", label, href, section });

    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon("/api/activity", new Blob([payload], { type: "application/json" }));
      return;
    }

    fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => null);
  }

  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-budget-border bg-black lg:sticky lg:top-0 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex h-20 items-center gap-3 border-b border-budget-border px-6">
        <BudgetlyLogo />
      </Link>

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <div className="grid gap-5">
          {navigationGroups.map((group) => (
            <section key={group.label} className="grid gap-2">
              {(() => {
                const groupActive = group.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
                const open = openGroups[group.label] ?? groupActive;

                return (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-budget-hover"
                      onClick={() => toggleGroup(group.label, groupActive)}
                    >
                      <span>
                        <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">{group.label}</span>
                        <span className="mt-1 block text-xs text-budget-muted">{group.description}</span>
                      </span>
                      <ArrowRight className={cn("h-4 w-4 text-budget-dim transition-transform", open && "rotate-90 text-budget-neon")} />
                    </button>
                    {open ? (
                      <div className="grid gap-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => trackNavigation(item.label, item.href, group.label)}
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
                    ) : null}
                  </>
                );
              })()}
            </section>
          ))}
        </div>

        {isAdmin ? (
          <div className="mt-6 border-t border-budget-border pt-4">
            {(() => {
              const adminOpen = openGroups.Admin ?? pathname.startsWith("/admin");

              return (
                <>
                  <button
                    type="button"
                    className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition hover:bg-budget-hover"
                    onClick={() => toggleGroup("Admin", pathname.startsWith("/admin"))}
                  >
                    <span>
                      <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">Admin</span>
                      <span className="mt-1 block text-xs text-budget-muted">Metricas, logs y control</span>
                    </span>
                    <ArrowRight className={cn("h-4 w-4 text-budget-dim transition-transform", adminOpen && "rotate-90 text-budget-neon")} />
                  </button>
                  {adminOpen
                    ? adminNavigationItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => trackNavigation(item.label, item.href, "Admin")}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted transition-colors hover:bg-budget-hover hover:text-budget-text",
                    active && "bg-budget-soft text-budget-neon",
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
                    })
                    : null}
                </>
              );
            })()}
          </div>
        ) : null}

        <div className="mt-6 border-t border-budget-border pt-4">
          {secondaryNavigationItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => trackNavigation(item.label, item.href, "Legal")}
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
