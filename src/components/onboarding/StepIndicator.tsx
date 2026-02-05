import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300",
            i + 1 === currentStep
              ? "bg-primary w-6"
              : i + 1 < currentStep
              ? "bg-primary"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}
