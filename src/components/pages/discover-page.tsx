import { DiscoverCommunityFeed } from "../discover/discover-community-feed";
import { AppHeader } from "../header/app-header";

export function DiscoverPage() {
  return (
    <div className="container">
      <AppHeader />
      <DiscoverCommunityFeed />
    </div>
  );
}
