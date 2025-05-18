import { Account } from "@lens-protocol/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMemo } from "react";
import { groveService } from "@/services/grove-service";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  account: Account;
  className?: string;
}

export function UserAvatar({ account, className }: UserAvatarProps) {
  const profilePicture = useMemo(() => {
    return groveService.resolveImage(account.metadata?.picture);
  }, [account.metadata?.picture]);

  const fallback = useMemo(() => {
    return account.metadata?.name?.slice(0, 2).toUpperCase() || "";
  }, [account.metadata?.name]);

  return (
    <Avatar className={cn("rounded-full", className)}>
      <AvatarImage src={profilePicture} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
