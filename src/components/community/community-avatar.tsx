import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { groveService } from "@/services/grove-service";
import { useMemo } from "react";

interface CommunityAvatarProps {
  name?: string;
  icon?: string;
  className?: string;
}

export function CommunityAvatar({
  name,
  icon,
  className,
}: CommunityAvatarProps) {
  const imageUrl = useMemo(() => {
    return groveService.resolveImage(icon || "");
  }, [icon]);

  return (
    <Avatar
      className={cn(
        "rounded-[16px] size-10 bg-primary border border-border",
        className
      )}
    >
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{name?.slice(0, 2).toUpperCase() || "N"}</AvatarFallback>
    </Avatar>
  );
}
