import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMemo } from "react";
import { groveService } from "@/services/grove-service";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  name?: string | null;
  icon?: string;
  className?: string;
}

export function UserAvatar({ name, icon, className }: UserAvatarProps) {
  const profilePicture = useMemo(() => {
    return groveService.resolveImage(icon || "");
  }, [icon]);

  const fallback = useMemo(() => {
    return name?.slice(0, 2).toUpperCase() || "";
  }, [name]);

  return (
    <Avatar className={cn("rounded-full", className)}>
      <AvatarImage src={profilePicture} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
