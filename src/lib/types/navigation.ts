import { FunctionComponent } from "react";

export enum Section {
  DISCOVER = "Discover",
  MESSAGES = "Messages",
  CREATE = "Create",
}

export interface NavItem {
  id: string;
  icon: FunctionComponent<{ className?: string }>;
  label: string;
  section: Section;
}
