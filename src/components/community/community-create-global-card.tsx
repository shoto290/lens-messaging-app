"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useRef, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { CommunityAvatar } from "./community-avatar";
import { useCommunityAvatarUpload } from "@/hooks/community/use-community-avatar-upload";

const communityCreateFormSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

type CommunityCreateFormValues = z.infer<typeof communityCreateFormSchema>;

export interface CommunityCreateGlobalCardHandle {
  saveProfile: () => void;
}

export const CommunityCreateGlobalCard =
  forwardRef<CommunityCreateGlobalCardHandle>(() => {
    const { updateCommunityInfo, communityInfo } = useCommunityCreateStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadAvatarAsync, isUploading: isUploadingAvatar } =
      useCommunityAvatarUpload();

    const defaultValues: Partial<CommunityCreateFormValues> = {
      name: communityInfo.name,
      description: communityInfo.description,
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
        updateCommunityInfo({
          name: data.name,
          description: data.description,
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
          await uploadAvatarAsync(file);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast.error("Error uploading avatar");
        }
      }
    };

    return (
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Community Global
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <CommunityAvatar
              className="size-16"
              name={communityInfo.name}
              icon={communityInfo.avatar ?? ""}
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
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
                          placeholder="Tell us about yourself"
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
    );
  });

CommunityCreateGlobalCard.displayName = "CommunityCreateGlobalCard";
