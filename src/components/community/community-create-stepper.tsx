import {
  CommunityCreateStep,
  useCommunityCreateStore,
} from "@/stores/community-create-store";
import { useMemo } from "react";
import { Badge } from "../ui/badge";

const steps = [
  {
    id: CommunityCreateStep.STEP_1,
    name: "Informations",
    description: "Set the community informations",
  },
  {
    id: CommunityCreateStep.STEP_2,
    name: "Confirmation",
    description: "Confirm the community creation",
  },
];

export function CommunityCreateStepper() {
  const { currentStep } = useCommunityCreateStore();

  const currentStepData = useMemo(() => {
    return steps.find((step) => step.id === currentStep);
  }, [currentStep]);

  return (
    <div className=" absolute top-0 left-0 right-0 flex items-center gap-2 border-b border-border p-3 justify-between bg-background z-10">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium font-mono">
          {currentStepData?.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {currentStepData?.description}
        </p>
      </div>
      <Badge variant="outline" className="text-xs font-mono">
        {currentStep}/{steps.length}
      </Badge>
    </div>
  );
}
