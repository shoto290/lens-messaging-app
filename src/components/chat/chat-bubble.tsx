/* eslint-disable @typescript-eslint/no-explicit-any */
import { Account, AnyPost } from "@lens-protocol/client";
import { useMemo } from "react";
import { UserAvatar } from "../user/user-avatar";
import { cn, formatTime } from "@/lib/utils";
import { Icons } from "../icons";

interface ChatBubbleProps {
  account: Account;
  message: AnyPost;
  prevMessage?: AnyPost;
  isPending?: boolean;
}

export function ChatBubble({
  account,
  message,
  prevMessage,
  isPending,
}: ChatBubbleProps) {
  const isMe = useMemo(() => {
    return message.author.username?.id === account?.username?.id;
  }, [message, account]);
  const formatedTime = useMemo(() => {
    return formatTime(new Date(message.timestamp.toString()));
  }, [message]);
  const isSameAuthor = useMemo(() => {
    return message.author.username?.id === prevMessage?.author.username?.id;
  }, [message, prevMessage]);

  return (
    <div
      key={message.id}
      className={cn(
        "flex gap-3",
        isMe ? "flex-row-reverse" : "",
        isPending && "opacity-50",
        !isSameAuthor && "mt-3"
      )}
    >
      <div className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : ""}`}>
        {(!isSameAuthor || isPending) && (
          <div
            className={`flex items-center gap-1.5 text-xs mb-2 ${
              isMe ? "flex-row-reverse" : ""
            }`}
          >
            {
              <UserAvatar
                className="size-6 ring-ring ring"
                name={message.author.metadata?.name}
                icon={message.author.metadata?.picture}
              />
            }
            <span className="font-semibold">
              {isMe ? "You" : message.author.metadata?.name}
            </span>
            <p>•</p>
            <div className="flex items-center gap-2 justify-center text-muted-foreground">
              {isPending ? (
                <div className="flex items-center gap-1 text-blue-600">
                  <p className="text-xs">sending</p>
                  <Icons.Loader className="size-3 animate-spin" />
                </div>
              ) : (
                formatedTime
              )}
            </div>
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-xl overflow-hidden w-fit ${
            isMe ? "bg-blue-600 text-primary" : "bg-primary"
          }`}
        >
          {(message as any).metadata?.content}
        </div>
      </div>
    </div>
  );
}
