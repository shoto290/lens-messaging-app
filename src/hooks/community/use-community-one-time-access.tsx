import { Token } from "@/components/token/choose-token-drawer";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { useMutation } from "@tanstack/react-query";

export function useCommunityOneTimeAccess() {
  const { updateOneTimeAccess } = useCommunityCreateStore();

  const mutation = useMutation({
    mutationFn: async ({ token, amount }: { token: Token; amount: number }) => {
      return updateOneTimeAccess(token, amount);
    },
  });

  return {
    mutation,
    updateOneTimeAccess: mutation.mutate,
    updateOneTimeAccessAsync: mutation.mutateAsync,
  };
}
