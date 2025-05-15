"use client";

import { Community } from "@/services/community-service.types";
import { create } from "zustand";

interface ChatState {
  activeCommunity: Community | null;
  messages: Array<{
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
  }>;
}

interface ChatActions {
  setActiveCommunity: (community: Community | null) => void;
  sendMessage: (text: string) => void;
}

interface ChatStore extends ChatState, ChatActions {}

const DEFAULT_STATE: ChatState = {
  activeCommunity: null,
  messages: [],
};

export const useChatStore = create<ChatStore>((set) => ({
  ...DEFAULT_STATE,

  setActiveCommunity: (community) => {
    set({ activeCommunity: community });
  },

  sendMessage: (text) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: "me",
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },
}));
