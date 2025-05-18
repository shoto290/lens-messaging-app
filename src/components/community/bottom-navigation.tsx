import React from "react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function BottomNavigation({
  children,
  className,
}: BottomNavigationProps) {
  return (
    <div
      className={cn(
        "fixed bottom-[87px] left-0 right-0 z-40 flex justify-end-safe gap-2 border-t border-border bg-background p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
