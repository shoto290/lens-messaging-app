import { cn } from "@/lib/utils";

export function Navbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        "flex items-center justify-around border-t border-border w-full px-[24px] py-[16px] pb-[22px]",
        className
      )}
    >
      {children}
    </nav>
  );
}
