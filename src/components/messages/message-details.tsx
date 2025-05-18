import React from "react";
import { BottomActionBar } from "../community/bottom-action-bar";
import { Button } from "../ui/button";
import { Icons } from "../icons";
import { Share2Icon, ReplyIcon } from "lucide-react";

interface MessageDetailsProps {
  messageId: string;
}

export function MessageDetails({ messageId }: MessageDetailsProps) {
  const handleReply = () => {
    console.log("Reply to message:", messageId);
  };

  const handleShare = () => {
    console.log("Share message:", messageId);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4">
        {/* Message content would go here */}
        <h2 className="text-xl font-bold mb-2">Message Title</h2>
        <p className="text-muted-foreground">Message content goes here...</p>
      </div>

      {/* Using BottomActionBar with custom children */}
      <BottomActionBar>
        <div className="flex w-full justify-between items-center">
          <Button size="sm" variant="outline" className="rounded-full">
            <Icons.ArrowLeft className="size-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleShare}>
              <Share2Icon className="size-4" />
            </Button>
            <Button onClick={handleReply}>
              <ReplyIcon className="size-4 mr-2" />
              Reply
            </Button>
          </div>
        </div>
      </BottomActionBar>
    </div>
  );
}
