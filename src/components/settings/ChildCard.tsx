import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex items-center justify-between gap-4 py-5 border-b border-foreground/10 last:border-b-0">
      <div className="min-w-0">
        <h4 className="font-display text-lg text-foreground truncate">
          {child.name || "Sin nombre"}
        </h4>
        <p className="text-sm text-muted-foreground mt-1">
          {child.is_active && (
            <span className="text-foreground/70 uppercase tracking-wider text-[10px] mr-2">
              Activo ·
            </span>
          )}
          {child.situation === "expecting" ? "En espera" : "Nacido/a"}
          {dateFormatted && ` · ${dateFormatted}`}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!child.is_active && (
          <button
            onClick={onSetActive}
            className="text-xs uppercase tracking-wider text-foreground/70 border-b border-foreground/40 pb-0.5 hover:text-foreground hover:border-foreground transition-colors"
          >
            Marcar activo
          </button>
        )}
        <Button variant="ghost" size="icon" onClick={onEdit} className="hover:bg-transparent text-foreground/60 hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </Button>
        {!isOnly && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="hover:bg-transparent text-foreground/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
