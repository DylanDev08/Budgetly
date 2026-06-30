import {
  ArrowLeftRight,
  Bot,
  CalendarDays,
  CreditCard,
  FileText,
  Flag,
  Gauge,
  Inbox,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavigationGroup = {
  label: string;
  description: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Principal",
    description: "Command center y escenarios",
    items: [
      { label: "Inbox", href: "/inbox", icon: Inbox },
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Timeline", href: "/timeline", icon: CalendarDays },
      { label: "Decisiones", href: "/decisions", icon: Target },
    ],
  },
  {
    label: "Finanzas",
    description: "Carga, limites y comprobantes",
    items: [
      { label: "Movimientos", href: "/movements", icon: ArrowLeftRight },
      { label: "Presupuestos", href: "/budgets", icon: WalletCards },
      { label: "Obligaciones", href: "/obligations", icon: Receipt },
      { label: "Comprobantes", href: "/invoices", icon: FileText },
    ],
  },
  {
    label: "Vida y metas",
    description: "Tiempo, habitos y objetivos",
    items: [
      { label: "Horarios", href: "/schedule", icon: CalendarDays },
      { label: "Rutinas", href: "/routines", icon: ListChecks },
      { label: "Metas", href: "/goals", icon: Target },
    ],
  },
  {
    label: "Inteligencia",
    description: "Asistencia, mercado y sync",
    items: [
      { label: "Bot asistente", href: "/assistant", icon: Bot },
      { label: "Inversion", href: "/investments", icon: Landmark },
      { label: "Mercado Pago", href: "/mercado-pago", icon: CreditCard },
    ],
  },
  {
    label: "Cuenta",
    description: "Preferencias y seguridad",
    items: [
      { label: "Premium", href: "/premium", icon: Sparkles },
      { label: "Perfil", href: "/profile", icon: User },
      { label: "Ajustes", href: "/settings", icon: Settings },
    ],
  },
];

export const navigationItems = navigationGroups.flatMap((group) => group.items);

export const secondaryNavigationItems = [
  { label: "Terminos legales", href: "/legal/terms", icon: Flag },
  { label: "Privacidad", href: "/legal/privacy", icon: ShieldCheck },
  { label: "Seguridad", href: "/legal/security", icon: ShieldCheck },
] as const;

export const adminNavigationItem = { label: "Admin", href: "/admin", icon: TrendingUp } as const;

export const adminNavigationItems = [
  adminNavigationItem,
  { label: "Clientes", href: "/admin/clients", icon: Users },
  { label: "Usuarios", href: "/admin/users", icon: User },
  { label: "Movimientos", href: "/admin/transactions", icon: ArrowLeftRight },
  { label: "Presupuestos", href: "/admin/budgets", icon: WalletCards },
  { label: "Metas", href: "/admin/goals", icon: Target },
  { label: "Planes", href: "/admin/plans", icon: Sparkles },
  { label: "Feature flags", href: "/admin/feature-flags", icon: Flag },
  { label: "Fotos / Archivos", href: "/admin/uploads", icon: FileText },
  { label: "Asistente", href: "/admin/assistant-records", icon: Bot },
  { label: "Mercado Pago", href: "/admin/mercado-pago", icon: CreditCard },
  { label: "Audit logs", href: "/admin/audit-logs", icon: ShieldCheck },
  { label: "Salud sistema", href: "/admin/system-health", icon: Gauge },
] as const;
