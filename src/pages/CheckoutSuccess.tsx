import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["stripe-subscription", user.id] });
      queryClient.invalidateQueries({ queryKey: ["subscription", user.id] });
    }
  }, [user, queryClient]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/app");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/60">
          Confirmado
        </p>

        <div className="space-y-5">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-foreground">
            Tu kit ya está en marcha
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Te escribimos por email con los detalles de tu primer envío. Si surge cualquier duda, estamos aquí.
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <button
            onClick={() => navigate("/app")}
            className="inline-block border-b border-foreground/40 pb-1 text-sm text-foreground hover:border-foreground transition-colors"
          >
            Ir a mi panel
          </button>
          <p className="text-xs text-muted-foreground">
            Te llevamos automáticamente en {countdown}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
