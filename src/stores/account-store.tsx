import { lensService } from "@/services/lens-service";
import { Account, SessionClient } from "@lens-protocol/client";
import { create } from "zustand";

interface AccountState {
  initialized: boolean;
  hasAccount: boolean;
  account: Account | null;
  sessionClient: SessionClient | null;
  authenticated: boolean;
}

interface AccountActions {
  initialize: (address?: string) => Promise<void>;
  getMe: (address?: string) => Promise<void>;
  setSessionClient: (client: SessionClient | null) => void;
  updateAuthStatus: (isAuthenticated: boolean) => void;
  reset: () => void;
}

interface AccountStore extends AccountState, AccountActions {}

const DEFAULT_STATE: AccountState = {
  initialized: false,
  account: null,
  hasAccount: false,
  sessionClient: null,
  authenticated: false,
};

export const useAccountStore = create<AccountStore>((set, get) => ({
  ...DEFAULT_STATE,

  reset: () => {
    set(DEFAULT_STATE);
  },

  initialize: async (address?: string) => {
    if (get().initialized) return;
    set({ initialized: true });

    const sessionClient = await lensService.resumeSession();
    if (sessionClient) {
      set({
        sessionClient,
        authenticated: true,
      });
    }

    if (sessionClient && address) {
      return get().getMe(address);
    }
  },

  getMe: async () => {
    const { sessionClient } = get();

    if (sessionClient) {
      try {
        const activeAccount = await lensService.getCurrentAccount(
          sessionClient
        );

        if (activeAccount) {
          set({ account: activeAccount, hasAccount: true });
          return;
        }
      } catch (error) {
        console.error("Failed to get current account:", error);
      }
    } else {
      set({
        account: null,
        hasAccount: false,
      });
    }
  },

  setSessionClient: (client: SessionClient | null) => {
    set({
      sessionClient: client,
      authenticated: !!client,
    });
  },

  updateAuthStatus: (isAuthenticated: boolean) => {
    set({ authenticated: isAuthenticated });
  },
}));
