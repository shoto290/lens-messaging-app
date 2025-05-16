"use client";

import { useState } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { CommunityAvatar } from "../community/community-avatar";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSendMessages } from "@/hooks/chat/use-send-messages";
import { Skeleton } from "../ui/skeleton";
import { formatTime } from "@/lib/utils";

export function ChatPage() {
  const [messageText, setMessageText] = useState("");
  const { activeCommunity } = useChatStore();
  const { setActiveSection } = useNavigation();
  const { messages, isPending } = useChatMessages(null);
  const { sendMessage } = useSendMessages(activeCommunity?.address);

  if (!activeCommunity) {
    setActiveSection(Section.MESSAGES);
    return null;
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText("");
  };

  return (
    <div className="container flex flex-col h-full">
      <div className="border-border border-b p-[12px] pt-[16px] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveSection(Section.MESSAGES)}
          >
            <Icons.ChevronLeft />
          </Button>
          <CommunityAvatar community={activeCommunity} />
          <h3 className="text-sm font-bold font-mono">
            {activeCommunity.metadata?.name}
          </h3>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
        {isPending
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              ))
          : messages.map((message) => {
              const isMe = message.sender.id === "user-1";

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
                  {!isMe && (
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={message.sender.avatar}
                        alt={message.sender.username}
                      />
                      <AvatarFallback>
                        {message.sender.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`flex flex-col max-w-[80%] ${
                      isMe ? "items-end" : ""
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-xs text-muted-foreground mb-1 ${
                        isMe ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span className="font-semibold">
                        {isMe ? "You" : message.sender.username}
                      </span>
                      <span>{formatTime(message.timestamp)}</span>
                    </div>

                    <div
                      className={`p-3 rounded-lg ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted rounded-tl-none"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="border-t border-border p-4 flex gap-2">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-md bg-background border border-border"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button onClick={handleSendMessage}>
          <Icons.Send />
        </Button>
      </div>
    </div>
  );
}
