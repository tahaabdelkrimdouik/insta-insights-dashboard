import { TrendingUp, TrendingDown, Users, Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type MetricType = "followers" | "likes" | "comments" | "all";

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
  likes: Heart,
  comments: MessageCircle,
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
        "flex-1 min-w-[140px] flex flex-col gap-2 p-4 rounded-xl transition-all duration-300 ease-out",
        "bg-card border-2 hover:shadow-lg hover:-translate-y-0.5",
        isActive 
          ? "border-current shadow-md scale-[1.02]" 
          : "border-border/50 hover:border-border opacity-70 hover:opacity-100"
      )}
      style={{ 
        borderColor: isActive ? color : undefined,
        boxShadow: isActive ? `0 4px 20px ${color}25` : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div 
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
            isActive ? "opacity-100" : "opacity-60"
          )}
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            className="w-4 h-4" 
            style={{ color }}
          />
        </div>
        <div 
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300",
            isActive ? "scale-100" : "scale-75 opacity-50"
          )}
          style={{ backgroundColor: color }}
        />
      </div>
      
      <div className="text-left">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
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
      </div>
    </button>
  );
}
