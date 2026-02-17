import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectionCard({ icon, title, description, selected, onClick }: SelectionCardProps) {
  return (
    <Card
      className={cn(
        "p-6 cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
        selected && "border-primary bg-primary/5 shadow-md"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={cn(
          "p-4 rounded-full transition-colors",
          selected ? "bg-primary/10" : "bg-muted"
        )}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
