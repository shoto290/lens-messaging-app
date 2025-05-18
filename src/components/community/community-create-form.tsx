import { useEffect } from "react";
import {
  useCommunityCreateStore,
  CommunityCreateStep,
} from "@/stores/community-create-store";
import { CommunityCreateStep1 } from "./community-create-step-1";
import { CommunityCreateStep2 } from "./community-create-step-2";
import { CommunityCreateStepper } from "./community-create-stepper";
import { BottomActionBar } from "./bottom-action-bar";
import { useCreateCommunity } from "@/hooks/community/use-create-community";
import { toast } from "sonner";

export function CommunityCreateForm() {
  const {
    currentStep,
    validateForm,
    nextStep,
    prevStep,
    isValid,
    communityInfo,
    reset,
  } = useCommunityCreateStore();
  const { createCommunityAsync, isPending } = useCreateCommunity();

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CommunityCreateStep1 />;
      case 2:
        return <CommunityCreateStep2 />;
      default:
        return <CommunityCreateStep1 />;
    }
  };

  const handleAction = async () => {
    if (currentStep === CommunityCreateStep.STEP_2) {
      try {
        await createCommunityAsync({
          name: communityInfo.name,
          description: communityInfo.description,
          icon: communityInfo.avatar,
        });

        reset();
      } catch (err) {
        console.error(err);
        toast.error("Failed to create community");
      }
    } else {
      nextStep();
    }
  };

  // Determine if we're on the final step
  const isFinalStep = currentStep === CommunityCreateStep.STEP_2;

  return (
    <div className="w-full h-full flex flex-col justify-between flex-1">
      <CommunityCreateStepper />

      <div className="p-3 flex-grow overflow-auto">
        <div className="bg-card rounded-3xl p-3">{renderStep()}</div>
      </div>

      <BottomActionBar
        onBack={currentStep > 1 ? prevStep : undefined}
        onNext={handleAction}
        nextLabel={isFinalStep ? "Create" : "Next"}
        nextDisabled={!isValid || (isFinalStep && isPending)}
        showBackButton={currentStep > 1}
      />
    </div>
  );
}
