import { DURATION_OPTIONS, type DurationOption } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface DurationSelectorProps {
  selected: number;
  onChange: (months: number) => void;
}

const DurationSelector = ({ selected, onChange }: DurationSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-muted/50 border border-border w-fit mx-auto">
      {DURATION_OPTIONS.map((opt) => {
        const isActive = selected === opt.months;
        return (
          <button
            key={opt.months}
            onClick={() => onChange(opt.months)}
            className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
            {opt.discount > 0 && (
              <Badge
                variant="secondary"
                className={`absolute -top-2 -right-2 text-[10px] px-1 py-0 leading-tight ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                -{opt.discount * 100}%
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DurationSelector;
