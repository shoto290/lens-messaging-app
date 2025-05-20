import {
  fetchGroupMembers,
  fetchGroups,
  fetchGroup,
  joinGroup,
  requestGroupMembership,
  createGroup,
  leaveGroup,
} from "@lens-protocol/client/actions";
import { lensClient } from "./lens-service";
import {
  bigDecimal,
  CreateGroupRequest,
  evmAddress,
  Group,
  GroupsOrderBy,
  SessionClient,
  uri,
} from "@lens-protocol/client";
import { Community } from "./community-service.types";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { type WalletClient as ViemWalletClient } from "viem";
import { group, GroupOptions } from "@lens-protocol/metadata";
import { groveService } from "./grove-service";
import { Token } from "@/components/token/choose-token-drawer";

export type JoinValidationStatus =
  | "allowed"
  | "not-allowed"
  | "requires-approval"
  | "unknown";

const getUserCommunities = async (address: string): Promise<Community[]> => {
  if (!address) {
    return [];
  }

  const result = await fetchGroups(lensClient, {
    filter: {
      member: evmAddress(address),
    },
    orderBy: GroupsOrderBy.Alphabetical,
  });

  if (result.isErr()) {
    throw result.error;
  }

  const communities: Community[] = [...result.value.items];
  return communities;
};

const getTrendingCommunities = async (): Promise<Community[]> => {
  const result = await fetchGroups(lensClient);

  if (result.isErr()) {
    throw result.error;
  }

  const communities: Community[] = [...result.value.items];
  return communities;
};

const getSearchCommunities = async (query?: string): Promise<Community[]> => {
  const result = await fetchGroups(lensClient, {
    filter: {
      searchQuery: query || "",
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  const communities: Community[] = [...result.value.items];
  return communities;
};

const getMembersOfCommunity = async (communityId: string) => {
  const result = await fetchGroupMembers(lensClient, {
    group: evmAddress(communityId),
  });

  if (result.isErr()) {
    throw result.error;
  }

  return result.value;
};

const isMemberOfCommunity = async (
  communityAddress: string,
  username: string,
  namespaces: string,
  address: string
) => {
  const result = await fetchGroupMembers(lensClient, {
    group: evmAddress(communityAddress),
    filter: {
      searchBy: {
        localNameQuery: username,
        namespaces: [evmAddress(namespaces)],
      },
    },
  });

  if (result.isErr()) {
    throw result.error;
  }

  return result.value.items.some(
    (member) => member.account.address === address
  );
};

const canJoinCommunity = async (communityAddress: string) => {
  if (!communityAddress) {
    return {
      status: "not-allowed" as JoinValidationStatus,
      reason: "No community address provided",
    };
  }

  const result = await fetchGroup(lensClient, {
    group: evmAddress(communityAddress),
  });

  console.log("result", result);

  if (result.isErr()) {
    return {
      status: "not-allowed" as JoinValidationStatus,
      reason: "Failed to fetch community",
    };
  }

  const group = result.value;

  if (!group) {
    return {
      status: "not-allowed" as JoinValidationStatus,
      reason: "Community not found",
    };
  }

  const requiresApproval = group.membershipApprovalEnabled;

  if (group.operations === null) {
    return {
      canJoin: true,
      requiresApproval,
      status: "allowed" as JoinValidationStatus,
    };
  } else if (group.operations?.canJoin) {
    switch (group.operations.canJoin.__typename) {
      case "GroupOperationValidationPassed":
        return {
          canJoin: true,
          requiresApproval,
          status: requiresApproval
            ? "requires-approval"
            : ("allowed" as JoinValidationStatus),
          reason: requiresApproval ? "Requires approval" : "Can join",
          group,
        };

      case "GroupOperationValidationFailed":
        return {
          canJoin: false,
          status: "not-allowed" as JoinValidationStatus,
          reason:
            group.operations.canJoin.reason || "Cannot join this community",
          group,
        };

      case "GroupOperationValidationUnknown":
        return {
          canJoin: false,
          status: "unknown" as JoinValidationStatus,
          reason: "Unknown validation rules",
          group,
        };

      default:
        return {
          canJoin: false,
          status: "not-allowed" as JoinValidationStatus,
          reason: "Cannot determine if you can join",
          group,
        };
    }
  }

  return {
    canJoin: false,
    status: "not-allowed" as JoinValidationStatus,
    reason: "Cannot determine if you can join",
    group,
  };
};

const joinCommunity = async (
  sessionClient: SessionClient,
  walletClient: ViemWalletClient,
  communityAddress: string
) => {
  const canJoinResult = await canJoinCommunity(communityAddress);

  if (!canJoinResult.canJoin) {
    throw new Error(canJoinResult.reason || "Cannot join this community");
  }

  let result;
  const requiresApproval = canJoinResult.requiresApproval;

  if (requiresApproval) {
    result = await requestGroupMembership(sessionClient, {
      group: evmAddress(communityAddress),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);
  } else {
    result = await joinGroup(sessionClient, {
      group: evmAddress(communityAddress),
    })
      .andThen(handleOperationWith(walletClient))
      .andThen(sessionClient.waitForTransaction);
  }

  if (result.isErr()) {
    const errorMessage =
      result.error instanceof Error
        ? result.error.message
        : "Failed to join community";
    throw new Error(errorMessage);
  }

  return {
    result: result.value,
    requiresApproval,
  };
};

const createCommunity = async (
  sessionClient: SessionClient,
  walletClient: ViemWalletClient,
  options: GroupOptions,
  oneTimeAccess?: {
    token: Token;
    amount: number;
  }
): Promise<Group | null> => {
  const metadata = group({
    name: options.name,
    description: options.description || undefined,
    icon: options.icon || undefined,
  });

  if (!walletClient.account) {
    throw new Error("Wallet account not found");
  }

  const metadataUri = await groveService.uploadJson(metadata);

  const request: CreateGroupRequest = {
    metadataUri: uri(metadataUri),
  };
  if (oneTimeAccess) {
    request.rules = {
      required: {
        simplePaymentRule: {
          cost: {
            currency: evmAddress(oneTimeAccess.token.address),
            value: bigDecimal(oneTimeAccess.amount.toString()),
          },
          recipient: evmAddress(walletClient.account.address),
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
  }

  const result = await createGroup(sessionClient, request)
    .andThen(handleOperationWith(walletClient))
    .andThen(sessionClient.waitForTransaction)
    .andThen((txHash) => fetchGroup(sessionClient, { txHash }));

  if (result.isErr()) {
    throw result.error;
  }

  return result.value;
};

const leaveCommunity = async (
  sessionClient: SessionClient,
  walletClient: ViemWalletClient,
  communityAddress: string
) => {
  const result = await leaveGroup(sessionClient, {
    group: evmAddress(communityAddress),
  })
    .andThen(handleOperationWith(walletClient))
    .andThen(sessionClient.waitForTransaction);

  if (result.isErr()) {
    throw result.error;
  }

  return result.value;
};
export const communityService = {
  getUserCommunities,
  getMembersOfCommunity,
  getTrendingCommunities,
  canJoinCommunity,
  joinCommunity,
  isMemberOfCommunity,
  createCommunity,
  leaveCommunity,
  getSearchCommunities,
};
