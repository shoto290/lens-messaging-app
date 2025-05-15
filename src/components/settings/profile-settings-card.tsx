"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useRef } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLensAuthentication } from "@/hooks/lens/use-lens-authentication";
import { LensAuthOverlay } from "./lens-auth-overlay";
import { Loader2 } from "lucide-react";
import { useLensProfileUpdateMetadata } from "@/hooks/lens/use-lens-profile-update-metadata";
import { useLensAvatarUpload } from "@/hooks/lens/use-lens-avatar-upload";
import { toast } from "sonner";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileSettingsCardProps {
  avatarSrc?: string;
  name: string;
  bio: string;
}

export interface ProfileSettingsCardHandle {
  saveProfile: () => void;
}

export const ProfileSettingsCard = forwardRef<
  ProfileSettingsCardHandle,
  ProfileSettingsCardProps
>(({ avatarSrc, name, bio }, ref) => {
  const { isAuthenticated } = useLensAuthentication();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateMetadata, isPending } = useLensProfileUpdateMetadata();

  const { uploadAvatar, isUploading } = useLensAvatarUpload();

  const defaultValues: Partial<ProfileFormValues> = {
    name: name,
    description: bio,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const handleBlur = () => {
    if (!isAuthenticated) return;

    const nameValue = form.getValues("name");
    const descriptionValue = form.getValues("description");

    if (nameValue !== name || descriptionValue !== bio) {
      updateMetadata({
        name: nameValue,
        bio: descriptionValue,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isAuthenticated) {
      uploadAvatar(file);
    }
  };

  const handleEditPhoto = () => {
    fileInputRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    saveProfile: () => {
      const nameValue = form.getValues("name");
      const descriptionValue = form.getValues("description");

      if (isAuthenticated && (nameValue !== name || descriptionValue !== bio)) {
        updateMetadata({
          name: nameValue,
          bio: descriptionValue,
        });
      }
    },
  }));

  function onSubmit(data: ProfileFormValues) {
    try {
      updateMetadata({ name: data.name, bio: data.description });
    } catch (error) {
      console.error("Error submitting profile data:", error);
      toast.error("Error submitting profile data");
    }
  }

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
          </Avatar>
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
              onClick={handleEditPhoto}
              disabled={!isAuthenticated || isUploading || isPending}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Edit photo
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        onBlur={() => handleBlur()}
                        disabled={isPending}
                      />
                    </FormControl>
                    {isPending && (
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
                        placeholder="Tell us about yourself"
                        {...field}
                        onBlur={() => handleBlur()}
                        disabled={isPending}
                        className="resize-none max-h-20"
                      />
                    </FormControl>
                    {isPending && (
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

        {!isAuthenticated && <LensAuthOverlay />}
      </CardContent>
    </Card>
  );
});

ProfileSettingsCard.displayName = "ProfileSettingsCard";
