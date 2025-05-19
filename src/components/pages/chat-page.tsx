/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { useSendMessages } from "@/hooks/chat/use-send-messages";
import { Skeleton } from "../ui/skeleton";
import { useAccount } from "@/hooks/use-account";
import { ChatBubble } from "../chat/chat-bubble";
import { Account, AnyPost } from "@lens-protocol/client";
import { toast } from "sonner";
import { ChatHeader } from "../chat/chat-header";

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
  const [pendingMessage, setPendingMessage] = useState<AnyPost | null>(null);
  const { sendMessageAsync } = useSendMessages(activeCommunity?.feed?.address);

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

  useEffect(() => {
    setPendingMessage(null);
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      setPendingMessage({
        id: "pending",
        author: account,
        timestamp: new Date(),
        metadata: {
          content: messageText,
        },
      } as any);
      setMessageText("");
      setShouldScrollToBottom(true);

      await sendMessageAsync(messageText);
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  if (!activeCommunity) {
    setActiveSection(Section.MESSAGES);
    return null;
  }

  return (
    <div className="container flex flex-col absolute inset-0 z-10 bg-background">
      <ChatHeader
        activeCommunity={activeCommunity}
        setActiveSection={setActiveSection}
      />
      <div
        className="flex-grow overflow-y-auto p-4 flex flex-col gap-1 pb-24"
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
          : messages.map((message, index, array) => (
              <ChatBubble
                key={message.id}
                account={account as Account}
                message={message}
                prevMessage={array[index - 1]}
              />
            ))}
        {pendingMessage && (
          <ChatBubble
            account={account as Account}
            message={pendingMessage}
            isPending={true}
          />
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-2  rounded-t-[30px] overflow-hidden ">
        <input
          type="text"
          className="flex-grow px-4 py-2 bg-primary border border-border shadow-lg/5 rounded-full h-12"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          className="rounded-full h-12 aspect-square border border-border shadow-lg/5"
          disabled={!!pendingMessage}
          variant="default"
          onClick={handleSendMessage}
        >
          <Icons.Send />
        </Button>
      </div>
    </div>
  );
}
