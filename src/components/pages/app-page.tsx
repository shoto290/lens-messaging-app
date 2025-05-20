"use client";

import { AppNavbar } from "@/components/navbar/app-navbar";
import { useBridge } from "@/hooks/bridge/use-bridge";
import { ReactNode } from "react";

interface AppPageProps {
  children: ReactNode;
  hasBottomNavigation?: boolean;
}

export function AppPage({
  children,
  hasBottomNavigation = false,
}: AppPageProps) {
  const { quote } = useBridge();

  console.log({
    quote,
  });

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
