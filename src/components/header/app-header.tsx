import { useNavigation } from "@/stores/navigation-store";
import { Icons } from "../icons";
import { Button } from "../ui/button";

export function AppHeader() {
  const { activeSection } = useNavigation();

  return (
    <div className="rounded-b-[30px] p-[12px] py-[16px] flex justify-between items-center">
      <p className="pl-3 text-base font-medium font-mono">{activeSection}</p>
      <div className="space-x-2">
        <Button variant="secondary" size="icon">
          <Icons.Bell />
        </Button>
      </div>
    </div>
  );
}
