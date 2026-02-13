import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            ¡Suscripción confirmada!
          </h1>
          <p className="text-muted-foreground">
            Tu equipamiento está en camino. Recibirás un email con los detalles
            de tu primer envío.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate("/app")}
            className="w-full cta-tension"
          >
            Ir a mi panel
          </Button>
          <p className="text-xs text-muted-foreground">
            Redirigiendo automáticamente en {countdown}s...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
