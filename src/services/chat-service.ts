import { fetchPosts, post } from "@lens-protocol/client/actions";
import { lensClient, lensService } from "./lens-service";
import { AnyPost, evmAddress, uri } from "@lens-protocol/client";
import { textOnly } from "@lens-protocol/metadata";
import { groveService } from "./grove-service";
import { sleep } from "@/lib/utils";

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
  text: string
): Promise<unknown> => {
  try {
    const sessionClient = lensService.sessionClient;
    if (!sessionClient) {
      throw new Error("User not authenticated with Lens");
    }

    const metadata = textOnly({
      content: text,
    });

    const metadataUri = await groveService.uploadJson(metadata);

    const result = await post(sessionClient, {
      contentUri: uri(metadataUri),
      feed: evmAddress(communityId),
    });

    if (result.isErr()) {
      throw result.error;
    }

    await sleep(2000);

    return result.value;
  } catch (error) {
    console.error("Failed to send message:", error);
    return null;
  }
};

export const chatService = {
  getMessages,
  sendMessage,
};
