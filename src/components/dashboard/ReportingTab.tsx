import { useState } from "react";
import { Users, TrendingUp, Eye, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { statsOverview, topPosts } from "@/lib/mockData";
import { DateFilter } from "./DateFilter";
import { FollowerChart } from "./FollowerChart";
import { EngagementChart } from "./EngagementChart";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  changePercent: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

function KPICard({ title, value, change, changePercent, trend, icon: Icon }: KPICardProps) {
  return (
    <div className="kpi-card fade-in">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="h-4 w-4 text-accent" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <div className="flex items-center gap-1">
          {trend === "up" ? (
            <ArrowUpRight className="h-4 w-4 text-success" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          )}
          <span
            className={cn(
              "text-sm font-medium",
              trend === "up" ? "text-success" : "text-destructive"
            )}
          >
            {trend === "up" ? "+" : ""}
            {changePercent.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground">vs last period</span>
        </div>
      </div>
    </div>
  );
}

export function ReportingTab() {
  const [dateRange, setDateRange] = useState("30");

  return (
    <div className="space-y-6 slide-up">
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Overview</h2>
          <p className="text-muted-foreground">Track your Instagram performance</p>
        </div>
        <DateFilter value={dateRange} onChange={setDateRange} />
      </div>

      {/* KPI Grid - Datafast-inspired with big numbers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Followers"
          value={statsOverview.followers.current}
          change={statsOverview.followers.change}
          changePercent={statsOverview.followers.changePercent}
          trend={statsOverview.followers.trend}
          icon={Users}
        />
        <KPICard
          title="Engagement Rate"
          value={`${statsOverview.engagement.current}%`}
          change={statsOverview.engagement.change}
          changePercent={statsOverview.engagement.changePercent}
          trend={statsOverview.engagement.trend}
          icon={TrendingUp}
        />
        <KPICard
          title="Reach"
          value={`${(statsOverview.reach.current / 1000).toFixed(1)}K`}
          change={statsOverview.reach.change}
          changePercent={Math.abs(statsOverview.reach.changePercent)}
          trend={statsOverview.reach.trend}
          icon={Eye}
        />
        <KPICard
          title="Impressions"
          value={`${(statsOverview.impressions.current / 1000).toFixed(0)}K`}
          change={statsOverview.impressions.change}
          changePercent={statsOverview.impressions.changePercent}
          trend={statsOverview.impressions.trend}
          icon={BarChart3}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FollowerChart />
        <EngagementChart />
      </div>

      {/* Top Posts Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Top Performing Posts</h3>
          <p className="text-sm text-muted-foreground">Your best content this period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Post</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Likes</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Comments</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Reach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topPosts.map((post, index) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{post.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{post.likes.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{post.comments}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{(post.reach / 1000).toFixed(1)}K</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
