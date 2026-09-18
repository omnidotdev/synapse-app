import cn from "@/lib/utils";

interface UsageProgressProps {
  label: string;
  value: number;
  limit: number | null;
}

/**
 * Progress bar showing current usage vs limit.
 */
const UsageProgress = ({ label, value, limit }: UsageProgressProps) => {
  const percentage = limit ? Math.min((value / limit) * 100, 100) : 0;
  const isHigh = percentage > 80;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {value.toLocaleString()}
          {limit != null && ` / ${limit.toLocaleString()}`}
        </span>
      </div>
      {limit != null ? (
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              isHigh ? "bg-destructive" : "bg-primary",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">No limit configured</p>
      )}
    </div>
  );
};

export default UsageProgress;
