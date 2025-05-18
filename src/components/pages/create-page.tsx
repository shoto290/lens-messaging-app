import { CommunityCreateForm } from "../community/community-create-form";
import { AppHeader } from "../header/app-header";

export function CreatePage() {
  return (
    <div className="container overflow-clip">
      <AppHeader />
      <CommunityCreateForm />
    </div>
  );
}
