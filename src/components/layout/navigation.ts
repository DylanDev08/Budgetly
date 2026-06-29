import {
  ArrowLeftRight,
  Bot,
  CalendarDays,
  CreditCard,
  FileText,
  Flag,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
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
