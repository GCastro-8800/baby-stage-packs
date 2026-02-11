import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NoSubscriptionCard() {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Tu suscripción
        </CardTitle>
        <CardDescription>Estado de tu plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Aún no tienes una suscripción activa
            </p>
            <Button size="sm" onClick={() => navigate("/#precios")}>
              Ver planes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
