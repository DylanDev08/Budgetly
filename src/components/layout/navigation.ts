import {
  Bot,
  CalendarDays,
  CreditCard,
  FileText,
  Flag,
  Gauge,
  Home,
  Landmark,
  ListChecks,
  Receipt,
  Settings,
  ShieldCheck,
  Target,
  WalletCards,
} from "lucide-react";

export const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Movimientos", href: "/movements", icon: WalletCards },
  { label: "Presupuestos", href: "/budgets", icon: Gauge },
  { label: "Obligaciones", href: "/obligations", icon: Receipt },
  { label: "Horarios", href: "/schedule", icon: CalendarDays },
  { label: "Rutinas", href: "/routines", icon: ListChecks },
  { label: "Metas", href: "/goals", icon: Target },
  { label: "Inversion", href: "/investments", icon: Landmark },
  { label: "Bot asistente", href: "/assistant", icon: Bot },
  { label: "Mercado Pago", href: "/mercado-pago", icon: CreditCard },
  { label: "Comprobantes", href: "/invoices", icon: FileText },
  { label: "Ajustes", href: "/settings", icon: Settings },
] as const;

export const secondaryNavigationItems = [
  { label: "Admin", href: "/admin", icon: ShieldCheck },
  { label: "Terminos legales", href: "/legal/terms", icon: Flag },
  { label: "Privacidad", href: "/legal/privacy", icon: ShieldCheck },
  { label: "Seguridad", href: "/legal/security", icon: ShieldCheck },
] as const;
