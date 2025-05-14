import { ReactNode } from "react";
import { NavigationProvider } from "@/stores/navigation-store";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return <NavigationProvider>{children}</NavigationProvider>;
}
