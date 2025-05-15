import { AppHeader } from "../header/app-header";
import { MessagesCommunityFeed } from "../messages/messages-community-feed";

export function MessagesPage() {
  return (
    <div className="container">
      <AppHeader />
      <MessagesCommunityFeed />
    </div>
  );
}
