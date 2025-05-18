import {
  AccountAvailable,
  PublicClient,
  SessionClient,
  mainnet,
  evmAddress,
  Account,
  AccountMetadata,
  uri,
} from "@lens-protocol/client";
import { AccountFragment } from "./lens-service.fragments";
import {
  fetchAccountsAvailable,
  currentSession,
  lastLoggedInAccount,
  setAccountMetadata,
  createAccountWithUsername,
  fetchAccount,
} from "@lens-protocol/client/actions";
import {
  handleOperationWith,
  signMessageWith,
} from "@lens-protocol/client/viem";
import { type WalletClient as ViemWalletClient } from "viem";
import { account } from "@lens-protocol/metadata";
import { groveService } from "./grove-service";
import { env } from "@/env";

export const lensClient = PublicClient.create({
  environment: mainnet,
  fragments: [AccountFragment],
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

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
  walletClient: ViemWalletClient,
  lensAccountAddress: string
): Promise<SessionClient | null> => {
  try {
    const authenticated = await lensClient.login({
      accountOwner: {
        owner: evmAddress(address),
        account: evmAddress(lensAccountAddress),
        app: evmAddress(env.NEXT_PUBLIC_LENS_APP_ID),
      },
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

const logout = async (): Promise<boolean> => {
  try {
    const result = await sessionClientInstance?.logout();
    if (result && typeof result.isOk === "function" && result.isOk()) {
      sessionClientInstance = null;
      return true;
    }
    return false;
  } catch (error) {
    window.localStorage.removeItem("lens.mainnet.credentials");

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

const updateAccountMetadata = async (
  sessionClient: SessionClient,
  currentAccount: Account,
  newMetadata: Partial<AccountMetadata>
) => {
  const existingMetadata = currentAccount.metadata;

  const metadata = account({
    name: newMetadata.name || existingMetadata?.name || undefined,
    bio: newMetadata.bio || existingMetadata?.bio || undefined,
    picture: newMetadata.picture || existingMetadata?.picture || undefined,
    coverPicture:
      newMetadata.coverPicture || existingMetadata?.coverPicture || undefined,
    attributes:
      newMetadata.attributes || existingMetadata?.attributes || undefined,
  });

  const metadataUri = await groveService.uploadJson(metadata);

  const result = await setAccountMetadata(sessionClient, {
    metadataUri: uri(metadataUri),
  });

  if ("isErr" in result && result.isErr()) {
    throw new Error(`Failed to update metadata: ${result.error.message}`);
  }

  return "value" in result ? result.value : result;
};

const getAvailableAccounts = async (
  address: string
): Promise<AccountAvailable[]> => {
  try {
    const result = await fetchAccountsAvailable(lensClient, {
      managedBy: evmAddress(address),
      includeOwned: true,
    });

    if (result.isOk()) {
      return [...result.value.items];
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch available Lens accounts:", error);
    return [];
  }
};

const getCurrentAccount = async (
  sessionClient: SessionClient
): Promise<Account | null> => {
  try {
    const session = await currentSession(sessionClient);

    if (session.isOk()) {
      const address = session.value.signer;

      const accounts = await lastLoggedInAccount(lensClient, {
        address: evmAddress(address),
        app: evmAddress(env.NEXT_PUBLIC_LENS_APP_ID),
      });

      if (accounts.isOk()) {
        return accounts.value as Account;
      }
    }

    return null;
  } catch (error) {
    console.error("Failed to get current account:", error);
    return null;
  }
};

const createProfile = async (
  owner: string,
  walletClient: ViemWalletClient,
  input: {
    username: string;
    name: string;
    bio?: string;
    picture?: string;
  }
) => {
  const metadata = account({
    name: input.name || undefined,
    bio: input.bio || undefined,
    picture: input.picture || undefined,
  });

  const metadataUri = await groveService.uploadJson(metadata);

  const authenticated = await lensClient.login({
    onboardingUser: {
      app: evmAddress(env.NEXT_PUBLIC_LENS_APP_ID),
      wallet: evmAddress(owner),
    },
    signMessage: signMessageWith(walletClient),
  });

  if (authenticated.isOk()) {
    sessionClientInstance = authenticated.value;
  }

  if (!sessionClientInstance) {
    throw new Error(`Failed to login to Lens`);
  }

  const result = await createAccountWithUsername(sessionClientInstance, {
    username: { localName: input.username },
    metadataUri: uri(metadataUri),
  })
    .andThen(handleOperationWith(walletClient))
    .andThen(sessionClientInstance.waitForTransaction)
    .andThen((txHash) => fetchAccount(sessionClientInstance!, { txHash }))
    .andThen((account) => {
      if (!account) {
        throw new Error("Account not found after creation");
      }

      return sessionClientInstance!.switchAccount({
        account: account.address,
      });
    });

  if ("isErr" in result && result.isErr()) {
    throw new Error(`Failed to create profile: ${result.error.message}`);
  }

  return sessionClientInstance;
};

export const lensService = {
  getUserByAddress,
  login,
  logout,
  resumeSession,
  getCurrentSession,
  getLastLoggedInAccount,
  updateAccountMetadata,
  getAvailableAccounts,
  getCurrentAccount,
  createProfile,
  get client() {
    return lensClient;
  },
  get sessionClient() {
    return sessionClientInstance;
  },
};
