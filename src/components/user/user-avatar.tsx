import { Account } from "@lens-protocol/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMemo } from "react";
import { groveService } from "@/services/grove-service";

interface UserAvatarProps {
  account: Account;
}

export function UserAvatar({ account }: UserAvatarProps) {
  const profilePicture = useMemo(() => {
    return groveService.resolveImage(account.metadata?.picture);
  }, [account.metadata?.picture]);

  const fallback = useMemo(() => {
    return account.metadata?.name?.slice(0, 2).toUpperCase() || "";
  }, [account.metadata?.name]);

  return (
    <Avatar>
      <AvatarImage src={profilePicture} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
