import { Icons } from "@/components/icons";
import { NavItem } from "../types/navigation";

export const NAVBAR_ITEMS: NavItem[] = [
  {
    id: "discover",
    icon: Icons.Discover,
    label: "Discover",
    href: "/discover",
  },
  {
    id: "messages",
    icon: Icons.Message,
    label: "Messages",
    href: "/messages",
  },
  {
    id: "create",
    icon: Icons.Create,
    label: "Create",
    href: "/create",
  },
];
