import { Card, CardContent } from "@/components/ui/card";

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
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="truncate font-bold text-2xl">{value}</p>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatCard;
