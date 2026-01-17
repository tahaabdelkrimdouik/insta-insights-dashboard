import { useState, useMemo } from "react";
import { BarChart3, Globe, MessageCircle, X, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobeMap } from "./GlobeMap";
import { MetricWidget } from "./MetricWidget";
import { ReportingCurve, COLORS } from "./ReportingCurve";
import { ReportingChatbot } from "./ReportingChatbot";
import { DateFilter } from "./DateFilter";
import { Skeleton } from "@/components/ui/skeleton";
import { useFollowersGrowth, useDashboard } from "@/hooks/useInstagramApi";

// Fallback mock data for chart (followers only)
const mockChartData = [
  { date: "Jan 1", followers: 42000 },
  { date: "Jan 5", followers: 42450 },
  { date: "Jan 10", followers: 43100 },
  { date: "Jan 15", followers: 43800 },
  { date: "Jan 20", followers: 44200 },
  { date: "Jan 25", followers: 44890 },
  { date: "Jan 30", followers: 45892 },
];

export function UnifiedAnalyticsCard() {
  const [activeTab, setActiveTab] = useState<"analytics" | "map">("analytics");
  const [dateRange, setDateRange] = useState("30");
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: followersData, isLoading: followersLoading, error: followersError, refetch: refetchFollowers } = useFollowersGrowth(Number(dateRange));
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboard();

  const isLoading = followersLoading || dashboardLoading;
  const hasError = followersError || dashboardError;

  // Transform followers data for chart (only followers)
  const chartData = useMemo(() => {
    if (followersData && followersData.length > 0) {
      return followersData.map(point => ({
        date: point.date,
        followers: point.total_followers,
      }));
    }
    
    return mockChartData;
  }, [followersData]);

  // Stats from dashboard API (likes, comments) and followers data
  const totals = useMemo(() => {
    const lastFollowers = followersData?.[followersData.length - 1]?.total_followers || 
                         dashboard?.profile?.stats?.followers || 
                         chartData[chartData.length - 1].followers;
    
    const firstFollowers = followersData?.[0]?.total_followers || lastFollowers;
    const followersChange = firstFollowers > 0 
      ? ((lastFollowers - firstFollowers) / firstFollowers) * 100 
      : 0;
    
    return {
      followers: { value: lastFollowers, change: followersChange },
      likes: { 
        value: dashboard?.engagement?.totalLikes || 0, 
        change: 18.2 
      },
      comments: { 
        value: dashboard?.engagement?.totalComments || 0, 
        change: 24.5 
      },
    };
  }, [dashboard, chartData, followersData]);

  const formatValue = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  const handleRefresh = () => {
    refetchFollowers();
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
        {hasError && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-sm text-warning flex items-center justify-between">
            <span>Using cached data. Unable to reach server.</span>
            <button onClick={handleRefresh} className="p-1 hover:bg-warning/20 rounded">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Metric Widgets - Stats display only */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricWidget
            type="followers"
            label="Followers"
            value={formatValue(totals.followers.value)}
            change={totals.followers.change}
            color={COLORS.followers}
            isActive={true}
            onClick={() => {}}
          />
          <MetricWidget
            type="likes"
            label="Total Likes"
            value={formatValue(totals.likes.value)}
            change={totals.likes.change}
            color={COLORS.likes}
            isActive={true}
            onClick={() => {}}
          />
          <MetricWidget
            type="comments"
            label="Comments"
            value={formatValue(totals.comments.value)}
            change={totals.comments.change}
            color={COLORS.comments}
            isActive={true}
            onClick={() => {}}
          />
        </div>

        {/* Pure Curve Container */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex-1">
          {/* Header with internal tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3 border-b border-border/50 relative z-20 gap-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h2 className="text-sm font-semibold text-foreground">Followers Growth</h2>
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
              <ReportingCurve data={chartData} />
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
