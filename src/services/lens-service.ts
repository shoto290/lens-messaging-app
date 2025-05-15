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
} from "@lens-protocol/client/actions";
import { signMessageWith } from "@lens-protocol/client/viem";
import { type WalletClient as ViemWalletClient } from "viem";
import { account } from "@lens-protocol/metadata";
import { groveService } from "./grove-service";
import { env } from "@/env";

const lensClient = PublicClient.create({
  environment: mainnet,
  fragments: [AccountFragment],
  storage: window.localStorage,
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
    const accountResult = await getUserByAddress(address);

    const authenticated = await lensClient.login({
      ...(accountResult
        ? {
            accountOwner: {
              owner: evmAddress(address),
              account: evmAddress(accountResult.account.address),
              app: evmAddress(env.NEXT_PUBLIC_LENS_APP_ID),
            },
          }
        : {
            onboardingUser: {
              wallet: evmAddress(address),
              app: evmAddress(env.NEXT_PUBLIC_LENS_APP_ID),
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

export const lensService = {
  getUserByAddress,
  login,
  logout,
  resumeSession,
  getCurrentSession,
  getLastLoggedInAccount,
  updateAccountMetadata,
  get client() {
    return lensClient;
  },
  get sessionClient() {
    return sessionClientInstance;
  },
};
