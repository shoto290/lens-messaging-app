import { fetchGroupMembers, fetchGroups } from "@lens-protocol/client/actions";
import { lensClient } from "./lens-service";
import { evmAddress } from "@lens-protocol/client";
import { Community } from "./community-service.types";

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

export const communityService = {
  getUserCommunities,
  getMembersOfCommunity,
  getTrendingCommunities,
};
