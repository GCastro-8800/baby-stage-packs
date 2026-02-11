import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShipmentItem, Feedback } from "@/hooks/useSubscription";

interface ItemFeedbackProps {
  item: ShipmentItem;
  feedback?: Feedback;
  onFeedback: (rating: "useful" | "not_useful") => void;
  showFeedback: boolean;
}

export function ItemFeedback({ item, feedback, onFeedback, showFeedback }: ItemFeedbackProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.name || `${item.brand} ${item.model}`}</p>
        <p className="text-xs text-muted-foreground">{item.category}</p>
      </div>
      {showFeedback && (
        <div className="flex items-center gap-1 ml-3">
          <Button
            variant={feedback?.rating === "useful" ? "default" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => onFeedback("useful")}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={feedback?.rating === "not_useful" ? "destructive" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => onFeedback("not_useful")}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
