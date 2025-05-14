"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "@/hooks/use-account";
import { useDisconnect } from "@/hooks/use-disconnect";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
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
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Icons } from "../icons";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { account } = useAccount();
  const { disconnect } = useDisconnect();
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(
    account?.account.metadata?.picture
  );

  const defaultValues: Partial<SettingsFormValues> = {
    name: account?.account.metadata?.name || "",
    description: account?.account.metadata?.bio || "",
    email: "",
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsFormValues) {
    console.log(data);
  }

  function handleEditPhoto() {
    console.log("Edit photo clicked");
  }

  function handleRemovePhoto() {
    setAvatarSrc(undefined);
  }

  function handleLogout() {
    disconnect();
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerTitle hidden className="text-center">
          Settings
        </DrawerTitle>
        <div className="px-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={avatarSrc} />
                      <AvatarFallback>
                        {defaultValues.name?.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="rounded"
                        onClick={handleEditPhoto}
                      >
                        Edit photo
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="rounded"
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-4">
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
                            <Textarea
                              placeholder="Tell us about yourself"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notifications Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="secondary"
              size="rounded"
              className="w-full"
              onClick={handleLogout}
            >
              <Icons.Door className="size-4" />
              Log out
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
