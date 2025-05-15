"use client";

import { useState } from "react";
import { useChatStore } from "@/stores/chat-store";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ChatPage() {
  const [messageText, setMessageText] = useState("");
  const { activeCommunity, messages, sendMessage } = useChatStore();
  const { setActiveSection } = useNavigation();

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
          <Avatar>
            <AvatarImage src={activeCommunity.metadata?.icon} />
            <AvatarFallback>
              {activeCommunity.metadata?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-sm font-bold font-mono">
            {activeCommunity.metadata?.name}
          </h3>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-[80%] ${
              message.sender === "me"
                ? "ml-auto bg-primary text-primary-foreground"
                : "mr-auto bg-accent"
            }`}
          >
            {message.text}
            <div className="text-xs opacity-70 text-right">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
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
