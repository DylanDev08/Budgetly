declare module "lucide-react" {
  import * as React from "react";

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;

  export const AlertTriangle: LucideIcon;
  export const ArrowDownCircle: LucideIcon;
  export const ArrowUpCircle: LucideIcon;
  export const Bot: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const CreditCard: LucideIcon;
  export const FileText: LucideIcon;
  export const Flag: LucideIcon;
  export const Gauge: LucideIcon;
  export const Home: LucideIcon;
  export const Landmark: LucideIcon;
  export const ListChecks: LucideIcon;
  export const Menu: LucideIcon;
  export const Plus: LucideIcon;
  export const Receipt: LucideIcon;
  export const Save: LucideIcon;
  export const Settings: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Target: LucideIcon;
  export const Wallet: LucideIcon;
  export const WalletCards: LucideIcon;
  export const X: LucideIcon;
}
