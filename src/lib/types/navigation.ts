import { FunctionComponent } from "react";

export enum Section {
  DISCOVER = "discover",
  MESSAGES = "messages",
  CREATE = "create",
}

export interface NavItem {
  id: string;
  icon: FunctionComponent<{ className?: string }>;
  label: string;
  section: Section;
}
