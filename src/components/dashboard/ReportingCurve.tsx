import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { MetricType } from "./MetricWidget";

interface ChartDataPoint {
  date: string;
  followers: number;
  reach: number;
  dailyGain: number;
}

interface ReportingCurveProps {
  data: ChartDataPoint[];
  activeMetric: MetricType;
}

// Pink/Orange theme colors
export const COLORS = {
  followers: "hsl(340, 82%, 65%)",
  reach: "hsl(25, 95%, 60%)",
  dailyGain: "hsl(280, 60%, 70%)",
};

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

export function ReportingCurve({ data, activeMetric }: ReportingCurveProps) {
  const showFollowers = activeMetric === "all" || activeMetric === "followers";
  const showReach = activeMetric === "all" || activeMetric === "reach";
  const showDailyGain = activeMetric === "all" || activeMetric === "dailyGain";

  // Determine which Y-axis to use based on active metric
  const useFollowersAxis = showFollowers;
  const useSecondaryAxis = showReach || showDailyGain;

  return (
    <div className="h-[300px] transition-all duration-500 ease-out">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.followers} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.followers} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.reach} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.reach} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorDailyGain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.dailyGain} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.dailyGain} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            opacity={0.3}
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
          {useFollowersAxis && (
            <YAxis
              yAxisId="followers"
              orientation="left"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
              dx={-10}
            />
          )}
          {useSecondaryAxis && (
            <YAxis
              yAxisId="secondary"
              orientation={useFollowersAxis ? "right" : "left"}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value.toLocaleString()}
              dx={useFollowersAxis ? 10 : -10}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          
          {showFollowers && (
            <Area
              yAxisId="followers"
              type="monotone"
              dataKey="followers"
              stroke={COLORS.followers}
              strokeWidth={2.5}
              fill="url(#colorFollowers)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: COLORS.followers, 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))" 
              }}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
          {showReach && (
            <Area
              yAxisId="secondary"
              type="monotone"
              dataKey="reach"
              stroke={COLORS.reach}
              strokeWidth={2.5}
              fill="url(#colorReach)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: COLORS.reach, 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))" 
              }}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
          {showDailyGain && (
            <Area
              yAxisId="secondary"
              type="monotone"
              dataKey="dailyGain"
              stroke={COLORS.dailyGain}
              strokeWidth={2.5}
              fill="url(#colorDailyGain)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: COLORS.dailyGain, 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))" 
              }}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
