import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { groveService } from "@/services/grove-service";

export const useAvatarUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        setIsUploading(true);

        // Upload the file to Grove storage
        const pictureUri = await groveService.uploadImage(file);
        console.log("Avatar uploaded to Grove:", pictureUri);

        return pictureUri;
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
  });

  return {
    ...mutation,
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading,
  };
};
