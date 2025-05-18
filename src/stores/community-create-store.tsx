import { create } from "zustand";

export enum CommunityCreateStep {
  STEP_1 = 1,
  STEP_2 = 2,
}

interface CommunityCreateInfo {
  name: string;
  description: string;
  avatar?: string;
}

interface CommunityCreateState {
  currentStep: number;
  communityInfo: CommunityCreateInfo;
  isValid: boolean;
  isSubmitting: boolean;
}

interface CommunityCreateActions {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateCommunityInfo: (info: Partial<CommunityCreateInfo>) => void;
  reset: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
  validateForm: () => boolean;
}

// Store complet
interface CommunityCreateStore
  extends CommunityCreateState,
    CommunityCreateActions {}

// État par défaut
const DEFAULT_STATE: CommunityCreateState = {
  currentStep: CommunityCreateStep.STEP_1,
  communityInfo: {
    name: "",
    description: "",
    avatar: undefined,
  },
  isValid: false,
  isSubmitting: false,
};

export const useCommunityCreateStore = create<CommunityCreateStore>(
  (set, get) => ({
    ...DEFAULT_STATE,

    nextStep: () => {
      const { currentStep, isValid } = get();
      if (isValid) {
        set({ currentStep: (currentStep + 1) as CommunityCreateStep });
      }
    },

    prevStep: () => {
      const { currentStep } = get();
      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 });
      }
    },

    goToStep: (step: number) => {
      if (step >= 1 && step <= 2) {
        set({ currentStep: step });
      }
    },

    updateCommunityInfo: (info: Partial<CommunityCreateInfo>) => {
      const { communityInfo } = get();
      const newInfo = { ...communityInfo, ...info };
      set({
        communityInfo: newInfo,
        isValid: get().validateForm(),
      });
    },

    reset: () => {
      set(DEFAULT_STATE);
    },

    setSubmitting: (isSubmitting: boolean) => {
      set({ isSubmitting });
    },

    validateForm: () => {
      const { communityInfo, currentStep } = get();

      if (currentStep === CommunityCreateStep.STEP_1) {
        const isStep1Valid = communityInfo.name.trim().length > 0;
        set({ isValid: isStep1Valid });
        return isStep1Valid;
      }

      if (currentStep === CommunityCreateStep.STEP_2) {
        set({ isValid: true });
        return true;
      }

      return false;
    },
  })
);
