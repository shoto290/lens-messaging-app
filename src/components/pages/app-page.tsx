import { AppNavbar } from "@/components/navbar/app-navbar";
import { ReactNode } from "react";

interface AppPageProps {
  children: ReactNode;
  hasBottomNavigation?: boolean;
}

export function AppPage({
  children,
  hasBottomNavigation = false,
}: AppPageProps) {
  return (
    <div className="flex flex-col h-dvh">
      <main
        className={`flex-1 overflow-y-auto ${
          hasBottomNavigation ? "pb-[78px]" : ""
        }`}
      >
        {children}
      </main>
      <footer className="mt-auto">
        <AppNavbar />
      </footer>
    </div>
  );
}
