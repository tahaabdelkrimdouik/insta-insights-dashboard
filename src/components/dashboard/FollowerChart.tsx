import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { followerGrowthData } from "@/lib/mockData";

export function FollowerChart() {
  return (
    <div className="stat-card fade-in">
      <h3 className="text-lg font-semibold text-foreground mb-4">Follower Growth</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={followerGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: number) => [value.toLocaleString(), "Followers"]}
            />
            <defs>
              <linearGradient id="followerGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--instagram-orange))" />
                <stop offset="50%" stopColor="hsl(var(--instagram-pink))" />
                <stop offset="100%" stopColor="hsl(var(--instagram-purple))" />
              </linearGradient>
            </defs>
            <Line
              type="monotone"
              dataKey="followers"
              stroke="url(#followerGradient)"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
