import { Section } from "@/lib/types/navigation";
import { CommunityAvatar } from "../community/community-avatar";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import { Community } from "@/services/community-service.types";
import { ChatSettingsDrawer } from "./chat-settings-drawer";

interface ChatHeaderProps {
  activeCommunity: Community;
  setActiveSection: (section: Section) => void;
}

export function ChatHeader({
  activeCommunity,
  setActiveSection,
}: ChatHeaderProps) {
  return (
    <div>
      <div className="border-border border-b p-[12px] pt-[16px] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveSection(Section.MESSAGES)}
          >
            <Icons.ChevronLeft />
          </Button>
          <CommunityAvatar
            className="rounded-md"
            name={activeCommunity.metadata?.name}
            icon={activeCommunity.metadata?.icon}
          />
          <h3 className="text-sm font-bold font-mono">
            {activeCommunity.metadata?.name}
          </h3>
        </div>
        <ChatSettingsDrawer community={activeCommunity} />
      </div>
    </div>
  );
}
