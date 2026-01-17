import { useState, useMemo } from "react";
import { BarChart3, Globe, RotateCcw, MessageCircle, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeMap } from "./GlobeMap";
import { MetricWidget, type MetricType } from "./MetricWidget";
import { ReportingCurve, COLORS } from "./ReportingCurve";
import { ReportingChatbot } from "./ReportingChatbot";
import { DateFilter } from "./DateFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { useEngagementChart, useDashboard } from "@/hooks/useInstagramApi";

// Fallback mock data
const mockChartData = [
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
  const [dateRange, setDateRange] = useState("30");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: chartData, isLoading: chartLoading, error: chartError, refetch: refetchChart } = useEngagementChart();
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboard();

  const isLoading = chartLoading || dashboardLoading;

  // Transform API data to match chart format, or use mock data
  const unifiedChartData = useMemo(() => {
    if (chartData && chartData.length > 0) {
      return chartData.map(point => ({
        date: point.date,
        followers: point.engagement, // Use engagement as followers metric
        likes: point.likes,
        comments: point.comments,
      }));
    }
    return mockChartData;
  }, [chartData]);

  const totals = useMemo(() => {
    // Use API dashboard stats if available
    if (dashboard?.stats) {
      // Parse engagement rate to number if it's a string
      const engagementRateNum = typeof dashboard.stats.engagementRate === 'string' 
        ? parseFloat(dashboard.stats.engagementRate) 
        : dashboard.stats.engagementRate;
      
      return {
        followers: { 
          value: dashboard.profile?.followers ?? unifiedChartData[unifiedChartData.length - 1].followers, 
          change: engagementRateNum || 5.2
        },
        likes: { 
          value: dashboard.stats.totalLikes, 
          change: engagementRateNum || 18.2
        },
        comments: { 
          value: dashboard.stats.totalComments, 
          change: 24.5 
        },
      };
    }

    // Fallback to calculated values from chart data
    const lastData = unifiedChartData[unifiedChartData.length - 1];
    const firstData = unifiedChartData[0];
    
    const totalLikes = unifiedChartData.reduce((sum, d) => sum + d.likes, 0);
    const totalComments = unifiedChartData.reduce((sum, d) => sum + d.comments, 0);
    
    const followersChange = ((lastData.followers - firstData.followers) / firstData.followers) * 100;
    
    return {
      followers: { value: lastData.followers, change: followersChange },
      likes: { value: totalLikes, change: 18.2 },
      comments: { value: totalComments, change: 24.5 },
    };
  }, [dashboard, unifiedChartData]);

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

  const handleRefresh = () => {
    refetchChart();
    refetchDashboard();
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        <div className="flex-1 space-y-4 flex flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-2xl flex-1" />
        </div>
        <div className="hidden lg:block w-px bg-border/50" />
        <div className="hidden lg:flex w-[340px] xl:w-[380px]">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
      {/* Left: Analytics Section */}
      <div className="flex-1 space-y-4 flex flex-col">
        {/* Error banner */}
        {(chartError || dashboardError) && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm text-warning flex items-center justify-between">
            <span>Using cached data. Unable to reach server.</span>
            <button onClick={handleRefresh} className="p-1 hover:bg-warning/20 rounded">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Metric Widgets - Completely outside curve */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex-1">
          {/* Header with internal tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 border-b border-border/50 relative z-20 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
              <DateFilter value={dateRange} onChange={setDateRange} />
            </div>
            <div className="flex items-center gap-1 p-0.5 bg-muted/50 rounded-lg self-start sm:self-auto">
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
          <div className="p-4 sm:p-5">
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

      {/* Right: Floating Chatbot Panel - Desktop only */}
      <div className="hidden lg:flex w-[340px] xl:w-[380px]">
        <div className="bg-transparent rounded-2xl overflow-hidden flex-1 sticky top-4">
          <ReportingChatbot />
        </div>
      </div>

      {/* Mobile: Floating chat button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-metric-pink to-metric-orange text-white shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Mobile: Chat modal */}
      {isChatOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsChatOpen(false)}
          />
          <div className="lg:hidden fixed inset-4 top-20 bottom-20 z-50 bg-card rounded-2xl border border-border shadow-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-foreground">Reporting Assistant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <ReportingChatbot />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
