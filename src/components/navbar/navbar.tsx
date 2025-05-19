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
        "flex items-center justify-around border-t border-border w-full px-[24px] py-[24px] pb-[30px]",
        className
      )}
    >
      {children}
    </nav>
  );
}
