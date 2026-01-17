import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changePercent?: number;
  trend?: "up" | "down";
  icon: LucideIcon;
  iconClassName?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  change,
  changePercent,
  trend,
  icon: Icon,
  iconClassName,
  suffix = "",
}: StatCardProps) {
  return (
    <div className="stat-card fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
            {suffix}
          </p>
          {change !== undefined && changePercent !== undefined && (
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  trend === "up" ? "text-success" : "text-destructive"
                )}
              >
                {trend === "up" ? "+" : ""}
                {changePercent.toFixed(2)}%
              </span>
              <span className="text-sm text-muted-foreground">
                ({trend === "up" ? "+" : ""}
                {change.toLocaleString()})
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-3",
            iconClassName || "bg-primary/10"
          )}
        >
          <Icon className={cn("h-6 w-6", iconClassName ? "text-primary-foreground" : "text-primary")} />
        </div>
      </div>
    </div>
  );
}
