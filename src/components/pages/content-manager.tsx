"use client";

import { Section } from "@/lib/types/navigation";
import { useNavigation } from "@/stores/navigation-store";
import { DiscoverPage } from "./discover-page";
import { MessagesPage } from "./messages-page";
import { CreatePage } from "./create-page";

export function ContentManager() {
  const { activeSection } = useNavigation();

  return (
    <div className="w-full">
      {activeSection === Section.DISCOVER && <DiscoverPage />}
      {activeSection === Section.MESSAGES && <MessagesPage />}
      {activeSection === Section.CREATE && <CreatePage />}
    </div>
  );
}
