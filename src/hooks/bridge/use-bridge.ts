import { useQuery } from "@tanstack/react-query";
import { acrossService } from "@/services/across-service";
import { useAccount } from "wagmi";

export function useBridge() {
  const { address } = useAccount();

  const query = useQuery({
    queryKey: ["quote", address],
    queryFn: async () => {
      if (!address) {
        throw new Error("No address found");
      }

      const quote = await acrossService.getQuote("1", address);
      return quote;
    },
    enabled: !!address,
  });

  return {
    ...query,
    quote: query.data,
  };
}
