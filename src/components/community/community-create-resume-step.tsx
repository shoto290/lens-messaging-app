/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { CardContent } from "../ui/card";
import { CommunityResume } from "./community-resume";

export function CommunityCreateResumeStep() {
  const { communityInfo } = useCommunityCreateStore();

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-center">
          Community Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommunityResume
          community={
            {
              metadata: {
                name: communityInfo.name,
                description: communityInfo.description,
                icon: communityInfo.avatar,
              },
            } as any
          }
          hideMembers
        />
      </CardContent>
    </Card>
  );
}
