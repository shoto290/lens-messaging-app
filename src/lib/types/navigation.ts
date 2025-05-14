import { FunctionComponent } from "react";

export interface NavItem {
  id: string;
  icon: FunctionComponent<{ className?: string }>;
  label: string;
  href: string;
}
