import {
  fetchGroupMembers,
  fetchGroups,
  fetchGroup,
  joinGroup,
  requestGroupMembership,
} from "@lens-protocol/client/actions";
import { lensClient } from "./lens-service";
import { evmAddress, SessionClient } from "@lens-protocol/client";
import { Community } from "./community-service.types";
import { handleOperationWith } from "@lens-protocol/client/viem";
import { type WalletClient as ViemWalletClient } from "viem";

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

const getMembersOfCommunity = async (communityId: string) => {
  const result = await fetchGroupMembers(lensClient, {
    group: evmAddress(communityId),
  });

  if (result.isErr()) {
    throw result.error;
  }

  return result.value;
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
  // First check if the user can join and if approval is required
  const canJoinResult = await canJoinCommunity(communityAddress);

  if (!canJoinResult.canJoin) {
    throw new Error(canJoinResult.reason || "Cannot join this community");
  }

  let result;
  const requiresApproval = canJoinResult.requiresApproval;

  if (requiresApproval) {
    result = await requestGroupMembership(sessionClient, {
      group: evmAddress(communityAddress),
    }).andThen(handleOperationWith(walletClient));
  } else {
    result = await joinGroup(sessionClient, {
      group: evmAddress(communityAddress),
    }).andThen(handleOperationWith(walletClient));
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

export const communityService = {
  getUserCommunities,
  getMembersOfCommunity,
  getTrendingCommunities,
  canJoinCommunity,
  joinCommunity,
};
