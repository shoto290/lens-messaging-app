import { useNavigation } from "@/stores/navigation-store";
import { Icons } from "../icons";
import { Button } from "../ui/button";

export function AppHeader() {
  const { activeSection } = useNavigation();

  return (
    <div className="border-border border-b p-[12px] pt-[16px] flex justify-between items-center">
      {activeSection}
      <div className="space-x-2">
        <Button variant="outline" size="icon">
          <Icons.Bell />
        </Button>
      </div>
    </div>
  );
}
