import { useEffect } from "react";
import { useCommunityCreateStore } from "@/stores/community-create-store";
import { CommunityCreateStep1 } from "./community-create-step-1";
import { CommunityCreateStep2 } from "./community-create-step-2";
import { CommunityCreateStepper } from "./community-create-stepper";
import { BottomActionBar } from "./bottom-action-bar";

export function CommunityCreateForm() {
  const { currentStep, validateForm, nextStep, prevStep, isValid } =
    useCommunityCreateStore();

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

  console.log({
    isValid,
  });

  return (
    <div className="w-full h-full flex flex-col justify-between flex-1">
      <CommunityCreateStepper />

      <div className="p-3 flex-grow overflow-auto">
        <div className="bg-card rounded-3xl p-3">{renderStep()}</div>
      </div>

      <BottomActionBar
        onBack={currentStep > 1 ? prevStep : undefined}
        onNext={nextStep}
        nextDisabled={!isValid}
        showBackButton={currentStep > 1}
      />
    </div>
  );
}
