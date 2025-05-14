"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

export function ProfileSettingsCard({
  avatarSrc,
  name,
  bio,
  onEditPhoto,
  onRemovePhoto,
}: ProfileSettingsCardProps) {
  const defaultValues: Partial<ProfileFormValues> = {
    name: name,
    description: bio,
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    console.log("Profile data:", data);
  }

  return (
    <Card>
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
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
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
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
