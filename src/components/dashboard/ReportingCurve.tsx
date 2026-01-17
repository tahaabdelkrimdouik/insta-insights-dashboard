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
  likes: number;
  comments: number;
}

interface ReportingCurveProps {
  data: ChartDataPoint[];
  activeMetric: MetricType;
}

// Pink/Orange theme colors
export const COLORS = {
  followers: "hsl(340, 82%, 65%)",
  likes: "hsl(25, 95%, 60%)",
  comments: "hsl(280, 60%, 70%)",
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
  const showLikes = activeMetric === "all" || activeMetric === "likes";
  const showComments = activeMetric === "all" || activeMetric === "comments";

  // Determine which Y-axis to use based on active metric
  const useFollowersAxis = showFollowers;
  const useEngagementAxis = showLikes || showComments;

  return (
    <div className="h-[300px] transition-all duration-500 ease-out">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.followers} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.followers} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.likes} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.likes} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.comments} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.comments} stopOpacity={0.05} />
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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              dx={-10}
            />
          )}
          {useEngagementAxis && (
            <YAxis
              yAxisId="engagement"
              orientation={useFollowersAxis ? "right" : "left"}
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
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
          {showLikes && (
            <Area
              yAxisId="engagement"
              type="monotone"
              dataKey="likes"
              stroke={COLORS.likes}
              strokeWidth={2.5}
              fill="url(#colorLikes)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: COLORS.likes, 
                strokeWidth: 2, 
                stroke: "hsl(var(--background))" 
              }}
              animationDuration={500}
              animationEasing="ease-out"
            />
          )}
          {showComments && (
            <Area
              yAxisId="engagement"
              type="monotone"
              dataKey="comments"
              stroke={COLORS.comments}
              strokeWidth={2.5}
              fill="url(#colorComments)"
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: COLORS.comments, 
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
