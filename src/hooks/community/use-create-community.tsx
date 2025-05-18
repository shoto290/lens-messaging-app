import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigation } from "@/stores/navigation-store";
import { Section } from "@/lib/types/navigation";
import { queryClient } from "@/app/provider";
import { Community } from "@/services/community-service.types";
import { useChatStore } from "@/stores/chat-store";

interface CreateCommunityInput {
  name: string;
  description?: string;
  avatar?: string;
}

export function useCreateCommunity() {
  const { setActiveSection } = useNavigation();
  const { setActiveCommunity } = useChatStore();

  const createMutation = useMutation<unknown, Error, CreateCommunityInput>({
    mutationFn: async ({ name, description, avatar }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCommunity = {
        address: `0x${Math.random().toString(16).slice(2, 42)}`,
        name: name,
        description: description || "",
        avatar: avatar,
      };

      return mockCommunity;
    },
    onSuccess: (createdCommunity) => {
      queryClient.invalidateQueries({ queryKey: ["user-communities"] });

      toast.success("Community created successfully!");

      setActiveCommunity(createdCommunity as Community);
      setActiveSection(Section.CHAT);
    },
    onError: (error: Error) => {
      toast.error(`Failed to create community: ${error.message}`);
    },
  });

  return {
    ...createMutation,
    createCommunity: createMutation.mutate,
    createCommunityAsync: createMutation.mutateAsync,
  };
}
