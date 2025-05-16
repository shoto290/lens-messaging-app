import { fetchPosts } from "@lens-protocol/client/actions";
import { lensClient } from "./lens-service";
import { AnyPost, evmAddress } from "@lens-protocol/client";

export interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
  timestamp: Date;
  communityId: string;
}

// Mock data for messages
const mockMessages: Message[][] = [
  [
    {
      id: "1",
      text: "Hello everyone! How's it going?",
      sender: {
        id: "user-2",
        username: "alice",
        avatar: "https://i.pravatar.cc/150?u=alice",
      },
      timestamp: new Date(Date.now() - 3600000 * 2),
      communityId: "community-1",
    },
    {
      id: "2",
      text: "I'm working on the new design for our app",
      sender: {
        id: "user-3",
        username: "bob",
        avatar: "https://i.pravatar.cc/150?u=bob",
      },
      timestamp: new Date(Date.now() - 3600000),
      communityId: "community-1",
    },
    {
      id: "3",
      text: "That sounds great! Can't wait to see it",
      sender: {
        id: "user-1",
        username: "me",
        avatar: "https://i.pravatar.cc/150?u=me",
      },
      timestamp: new Date(Date.now() - 1800000),
      communityId: "community-1",
    },
  ],
  [
    {
      id: "4",
      text: "Has anyone started on the backend integration?",
      sender: {
        id: "user-4",
        username: "charlie",
        avatar: "https://i.pravatar.cc/150?u=charlie",
      },
      timestamp: new Date(Date.now() - 7200000),
      communityId: "community-2",
    },
    {
      id: "5",
      text: "I'm handling that part, should be done by tomorrow",
      sender: {
        id: "user-1",
        username: "me",
        avatar: "https://i.pravatar.cc/150?u=me",
      },
      timestamp: new Date(Date.now() - 3600000),
      communityId: "community-2",
    },
  ],
];

const getMessages = async (
  communityFeedAddress: string
): Promise<readonly AnyPost[]> => {
  const result = await fetchPosts(lensClient, {
    filter: {
      feeds: [{ feed: evmAddress(communityFeedAddress) }],
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  return result.value.items.toReversed();
};

const sendMessage = async (
  communityId: string,
  text: string,
  userId: string = "user-1"
): Promise<Message> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newMessage: Message = {
    id: Date.now().toString(),
    text,
    sender: {
      id: userId,
      username: userId === "user-1" ? "me" : "unknown",
      avatar: `https://i.pravatar.cc/150?u=${userId}`,
    },
    timestamp: new Date(),
    communityId,
  };

  if (!mockMessages[0]) {
    mockMessages[0] = [];
  }
  mockMessages[0].push(newMessage);

  return newMessage;
};

export const chatService = {
  getMessages,
  sendMessage,
};
