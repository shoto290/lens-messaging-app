import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCommunityAvatarUpload } from "@/hooks/community/use-community-avatar-upload";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { UserAvatar } from "../user/user-avatar";
import { Icons } from "../icons";
import { useAccountCreateStore } from "@/stores/account-create-store";
import { useCreateAccount } from "@/hooks/account/use-create-account";

const communityCreateFormSchema = z.object({
  username: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

type CommunityCreateFormValues = z.infer<typeof communityCreateFormSchema>;

interface CreateProfileProps {
  newUser: boolean;
  setWantToCreateAccount: (wantToCreateAccount: boolean) => void;
  disconnect: () => void;
}

export function CreateProfile({
  newUser,
  setWantToCreateAccount,
  disconnect,
}: CreateProfileProps) {
  const { createAccount, isPending } = useCreateAccount();
  const { accountInfo, updateAccountInfo } = useAccountCreateStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatarAsync, isUploading: isUploadingAvatar } =
    useCommunityAvatarUpload();

  const defaultValues: Partial<CommunityCreateFormValues> = {
    username: accountInfo.username,
    name: accountInfo.name,
    description: accountInfo.bio,
  };

  const form = useForm<CommunityCreateFormValues>({
    resolver: zodResolver(communityCreateFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && form.formState.isValid) {
        onSubmit(form.getValues());
      }
    });

    return () => subscription.unsubscribe();
  }, [form.watch]);

  function onSubmit(data: CommunityCreateFormValues) {
    try {
      updateAccountInfo({
        username: data.username,
        name: data.name,
        bio: data.description,
      });
    } catch (error) {
      console.error("Error submitting profile data:", error);
      toast.error("Error submitting profile data");
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const avatar = await uploadAvatarAsync(file);
        updateAccountInfo({
          picture: avatar,
        });
      } catch (error) {
        console.error("Error uploading avatar:", error);
        toast.error("Error uploading avatar");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Card className="relative w-full">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Create a new profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <UserAvatar
              className="size-16"
              name={accountInfo.name}
              icon={accountInfo.picture ?? ""}
            />
            <div className="mt-2 flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="rounded"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Edit photo
              </Button>
            </div>
          </div>
          <Form {...form}>
            <form className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="pl-8"
                          placeholder="username"
                          {...field}
                          disabled={isUploadingAvatar}
                        />
                      </FormControl>
                      {isUploadingAvatar && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center">
                        <p>@</p>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display name</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          disabled={isUploadingAvatar}
                        />
                      </FormControl>
                      {isUploadingAvatar && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={isUploadingAvatar}
                          className="resize-none max-h-20"
                        />
                      </FormControl>
                      {isUploadingAvatar && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="w-full flex gap-2 items-center">
        <Button
          onClick={() => {
            if (newUser) {
              disconnect();
            } else {
              setWantToCreateAccount(false);
            }
          }}
          className="rounded-full"
          size="icon"
          variant="outline"
        >
          <Icons.ArrowLeft />
        </Button>
        <Button
          onClick={() => createAccount()}
          className="flex-1"
          size="rounded"
          variant="secondary"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Icons.Loader className="size-4 animate-spin" />
              Waiting for signature
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
}
