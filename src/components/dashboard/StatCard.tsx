import { CardRoot } from "@omnidotdev/thornberry/card";

import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  description?: string;
}

/**
 * Stat card for dashboard metrics.
 */
const StatCard = ({ icon, label, value, description }: StatCardProps) => (
  <CardRoot className="p-4">
    <div className="flex items-start gap-3">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="truncate font-bold text-2xl">{value}</p>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </div>
    </div>
  </CardRoot>
);

export default StatCard;
