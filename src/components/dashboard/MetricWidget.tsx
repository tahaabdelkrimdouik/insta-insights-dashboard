import { TrendingUp, TrendingDown, Users, Eye, TrendingUp as GainIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type MetricType = "followers" | "reach" | "dailyGain" | "all";

interface MetricWidgetProps {
  type: MetricType;
  label: string;
  value: string;
  change: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const iconMap = {
  followers: Users,
  reach: Eye,
  dailyGain: GainIcon,
  all: Users,
};

export function MetricWidget({ 
  type, 
  label, 
  value, 
  change, 
  color, 
  isActive, 
  onClick 
}: MetricWidgetProps) {
  const isPositive = change >= 0;
  const Icon = iconMap[type];
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col gap-2 p-4 rounded-2xl transition-all duration-300 ease-out cursor-pointer",
        "bg-card border-2 hover:shadow-lg hover:-translate-y-0.5 text-left",
        isActive 
          ? "shadow-md" 
          : "border-border/30 hover:border-border opacity-60 hover:opacity-100"
      )}
      style={{ 
        borderColor: isActive ? color : undefined,
        boxShadow: isActive ? `0 8px 24px ${color}25` : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
            isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"
          )}
          style={{ 
            background: `linear-gradient(135deg, ${color}20 0%, ${color}08 100%)` 
          }}
        >
          <Icon 
            className="w-5 h-5" 
            style={{ color }}
          />
        </div>
        <div 
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300",
            isActive ? "scale-100" : "scale-0"
          )}
          style={{ backgroundColor: color }}
        />
      </div>
      
      <div>
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={cn(
          "text-2xl font-bold transition-colors duration-300",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}>
          {value}
        </p>
      </div>
      
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5 text-success" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-destructive" />
        )}
        <span className={cn(
          "text-sm font-semibold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">vs last period</span>
      </div>
    </button>
  );
}
