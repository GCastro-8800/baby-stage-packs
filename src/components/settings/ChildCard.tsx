import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Baby, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Child } from "@/types/baby";

interface ChildCardProps {
  child: Child;
  onEdit: () => void;
  onDelete: () => void;
  onSetActive: () => void;
  isOnly: boolean;
}

export function ChildCard({ child, onEdit, onDelete, onSetActive, isOnly }: ChildCardProps) {
  const dateStr = child.situation === "born" ? child.birth_date : child.due_date;
  const dateFormatted = dateStr
    ? format(new Date(dateStr), "d 'de' MMMM yyyy", { locale: es })
    : null;

  return (
    <Card className={child.is_active ? "border-primary/50 bg-primary/5" : ""}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-full bg-muted">
              <Baby className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">
                  {child.name || "Sin nombre"}
                </span>
                {child.is_active && (
                  <Badge variant="secondary" className="text-xs shrink-0">
                    <Star className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {child.situation === "expecting" ? "En espera" : "Nacido/a"}
                {dateFormatted && ` · ${dateFormatted}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!child.is_active && (
              <Button variant="ghost" size="icon" onClick={onSetActive} title="Marcar como activo">
                <Star className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            {!isOnly && (
              <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
