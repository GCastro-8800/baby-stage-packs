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
          Tu servicio
        </CardTitle>
        <CardDescription>Estado de tu equipamiento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <p className="text-muted-foreground text-sm mb-3">
              Aún no tienes un servicio activo
            </p>
            <Button size="sm" onClick={() => navigate("/catalogo")}>
              Explorar catálogo
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
