import { useNavigation } from "@/stores/navigation-store";
import { SettingsDrawer } from "../settings/settings-drawer";

export function AppHeader() {
  const { activeSection } = useNavigation();

  return (
    <div className="rounded-b-[30px] p-[12px] py-[16px] pr-[20px] flex justify-between items-center">
      <p className="pl-3 text-base font-medium font-mono">{activeSection}</p>
      <div className="space-x-2">
        <SettingsDrawer />
      </div>
    </div>
  );
}
