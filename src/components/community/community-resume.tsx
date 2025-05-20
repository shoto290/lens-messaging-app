/* eslint-disable @typescript-eslint/no-explicit-any */
import { Community } from "@/services/community-service.types";
import { CommunityAvatar } from "./community-avatar";
import { CommunityMembers } from "./community-members";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface CommunityResumeProps {
  community: Community;
  hideMembers?: boolean;
}

export function CommunityResume({
  community,
  hideMembers = false,
}: CommunityResumeProps) {
  console.log({ community });

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <CommunityAvatar
        className="size-16"
        name={community.metadata?.name}
        icon={community.metadata?.icon}
      />
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold font-mono">
          {community.metadata?.name}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {community.metadata?.description}
        </p>
      </div>
      {!hideMembers && <CommunityMembers community={community} />}
      {community?.rules?.required?.map((rule) => {
        if (rule.type === "SIMPLE_PAYMENT") {
          return (
            <Card className="bg-transparent w-full" key={rule.id}>
              <CardHeader>
                <CardTitle>One-time payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-border w-full flex justify-between items-center p-2 h-16 rounded-lg">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/gho.png"
                      alt="GHO"
                      className="size-10 rounded-sm"
                    />
                    <div className="flex flex-col items-start">
                      <p className="text-sm font-medium">
                        {(rule.config[1] as any).string}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(rule.config[2] as any).string}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p>
                      {(rule.config[3] as any).bigDecimal}{" "}
                      {(rule.config[2] as any).string}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;
      })}
    </div>
  );
}
