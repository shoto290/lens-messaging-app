import { Icons } from "@/components/icons";

export function LoadingPage() {
  return (
    <div className="absolute backdrop-blur-3xl inset-0 flex items-center justify-center bg-background/50">
      <Icons.Loader className="animate-spin" />
    </div>
  );
}
