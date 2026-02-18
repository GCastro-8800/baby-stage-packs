import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Child, Situation } from "@/types/baby";

interface ChildFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name?: string; situation: Situation; due_date?: string | null; birth_date?: string | null }) => void;
  child?: Child | null;
  isLoading?: boolean;
}

export function ChildFormDialog({ open, onOpenChange, onSubmit, child, isLoading }: ChildFormDialogProps) {
  const [name, setName] = useState("");
  const [situation, setSituation] = useState<Situation>("expecting");
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (child) {
      setName(child.name ?? "");
      setSituation(child.situation);
      const dateStr = child.situation === "born" ? child.birth_date : child.due_date;
      setDate(dateStr ? new Date(dateStr) : undefined);
    } else {
      setName("");
      setSituation("expecting");
      setDate(undefined);
    }
  }, [child, open]);

  const handleSubmit = () => {
    const dateStr = date ? format(date, "yyyy-MM-dd") : null;
    onSubmit({
      name: name.trim() || undefined,
      situation,
      due_date: situation === "expecting" ? dateStr : null,
      birth_date: situation === "born" ? dateStr : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">
            {child ? "Editar hijo/a" : "Agregar hijo/a"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="childName">Nombre (opcional)</Label>
            <Input
              id="childName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del bebé"
            />
          </div>

          <div className="space-y-2">
            <Label>Situación</Label>
            <div className="flex gap-3">
              <Button
                type="button"
                variant={situation === "expecting" ? "default" : "outline"}
                className="flex-1"
                onClick={() => { setSituation("expecting"); setDate(undefined); }}
              >
                Estoy esperando
              </Button>
              <Button
                type="button"
                variant={situation === "born" ? "default" : "outline"}
                className="flex-1"
                onClick={() => { setSituation("born"); setDate(undefined); }}
              >
                Ya nació
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              {situation === "expecting" ? "Fecha esperada de nacimiento" : "Fecha de nacimiento"}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isLoading || !date}>
            {child ? "Guardar" : "Agregar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
