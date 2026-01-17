import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, BarChart3, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeMap } from "./GlobeMap";

// Extended mock data for unified chart
const unifiedChartData = [
  { date: "Jan 1", followers: 42000, likes: 1850, comments: 145 },
  { date: "Jan 5", followers: 42450, likes: 2100, comments: 168 },
  { date: "Jan 10", followers: 43100, likes: 2450, comments: 192 },
  { date: "Jan 15", followers: 43800, likes: 2800, comments: 215 },
  { date: "Jan 20", followers: 44200, likes: 3100, comments: 248 },
  { date: "Jan 25", followers: 44890, likes: 3450, comments: 276 },
  { date: "Jan 30", followers: 45892, likes: 3820, comments: 312 },
];

interface KPIBlockProps {
  label: string;
  value: string;
  change: number;
  color: string;
  isActive?: boolean;
  onClick?: () => void;
}

function KPIBlock({ label, value, change, color, isActive = true, onClick }: KPIBlockProps) {
  const isPositive = change >= 0;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 px-4 py-3 rounded-lg transition-all duration-200",
        "bg-card/40 backdrop-blur-sm border border-border/50 hover:bg-card/60",
        isActive && "ring-2 ring-offset-2 ring-offset-background",
        onClick && "cursor-pointer"
      )}
      style={{ 
        borderLeftColor: color, 
        borderLeftWidth: "3px",
        ...(isActive && { ringColor: color })
      }}
    >
      <div className="flex items-center gap-2">
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
      <div className="flex items-center gap-1">
        {isPositive ? (
          <TrendingUp className="w-3 h-3 text-success" />
        ) : (
          <TrendingDown className="w-3 h-3 text-destructive" />
        )}
        <span className={cn(
          "text-xs font-medium",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </span>
      </div>
    </button>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-4 shadow-xl">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize">{entry.dataKey}:</span>
            <span className="font-medium text-foreground">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function UnifiedAnalyticsCard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "map">("analytics");

  const totals = useMemo(() => {
    const lastData = unifiedChartData[unifiedChartData.length - 1];
    const firstData = unifiedChartData[0];
    
    const totalLikes = unifiedChartData.reduce((sum, d) => sum + d.likes, 0);
    const totalComments = unifiedChartData.reduce((sum, d) => sum + d.comments, 0);
    
    const followersChange = ((lastData.followers - firstData.followers) / firstData.followers) * 100;
    const likesChange = 18.2; // Mock growth
    const commentsChange = 24.5; // Mock growth
    
    return {
      followers: { value: lastData.followers, change: followersChange },
      likes: { value: totalLikes, change: likesChange },
      comments: { value: totalComments, change: commentsChange },
    };
  }, []);

  const formatValue = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header with internal tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
        <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === "analytics"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
              activeTab === "map"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <Globe className="w-4 h-4" />
            Map
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {activeTab === "analytics" ? (
          <>
            {/* KPI Blocks - Embedded inside chart container */}
            <div className="flex flex-wrap gap-3 mb-6">
              <KPIBlock
                label="Followers"
                value={formatValue(totals.followers.value)}
                change={totals.followers.change}
                color="hsl(var(--accent))"
              />
              <KPIBlock
                label="Likes"
                value={formatValue(totals.likes.value)}
                change={totals.likes.change}
                color="hsl(220, 80%, 60%)"
              />
              <KPIBlock
                label="Comments"
                value={formatValue(totals.comments.value)}
                change={totals.comments.change}
                color="hsl(280, 70%, 60%)"
              />
              <div className="flex flex-col items-start gap-1 px-4 py-3 rounded-lg bg-card/40 backdrop-blur-sm border border-border/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Growth Rate
                </span>
                <span className="text-2xl font-bold text-foreground">
                  +{totals.followers.change.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">This period</span>
              </div>
            </div>

            {/* Unified Chart */}
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={unifiedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(220, 80%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(220, 80%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    opacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    yAxisId="followers"
                    orientation="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    dx={-10}
                  />
                  <YAxis
                    yAxisId="engagement"
                    orientation="right"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                    dx={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground capitalize">{value}</span>
                    )}
                  />
                  <Area
                    yAxisId="followers"
                    type="monotone"
                    dataKey="followers"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2.5}
                    fill="url(#colorFollowers)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(var(--accent))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                  <Area
                    yAxisId="engagement"
                    type="monotone"
                    dataKey="likes"
                    stroke="hsl(220, 80%, 60%)"
                    strokeWidth={2.5}
                    fill="url(#colorLikes)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(220, 80%, 60%)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                  <Area
                    yAxisId="engagement"
                    type="monotone"
                    dataKey="comments"
                    stroke="hsl(280, 70%, 60%)"
                    strokeWidth={2.5}
                    fill="url(#colorComments)"
                    dot={false}
                    activeDot={{ r: 5, fill: "hsl(280, 70%, 60%)", strokeWidth: 2, stroke: "hsl(var(--background))" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <GlobeMap />
        )}
      </div>
    </div>
  );
}
