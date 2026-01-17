import { useState, useMemo } from "react";
import { BarChart3, Globe, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeMap } from "./GlobeMap";
import { MetricWidget, type MetricType } from "./MetricWidget";
import { ReportingCurve, COLORS } from "./ReportingCurve";
import { ReportingChatbot } from "./ReportingChatbot";

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

export function UnifiedAnalyticsCard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "map">("analytics");
  const [activeMetric, setActiveMetric] = useState<MetricType>("all");

  const totals = useMemo(() => {
    const lastData = unifiedChartData[unifiedChartData.length - 1];
    const firstData = unifiedChartData[0];
    
    const totalLikes = unifiedChartData.reduce((sum, d) => sum + d.likes, 0);
    const totalComments = unifiedChartData.reduce((sum, d) => sum + d.comments, 0);
    
    const followersChange = ((lastData.followers - firstData.followers) / firstData.followers) * 100;
    const likesChange = 18.2;
    const commentsChange = 24.5;
    
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

  const handleMetricClick = (metric: MetricType) => {
    if (activeMetric === metric) {
      setActiveMetric("all");
    } else {
      setActiveMetric(metric);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left: Analytics Section */}
      <div className="flex-1 space-y-4">
        {/* Metric Widgets - Completely outside curve */}
        <div className="grid grid-cols-3 gap-3">
          <MetricWidget
            type="followers"
            label="Followers"
            value={formatValue(totals.followers.value)}
            change={totals.followers.change}
            color={COLORS.followers}
            isActive={activeMetric === "all" || activeMetric === "followers"}
            onClick={() => handleMetricClick("followers")}
          />
          <MetricWidget
            type="likes"
            label="Total Likes"
            value={formatValue(totals.likes.value)}
            change={totals.likes.change}
            color={COLORS.likes}
            isActive={activeMetric === "all" || activeMetric === "likes"}
            onClick={() => handleMetricClick("likes")}
          />
          <MetricWidget
            type="comments"
            label="Comments"
            value={formatValue(totals.comments.value)}
            change={totals.comments.change}
            color={COLORS.comments}
            isActive={activeMetric === "all" || activeMetric === "comments"}
            onClick={() => handleMetricClick("comments")}
          />
        </div>

        {/* Pure Curve Container */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {/* Header with internal tabs */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 relative z-20">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-foreground">Performance Trends</h2>
              {activeMetric !== "all" && (
                <button
                  onClick={() => setActiveMetric("all")}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-md transition-all duration-200"
                >
                  <RotateCcw className="w-3 h-3" />
                  Show all
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg">
              <button
                onClick={() => setActiveTab("analytics")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  activeTab === "analytics"
                    ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  activeTab === "map"
                    ? "bg-gradient-to-r from-metric-pink to-metric-orange text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                Map
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="p-5">
            {activeTab === "analytics" ? (
              <ReportingCurve data={unifiedChartData} activeMetric={activeMetric} />
            ) : (
              <GlobeMap />
            )}
          </div>
        </div>
      </div>

      {/* Thin vertical separator */}
      <div className="hidden lg:block w-px bg-border/50" />

      {/* Right: Floating Chatbot Panel */}
      <div className="w-full lg:w-[340px] xl:w-[380px]">
        <div className="bg-transparent rounded-2xl   overflow-hidden shadow-sm h-full sticky top-4">
          <ReportingChatbot />
        </div>
      </div>
    </div>
  );
}
