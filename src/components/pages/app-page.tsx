import { AppNavbar } from "@/components/navbar/app-navbar";
import { ReactNode } from "react";

interface AppPageProps {
  children: ReactNode;
}

export function AppPage({ children }: AppPageProps) {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">{children}</main>
      <footer className="mt-auto">
        <AppNavbar />
      </footer>
    </div>
  );
}
