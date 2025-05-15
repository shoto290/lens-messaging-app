import { communityService } from "@/services/community-service";
import { Community } from "@/services/community-service.types";
import { create } from "zustand";

interface CommunityState {
  initialized: boolean;
  userCommunities: Community[];
  discoverCommunities: Community[];
}

interface CommunityActions {
  fetchUserCommunities: (profileId: string) => Promise<void>;
  fetchDiscoverCommunities: () => Promise<void>;
}

interface CommunityStore extends CommunityState, CommunityActions {}

const DEFAULT_STATE: CommunityState = {
  initialized: false,
  userCommunities: [],
  discoverCommunities: [],
};

export const useCommunityStore = create<CommunityStore>((set) => ({
  ...DEFAULT_STATE,

  reset: () => {
    set(DEFAULT_STATE);
  },

  fetchUserCommunities: async (profileId: string) => {
    const userCommunities = await communityService.getUserCommunities(
      profileId
    );
    set({ userCommunities });
  },

  fetchDiscoverCommunities: async () => {
    const discoverCommunities = await communityService.getTrendingCommunities();
    set({ discoverCommunities });
  },
}));
