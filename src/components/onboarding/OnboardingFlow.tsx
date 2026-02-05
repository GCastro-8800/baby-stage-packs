import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "./StepIndicator";
import { SituationStep } from "./steps/SituationStep";
import { DateStep } from "./steps/DateStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { CompletionStep } from "./steps/CompletionStep";
import { ChevronLeft } from "lucide-react";
import { format } from "date-fns";

interface OnboardingData {
  situation: "expecting" | "born" | null;
  date: Date | null;
  isFirstChild: boolean | null;
}

const TOTAL_STEPS = 4;

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    situation: null,
    date: null,
    isFirstChild: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userName = profile?.full_name?.split(" ")[0] || undefined;

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.situation !== null;
      case 2:
        return data.date !== null;
      case 3:
        return data.isFirstChild !== null;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: Record<string, unknown> = {
        parent_situation: data.situation,
        is_first_child: data.isFirstChild,
        onboarding_completed: true,
      };

      // Set the appropriate date field based on situation
      if (data.date) {
        const dateStr = format(data.date, "yyyy-MM-dd");
        if (data.situation === "expecting") {
          updateData.baby_due_date = dateStr;
          updateData.baby_birth_date = null;
        } else {
          updateData.baby_birth_date = dateStr;
          updateData.baby_due_date = null;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      await refreshProfile();
      navigate("/app", { replace: true });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar tu información. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      <div className="p-4">
        {step > 1 && step < 4 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-lg">
          <div className="transition-all duration-300 ease-in-out">
            {step === 1 && (
              <SituationStep
                value={data.situation}
                onChange={(situation) => {
                  setData({ ...data, situation });
                  // Auto-advance after selection
                  setTimeout(() => setStep(2), 300);
                }}
                userName={userName}
              />
            )}

            {step === 2 && data.situation && (
              <DateStep
                situation={data.situation}
                value={data.date}
                onChange={(date) => setData({ ...data, date: date ?? null })}
              />
            )}

            {step === 3 && (
              <ExperienceStep
                value={data.isFirstChild}
                onChange={(isFirstChild) => {
                  setData({ ...data, isFirstChild });
                  // Auto-advance after selection
                  setTimeout(() => setStep(4), 300);
                }}
              />
            )}

            {step === 4 && (
              <CompletionStep
                onComplete={handleComplete}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Navigation for date step */}
          {step === 2 && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Step indicator */}
          <div className="mt-12">
            <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
          </div>
        </div>
      </div>
    </div>
  );
}
