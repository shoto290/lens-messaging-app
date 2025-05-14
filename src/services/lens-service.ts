import { AccountAvailable, PublicClient, mainnet } from "@lens-protocol/client";
import { AccountFragment } from "./lens-service.fragments";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";

const lensClient = PublicClient.create({
  environment: mainnet,
  fragments: [AccountFragment],
});

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

export const lensService = {
  getUserByAddress,
};
