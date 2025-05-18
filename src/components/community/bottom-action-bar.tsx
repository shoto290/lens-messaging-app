import React from "react";
import { BottomNavigation } from "./bottom-navigation";
import { Button } from "../ui/button";
import { Icons } from "../icons";

interface BottomActionBarProps {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  backLabel?: string;
  backDisabled?: boolean;
  showBackButton?: boolean;
  showNextButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function BottomActionBar({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  backDisabled = false,
  showBackButton = true,
  showNextButton = true,
  className,
  children,
}: BottomActionBarProps) {
  // If children are provided, use them instead of the default buttons
  if (children) {
    return (
      <BottomNavigation className={className}>{children}</BottomNavigation>
    );
  }

  return (
    <BottomNavigation className={className}>
      {showBackButton && (
        <Button
          className="rounded-full"
          size="icon"
          variant="outline"
          onClick={onBack}
          disabled={backDisabled}
          aria-label="Go back"
        >
          <Icons.ArrowLeft className="size-4" />
        </Button>
      )}
      {showNextButton && (
        <Button
          size="rounded"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label={nextLabel}
        >
          {nextLabel}
        </Button>
      )}
    </BottomNavigation>
  );
}
