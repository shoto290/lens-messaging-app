/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { CommunityAvatar } from "../community/community-avatar";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { useSendMessages } from "@/hooks/chat/use-send-messages";
import { Skeleton } from "../ui/skeleton";
import { formatTime } from "@/lib/utils";
import { useAccount } from "@/hooks/use-account";
import { UserAvatar } from "../user/user-avatar";

export function ChatPage() {
  const [messageText, setMessageText] = useState("");
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { account } = useAccount();
  const { activeCommunity } = useChatStore();
  const { setActiveSection } = useNavigation();
  const { messages, isPending } = useChatMessages(
    activeCommunity?.feed?.address
  );
  const { sendMessage } = useSendMessages(activeCommunity?.feed?.address);

  useEffect(() => {
    if (messagesContainerRef.current && shouldScrollToBottom) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldScrollToBottom(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!activeCommunity) {
    setActiveSection(Section.MESSAGES);
    return null;
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    sendMessage(messageText);
    setMessageText("");
    // Enable auto-scrolling when sending a new message
    setShouldScrollToBottom(true);
  };

  return (
    <div className="container flex flex-col absolute inset-0 z-10 bg-background">
      <div className="border-border border-b p-[12px] pt-[16px] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveSection(Section.MESSAGES)}
          >
            <Icons.ChevronLeft />
          </Button>
          <CommunityAvatar
            name={activeCommunity.metadata?.name}
            icon={activeCommunity.metadata?.icon}
          />
          <h3 className="text-sm font-bold font-mono">
            {activeCommunity.metadata?.name}
          </h3>
        </div>
      </div>

      <div
        className="flex-grow overflow-y-auto p-4 flex flex-col gap-4 pb-24"
        ref={messagesContainerRef}
      >
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
              const isMe =
                message.author.username?.id === account?.username?.id;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                >
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
                      {
                        <UserAvatar
                          className="size-5"
                          name={message.author.metadata?.name}
                          icon={message.author.metadata?.picture}
                        />
                      }
                      <span className="font-semibold">
                        {isMe ? "You" : message.author.metadata?.name}
                      </span>
                      <span>
                        {formatTime(new Date(message.timestamp.toString()))}
                      </span>
                    </div>

                    <div
                      className={`px-4 py-3 rounded-lg overflow-hidden w-fit ${
                        isMe
                          ? "bg-primary text-primary-foreground "
                          : "bg-muted "
                      }`}
                    >
                      {(message as any).metadata?.content}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2 backdrop-blur-lg rounded-t-[30px] overflow-hidden bg-background/50">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-md bg-accent border border-border"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button variant="default" onClick={handleSendMessage}>
          <Icons.Send />
        </Button>
      </div>
    </div>
  );
}
