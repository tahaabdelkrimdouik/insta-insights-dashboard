import { useState } from "react";
import { Users, TrendingUp, Eye, BarChart3 } from "lucide-react";
import { statsOverview } from "@/lib/mockData";
import { StatCard } from "./StatCard";
import { DateFilter } from "./DateFilter";
import { FollowerChart } from "./FollowerChart";
import { EngagementChart } from "./EngagementChart";
import { TopPosts } from "./TopPosts";

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Followers"
          value={statsOverview.followers.current}
          change={statsOverview.followers.change}
          changePercent={statsOverview.followers.changePercent}
          trend={statsOverview.followers.trend}
          icon={Users}
          iconClassName="gradient-instagram"
        />
        <StatCard
          title="Engagement Rate"
          value={statsOverview.engagement.current}
          change={statsOverview.engagement.change}
          changePercent={statsOverview.engagement.changePercent}
          trend={statsOverview.engagement.trend}
          icon={TrendingUp}
          suffix="%"
        />
        <StatCard
          title="Reach"
          value={`${(statsOverview.reach.current / 1000).toFixed(1)}K`}
          change={statsOverview.reach.change}
          changePercent={statsOverview.reach.changePercent}
          trend={statsOverview.reach.trend}
          icon={Eye}
        />
        <StatCard
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

      {/* Top Posts */}
      <TopPosts />
    </div>
  );
}
