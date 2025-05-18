import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { sleep } from "@/lib/utils";

// Pour l'instant, cette fonction simule un upload d'avatar
// Plus tard, elle sera remplacée par un vrai service d'upload
const mockUploadAvatar = async (file: File): Promise<string> => {
  // Simuler un délai réseau
  await sleep(1000);

  // Retourner un URL temporaire pour afficher l'image
  return URL.createObjectURL(file);
};

export const useCommunityAvatarUpload = () => {
  const { updateCommunityInfo } = useCommunityCreateStore();
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        setIsUploading(true);

        // Simuler l'upload et obtenir l'URL de l'image
        const avatarUrl = await mockUploadAvatar(file);

        // Mettre à jour le store avec l'URL de l'avatar
        updateCommunityInfo({ avatar: avatarUrl });

        return avatarUrl;
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
  });

  return {
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading,
    ...mutation,
  };
};
