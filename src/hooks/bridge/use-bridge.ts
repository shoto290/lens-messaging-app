import { useMutation } from "@tanstack/react-query";
import { acrossService } from "@/services/across-service";
import { useAccount } from "../use-account";
import { useSendTransaction, useWalletClient } from "wagmi";
import { useAccount as useWagmiAccount } from "wagmi";
import { sleep } from "@/lib/utils";
import { Address, encodeFunctionData, pad } from "viem";

import SPOKE_POOL_ABI from "@/abis/SPOKE_POOL_ABI.json";

function addressToBytes32(address: Address): `0x${string}` {
  return pad(address as `0x${string}`, { size: 32 });
}

export function useBridge() {
  const { address } = useWagmiAccount();
  const { account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();

  const mutation = useMutation({
    mutationFn: async ({ amount }: { amount: string }) => {
      if (!account) {
        throw new Error("No account found");
      }

      if (!walletClient) {
        throw new Error("No wallet client found");
      }

      if (!address) {
        throw new Error("No address found");
      }

      const { deposit } = await acrossService.getQuote(amount, address);

      // {
      //   "inputs": [
      //     { "internalType": "bytes32", "name": "depositor", "type": "bytes32" },
      //     { "internalType": "bytes32", "name": "recipient", "type": "bytes32" },
      //     { "internalType": "bytes32", "name": "inputToken", "type": "bytes32" },
      //     { "internalType": "bytes32", "name": "outputToken", "type": "bytes32" },
      //     { "internalType": "uint256", "name": "inputAmount", "type": "uint256" },
      //     { "internalType": "uint256", "name": "outputAmount", "type": "uint256" },
      //     {
      //       "internalType": "uint256",
      //       "name": "destinationChainId",
      //       "type": "uint256"
      //     },
      //     {
      //       "internalType": "bytes32",
      //       "name": "exclusiveRelayer",
      //       "type": "bytes32"
      //     },
      //     { "internalType": "uint32", "name": "quoteTimestamp", "type": "uint32" },
      //     { "internalType": "uint32", "name": "fillDeadline", "type": "uint32" },
      //     {
      //       "internalType": "uint32",
      //       "name": "exclusivityParameter",
      //       "type": "uint32"
      //     },
      //     { "internalType": "bytes", "name": "message", "type": "bytes" }
      //   ],
      //   "name": "deposit",
      //   "outputs": [],
      //   "stateMutability": "payable",
      //   "type": "function"
      // },

      console.log({
        message: deposit.message,
      });

      const encodedData = encodeFunctionData({
        abi: SPOKE_POOL_ABI,
        functionName: "deposit",
        args: [
          addressToBytes32(address),
          addressToBytes32(deposit.recipient),
          addressToBytes32(deposit.inputToken),
          addressToBytes32(deposit.outputToken),
          BigInt(deposit.inputAmount),
          BigInt(deposit.outputAmount),
          BigInt(deposit.destinationChainId),
          addressToBytes32(deposit.exclusiveRelayer),
          BigInt(deposit.quoteTimestamp),
          BigInt(deposit.fillDeadline),
          BigInt(0),
          deposit.message,
        ],
      });

      const tx = await sendTransactionAsync({
        to: deposit.spokePoolAddress,
        data: encodedData,
        value: BigInt(0),
      });

      await sleep(10000);

      return tx;
    },
  });

  return {
    ...mutation,
    bridge: mutation.mutate,
    bridgeAsync: mutation.mutateAsync,
  };
}
