import { useMutation } from "@tanstack/react-query";
import { acrossService } from "@/services/across-service";
import { useAccount } from "../use-account";
import { useClient, useSendTransaction, useWalletClient } from "wagmi";
import { useAccount as useWagmiAccount } from "wagmi";
import { sleep } from "@/lib/utils";
import { Address, encodeFunctionData, erc20Abi, pad } from "viem";

import SPOKE_POOL_ABI from "@/abis/SPOKE_POOL_ABI.json";
import { waitForTransactionReceipt } from "viem/actions";

function addressToBytes32(address: Address): `0x${string}` {
  return pad(address as `0x${string}`, { size: 32 });
}

export function useBridge() {
  const { address } = useWagmiAccount();
  const { account } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { sendTransactionAsync } = useSendTransaction();
  const client = useClient();

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

      if (!client) {
        throw new Error("No client found");
      }

      const { deposit } = await acrossService.getQuote(amount, account.address);

      const approveEncodedData = encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [deposit.spokePoolAddress, BigInt(deposit.inputAmount)],
      });

      const approveTx = await sendTransactionAsync({
        to: deposit.inputToken,
        data: approveEncodedData,
        value: BigInt(0),
      });

      await waitForTransactionReceipt(client, {
        hash: approveTx,
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

      const receipt = await waitForTransactionReceipt(client, {
        hash: tx,
      });

      await sleep(10000);

      return receipt;
    },
  });

  return {
    ...mutation,
    bridge: mutation.mutate,
    bridgeAsync: mutation.mutateAsync,
  };
}
