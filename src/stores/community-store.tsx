import { communityService } from "@/services/community-service";
import { Community } from "@/services/community-service.types";
import { create } from "zustand";

interface CommunityState {
  initialized: boolean;
  userCommunities: Community[];
  discoverCommunities: Community[];
}

interface CommunityActions {
  initialize: (profileId: string) => Promise<void>;
}

interface CommunityStore extends CommunityState, CommunityActions {}

const DEFAULT_STATE: CommunityState = {
  initialized: false,
  userCommunities: [],
  discoverCommunities: [],
};

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  ...DEFAULT_STATE,

  reset: () => {
    set(DEFAULT_STATE);
  },

  initialize: async (profileId: string) => {
    if (get().initialized) return;
    set({ initialized: true });

    const userCommunities = await communityService.getCommunitiesOfUser(
      profileId
    );
    const discoverCommunities = await communityService.getCommunities();

    set({ userCommunities, discoverCommunities });
  },
}));
