import { useEffect } from "react";
import {
  useCommunityCreateStore,
  CommunityCreateStep,
} from "@/stores/community-create-store";
import { CommunityCreateResumeStep } from "./community-create-resume-step";
import { CommunityCreateStepper } from "./community-create-stepper";
import { BottomActionBar } from "./bottom-action-bar";
import { useCreateCommunity } from "@/hooks/community/use-create-community";
import { toast } from "sonner";
import { CommunityCreateGlobalCard } from "./community-create-global-card";
import { CommunityCreateOneTimeAccess } from "./community-create-one-time-access";

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
        return (
          <div className="flex flex-col gap-3">
            <CommunityCreateGlobalCard />
            <CommunityCreateOneTimeAccess />
          </div>
        );
      case 2:
        return <CommunityCreateResumeStep />;
      default:
        return <CommunityCreateGlobalCard />;
    }
  };

  const handleAction = async () => {
    if (currentStep === CommunityCreateStep.STEP_2) {
      try {
        await createCommunityAsync(communityInfo);

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

      <div className="p-3 flex-grow overflow-auto">{renderStep()}</div>

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
