import { Icons } from "@/components/icons";
import { NavItem, Section } from "../types/navigation";

export const NAVBAR_ITEMS: NavItem[] = [
  {
    id: "messages",
    icon: Icons.Message,
    label: "Messages",
    section: Section.MESSAGES,
  },
  {
    id: "discover",
    icon: Icons.Discover,
    label: "Discover",
    section: Section.DISCOVER,
  },
  {
    id: "create",
    icon: Icons.Create,
    label: "Create",
    section: Section.CREATE,
  },
];
