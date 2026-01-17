import { useState } from "react";
import { topPosts } from "@/lib/mockData";
import { DateFilter } from "./DateFilter";
import { UnifiedAnalyticsCard } from "./UnifiedAnalyticsCard";

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

      {/* Unified Analytics Card - Datafast-inspired */}
      <UnifiedAnalyticsCard />

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
                        alt="Post thumbnail"
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
