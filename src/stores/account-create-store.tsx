import { lensService } from "@/services/lens-service";
import { SessionClient } from "@lens-protocol/client";
import { WalletClient } from "viem";
import { create } from "zustand";

interface AccountCreateInfo {
  username: string;
  name: string;
  bio?: string;
  picture?: string;
}

interface AccountCreateActions {
  reset: () => void;
  createAccount: (
    owner: string,
    walletClient: WalletClient
  ) => Promise<SessionClient>;
  updateAccountInfo: (info: Partial<AccountCreateInfo>) => void;
}

interface AccountCreateState {
  accountInfo: AccountCreateInfo;
}

interface AccountCreateStore extends AccountCreateState, AccountCreateActions {}

const DEFAULT_STATE: AccountCreateState = {
  accountInfo: {
    username: "",
    name: "",
    bio: "",
    picture: undefined,
  },
};

export const useAccountCreateStore = create<AccountCreateStore>((set, get) => ({
  ...DEFAULT_STATE,

  reset: () => {
    set(DEFAULT_STATE);
  },

  updateAccountInfo: (info: Partial<AccountCreateInfo>) => {
    const { accountInfo } = get();
    const newInfo = { ...accountInfo, ...info };
    set({ accountInfo: newInfo });
  },

  createAccount: async (owner, walletClient) => {
    const { accountInfo, reset } = get();

    try {
      const sessionClient = await lensService.createProfile(
        owner,
        walletClient,
        accountInfo
      );

      reset();

      return sessionClient;
    } catch (error) {
      throw error;
    }
  },
}));
