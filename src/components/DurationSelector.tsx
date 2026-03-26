import { DURATION_OPTIONS } from "@/lib/constants";

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
            className={`flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DurationSelector;
