import { useCommunityCreateStore } from "@/stores/community-create-store";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { useMutation } from "@tanstack/react-query";

export const useCommunityAvatarUpload = () => {
  const { updateCommunityInfo } = useCommunityCreateStore();
  const { uploadAvatarAsync } = useAvatarUpload();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // Use the generic upload hook
      const pictureUri = await uploadAvatarAsync(file);

      // Update the community store with the avatar URI
      updateCommunityInfo({ avatar: pictureUri });

      return pictureUri;
    },
  });

  return {
    ...mutation,
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
  };
};
