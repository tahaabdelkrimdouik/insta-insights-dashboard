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
        "flex-1 min-w-[120px] flex flex-col gap-2 p-4 rounded-2xl transition-all duration-300 ease-out",
        "bg-card border-2 hover:shadow-lg hover:-translate-y-0.5",
        isActive 
          ? "shadow-md scale-[1.02]" 
          : "border-border/30 hover:border-border opacity-60 hover:opacity-100"
      )}
      style={{ 
        borderColor: isActive ? color : undefined,
        boxShadow: isActive ? `0 8px 24px ${color}30` : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div 
          className={cn(
            "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300",
            isActive ? "opacity-100" : "opacity-50"
          )}
          style={{ 
            background: `linear-gradient(135deg, ${color}25 0%, ${color}10 100%)` 
          }}
        >
          <Icon 
            className="w-4.5 h-4.5" 
            style={{ color }}
          />
        </div>
        <div 
          className={cn(
            "w-2 h-2 rounded-full transition-all duration-300",
            isActive ? "scale-100" : "scale-0"
          )}
          style={{ backgroundColor: color }}
        />
      </div>
      
      <div className="text-left">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={cn(
          "text-xl font-bold transition-colors duration-300",
          isActive ? "text-foreground" : "text-muted-foreground"
        )}>
          {value}
        </p>
      </div>
      
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-success" />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive" />
        )}
        <span className={cn(
          "text-xs font-semibold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
    </button>
  );
}
