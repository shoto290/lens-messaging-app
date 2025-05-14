import {
  AccountAvailable,
  PublicClient,
  SessionClient,
  mainnet,
  evmAddress,
  IStorageProvider,
} from "@lens-protocol/client";
import { AccountFragment } from "./lens-service.fragments";
import {
  fetchAccountsAvailable,
  currentSession,
  lastLoggedInAccount,
} from "@lens-protocol/client/actions";
import { signMessageWith } from "@lens-protocol/client/viem";
import { type WalletClient as ViemWalletClient } from "viem";

// Lens Protocol test app ID for mainnet
const LENS_APP_ID = "0x8A5Cc31180c37078e1EbA2A23c861Acf351a97cE";

// Custom storage provider that appends owner and account addresses to keys
class ProfileAwareStorage implements IStorageProvider {
  private storage: Storage;
  private currentOwner: string | null = null;
  private currentAccount: string | null = null;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  setAddresses(owner: string, account?: string) {
    this.currentOwner = owner;
    this.currentAccount = account || null;
  }

  private getKey(key: string): string {
    if (this.currentOwner) {
      return `${this.currentOwner}:${this.currentAccount || "none"}:${key}`;
    }
    return key;
  }

  getItem(key: string): string | null {
    return this.storage.getItem(this.getKey(key));
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(this.getKey(key), value);
  }

  removeItem(key: string): void {
    this.storage.removeItem(this.getKey(key));
  }
}

// Create storage if window is available (client-side)
const customStorage =
  typeof window !== "undefined"
    ? new ProfileAwareStorage(window.localStorage)
    : undefined;

const lensClient = PublicClient.create({
  environment: mainnet,
  fragments: [AccountFragment],
  storage: customStorage,
});

// Keep track of the session client
let sessionClientInstance: SessionClient | null = null;

const getUserByAddress = async (
  address: string
): Promise<AccountAvailable | null> => {
  try {
    const result = await fetchAccountsAvailable(lensClient, {
      managedBy: address,
      includeOwned: true,
    });

    if (result.isOk() && result.value.items.length > 0) {
      return result.value.items[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch Lens account:", error);
    return null;
  }
};

const getLastLoggedInAccount = async (address: string) => {
  try {
    const result = await lastLoggedInAccount(lensClient, {
      address: evmAddress(address),
    });

    if (result.isOk() && result.value) {
      return result.value;
    }
    return null;
  } catch (error) {
    console.error("Failed to get last logged in account:", error);
    return null;
  }
};

const login = async (
  address: string,
  walletClient: ViemWalletClient
): Promise<SessionClient | null> => {
  try {
    // Login as onboarding user or account owner based on if they have an account
    const accountResult = await getUserByAddress(address);

    // Set the addresses for storage prefixing
    if (customStorage) {
      customStorage.setAddresses(address, accountResult?.account?.address);
    }

    const authenticated = await lensClient.login({
      ...(accountResult
        ? {
            accountOwner: {
              owner: evmAddress(address),
              account: evmAddress(accountResult.account.address),
              app: evmAddress(LENS_APP_ID),
            },
          }
        : {
            onboardingUser: {
              wallet: evmAddress(address),
              app: evmAddress(LENS_APP_ID),
            },
          }),
      signMessage: signMessageWith(walletClient),
    });

    if (authenticated.isOk()) {
      sessionClientInstance = authenticated.value;
      return sessionClientInstance;
    }

    console.error("Authentication failed:", authenticated.error);
    return null;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// The logout method is available on the client at runtime but missing from the types
const logout = async (): Promise<boolean> => {
  try {
    // @ts-expect-error The lensClient has a logout method but it's not in the TypeScript type definitions
    const result = await lensClient.logout();
    if (result && typeof result.isOk === "function" && result.isOk()) {
      sessionClientInstance = null;
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};

const resumeSession = async (): Promise<SessionClient | null> => {
  try {
    const resumed = await lensClient.resumeSession();
    if (resumed.isOk()) {
      sessionClientInstance = resumed.value;
      return sessionClientInstance;
    }
    return null;
  } catch (error) {
    console.error("Failed to resume session:", error);
    return null;
  }
};

const getCurrentSession = async (): Promise<boolean> => {
  if (!sessionClientInstance) {
    return false;
  }

  try {
    const result = await currentSession(sessionClientInstance);
    return result.isOk();
  } catch (error) {
    console.error("Failed to get current session:", error);
    return false;
  }
};

export const lensService = {
  getUserByAddress,
  login,
  logout,
  resumeSession,
  getCurrentSession,
  getLastLoggedInAccount,
  get client() {
    return lensClient;
  },
  get sessionClient() {
    return sessionClientInstance;
  },
  setStorageAddresses: (owner: string, account?: string) => {
    if (customStorage) {
      customStorage.setAddresses(owner, account);
    }
  },
};
