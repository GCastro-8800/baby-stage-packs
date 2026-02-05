import { format, addMonths, subYears } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateStepProps {
  situation: "expecting" | "born";
  value: Date | null;
  onChange: (date: Date | undefined) => void;
}

export function DateStep({ situation, value, onChange }: DateStepProps) {
  const isExpecting = situation === "expecting";
  const today = new Date();
  
  // For expecting: allow dates from today to +10 months
  // For born: allow dates from -3 years to today
  const fromDate = isExpecting ? today : subYears(today, 3);
  const toDate = isExpecting ? addMonths(today, 10) : today;

  const title = isExpecting
    ? "¿Cuándo esperas que llegue?"
    : "¿Cuándo nació tu bebé?";

  const subtitle = isExpecting
    ? "Una fecha aproximada está bien"
    : "Así sabremos en qué etapa está";

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex justify-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full max-w-xs justify-start text-left font-normal h-12",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? (
                format(value, "PPP", { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              onSelect={onChange}
              disabled={(date) => date < fromDate || date > toDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
