"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";

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
import { useLensAuthentication } from "@/hooks/use-lens-authentication";
import { LensAuthOverlay } from "./lens-auth-overlay";
import { Loader2 } from "lucide-react";
import { useLensProfileUpdateMetadata } from "@/hooks/use-lens-profile-update-metadata";

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
  onEditPhoto: () => void;
  onRemovePhoto: () => void;
}

// Define the ref type to expose methods to parent components
export interface ProfileSettingsCardHandle {
  saveProfile: () => void;
}

export const ProfileSettingsCard = forwardRef<
  ProfileSettingsCardHandle,
  ProfileSettingsCardProps
>(({ avatarSrc, name, bio, onEditPhoto, onRemovePhoto }, ref) => {
  const { isAuthenticated } = useLensAuthentication();

  // Use the real hook implementation
  const { updateMetadata, isUpdatingName, isUpdatingBio, isPending } =
    useLensProfileUpdateMetadata();

  const defaultValues: Partial<ProfileFormValues> = {
    name: name,
    description: bio,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // Handle field blur events to update metadata
  const handleBlur = () => {
    if (!isAuthenticated) return;

    const nameValue = form.getValues("name");
    const descriptionValue = form.getValues("description");

    // Only update if values have changed
    if (nameValue !== name || descriptionValue !== bio) {
      updateMetadata({
        name: nameValue,
        bio: descriptionValue,
      });
    }
  };

  // Expose saveProfile method to parent components through ref
  useImperativeHandle(ref, () => ({
    saveProfile: () => {
      const nameValue = form.getValues("name");
      const descriptionValue = form.getValues("description");

      // Only update if values have changed and user is authenticated
      if (isAuthenticated && (nameValue !== name || descriptionValue !== bio)) {
        updateMetadata({
          name: nameValue,
          bio: descriptionValue,
        });
      }
    },
  }));

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile data:", data);
    updateMetadata({ name: data.name, bio: data.description });
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
            <Button
              type="button"
              variant="outline"
              size="rounded"
              onClick={onEditPhoto}
            >
              Edit photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="rounded"
              onClick={onRemovePhoto}
            >
              Remove
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
                        disabled={isUpdatingName || isPending}
                      />
                    </FormControl>
                    {isUpdatingName && (
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
                        disabled={isUpdatingBio || isPending}
                      />
                    </FormControl>
                    {isUpdatingBio && (
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

// Add display name
ProfileSettingsCard.displayName = "ProfileSettingsCard";
