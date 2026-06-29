"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/classNames";
import { adminNavigationItem, navigationItems, secondaryNavigationItems } from "@/components/layout/navigation";

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
  const secondaryItems =
    profileQuery.data?.item?.role === "admin" ? [adminNavigationItem, ...secondaryNavigationItems] : secondaryNavigationItems;
  const items = [...navigationItems, ...secondaryItems];

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
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-budget-green font-bold text-budget-bg">
                    B
                  </div>
                  <span className="font-semibold text-budget-text">Budgetly</span>
                </Link>
                <Button aria-label="Cerrar navegacion" size="icon" variant="ghost" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-1 p-4">
                {items.map((item) => {
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
              </nav>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
