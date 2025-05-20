import { chains } from "@lens-chain/sdk/viem";
import { base } from "viem/chains";
import { createAcrossClient, Quote } from "@across-protocol/app-sdk";
import { parseUnits } from "viem/utils";
import { Address } from "viem";

const client = createAcrossClient({
  integratorId: "0xdead",
  chains: [chains.mainnet, base],
});

const getAvailableRoutes = async () => {
  const options = {
    originChainId: base.id,
    destinationChainId: chains.mainnet.id,
  };
  const routes = await client.getAvailableRoutes(options);

  return routes;
};

const getQuote = async (amount: string, recipient: Address) => {
  const quote = await client.getQuote({
    route: {
      originChainId: base.id,
      destinationChainId: chains.mainnet.id,
      inputToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      outputToken: "0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884",
    },
    recipient,
    inputAmount: parseUnits(amount, 6),
  });

  return quote;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeQuote = async (walletClient: any, quote: Quote) => {
  return client.executeQuote({
    walletClient,
    deposit: quote.deposit,
    onProgress: (progress) => {
      if (progress.step === "approve" && progress.status === "txSuccess") {
        // if approving an ERC20, you have access to the approval receipt
        const { txReceipt } = progress;
        console.log({ txReceipt });
      }
      if (progress.step === "deposit" && progress.status === "txSuccess") {
        // once deposit is successful you have access to depositId and the receipt
        const { depositId, txReceipt } = progress;
        console.log({ depositId, txReceipt });
      }
      if (progress.step === "fill" && progress.status === "txSuccess") {
        // if the fill is successful, you have access the following data
        const { fillTxTimestamp, txReceipt, actionSuccess } = progress;
        // actionSuccess is a boolean flag, telling us if your cross chain messages were successful
        console.log({ fillTxTimestamp, txReceipt, actionSuccess });
      }
    },
  });
};

export const acrossService = {
  getAvailableRoutes,
  getQuote,
  executeQuote,
};
