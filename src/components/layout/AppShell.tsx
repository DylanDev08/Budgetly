"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStandaloneRoute = pathname.startsWith("/auth") || pathname.startsWith("/legal");

  if (isStandaloneRoute) {
    return <div className="min-h-screen bg-budget-bg text-budget-text">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-budget-bg text-budget-text">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
