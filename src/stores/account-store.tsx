import { lensService } from "@/services/lens-service";
import { AccountAvailable } from "@lens-protocol/client";
import { create } from "zustand";

interface AccountState {
  initialized: boolean;
  hasAccount: boolean;
  account: AccountAvailable | null;
}

interface AccountActions {
  initialize: (address?: string) => Promise<void>;
  getMe: (accessToken: string) => Promise<void>;
}

interface AccountStore extends AccountState, AccountActions {}

const DEFAULT_STATE: AccountState = {
  initialized: false,
  account: null,
  hasAccount: false,
};

export const useAccountStore = create<AccountStore>((set, get) => ({
  ...DEFAULT_STATE,

  reset: () => {
    set(DEFAULT_STATE);
  },

  initialize: async (address?: string) => {
    if (get().initialized) return;
    set({ initialized: true });

    if (address) {
      return get().getMe(address);
    }
  },

  getMe: async (address: string) => {
    const account = await lensService.getUserByAddress(address);
    set({ account, hasAccount: !!account });
  },
}));
