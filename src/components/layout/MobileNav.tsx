"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BudgetlyLogo } from "@/components/brand/BudgetlyLogo";
import { cn } from "@/lib/utils/classNames";
import { adminNavigationItems, navigationGroups, secondaryNavigationItems } from "@/components/layout/navigation";

type SettingsResponse = {
  item?: {
    role?: string;
  };
};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const profileQuery = useQuery<SettingsResponse>({
    queryKey: ["/api/settings", "mobile-nav"],
    queryFn: async () => {
      const response = await fetch("/api/settings");

      if (!response.ok) {
        return {};
      }

      return response.json();
    },
  });
  const isAdmin = profileQuery.data?.item?.role === "admin";

  return (
    <div className="lg:hidden">
      <Button aria-label="Abrir navegacion" size="icon" variant="secondary" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="h-full w-[min(22rem,88vw)] overflow-y-auto border-r border-budget-border bg-budget-surface shadow-soft"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 360, damping: 34 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-budget-border px-5">
                <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
                  <BudgetlyLogo compact />
                  <span className="font-semibold text-budget-text">Budgetly</span>
                </Link>
                <Button aria-label="Cerrar navegacion" size="icon" variant="ghost" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-5 p-4">
                {navigationGroups.map((group) => (
                  <section key={group.label} className="grid gap-2">
                    <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">{group.label}</p>
                    <div className="grid gap-1">
                      {group.items.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted hover:bg-budget-hover hover:text-budget-text",
                              active && "bg-budget-soft text-budget-neon",
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
                {isAdmin ? (
                  <section className="grid gap-2 border-t border-budget-border pt-4">
                    <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">Admin</p>
                    <div className="grid gap-1">
                      {adminNavigationItems.map((item) => {
                        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted hover:bg-budget-hover hover:text-budget-text",
                              active && "bg-budget-soft text-budget-neon",
                            )}
                          >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
                <section className="grid gap-2 border-t border-budget-border pt-4">
                  <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-budget-dim">Sistema</p>
                  <div className="grid gap-1">
                    {secondaryNavigationItems.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-budget-muted hover:bg-budget-hover hover:text-budget-text",
                            active && "bg-budget-soft text-budget-neon",
                          )}
                        >
                          <Icon className="h-4 w-4" aria-hidden="true" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
