import { useMutation } from "@tanstack/react-query";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { sleep } from "@/lib/utils";

export const useCommunityAvatarRemove = () => {
  const { updateCommunityInfo } = useCommunityCreateStore();

  const mutation = useMutation({
    mutationFn: async () => {
      try {
        // Simuler un délai réseau
        await sleep(500);

        // Mettre à jour le store pour supprimer l'avatar
        updateCommunityInfo({ avatar: undefined });

        return true;
      } catch (error) {
        console.error("Failed to remove avatar:", error);
        throw error;
      }
    },
  });

  return {
    removeAvatar: mutation.mutate,
    removeAvatarAsync: mutation.mutateAsync,
    ...mutation,
  };
};
