import { useState } from "react";
import { RefreshCw, Heart, MessageCircle, Share2, Bookmark, TrendingUp, TrendingDown, Sparkles, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileData, activityFeed, alerts, latestPosts } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function MonitoringTab() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followerCount, setFollowerCount] = useState(profileData.followers);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate live update
    setTimeout(() => {
      setFollowerCount((prev) => prev + Math.floor(Math.random() * 5) - 1);
      setIsRefreshing(false);
    }, 1000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "spike":
        return <Sparkles className="h-5 w-5 text-success" />;
      case "milestone":
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-destructive" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-primary" />;
      case "follow":
        return <Users className="h-4 w-4 text-success" />;
      default:
        return <Heart className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 slide-up">
      {/* Header with refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Live Monitoring</h2>
          <p className="text-muted-foreground">Real-time activity tracking</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gradient-instagram text-primary-foreground hover:opacity-90"
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Live Follower Count */}
      <div className="stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Live Follower Count</p>
            <p className="text-4xl font-bold gradient-instagram-text">
              {followerCount.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-live h-3 w-3 rounded-full bg-success"></span>
            <span className="text-sm text-success font-medium">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Posts Performance */}
        <div className="lg:col-span-2 stat-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Latest Posts Performance</h3>
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <img
                  src={post.image}
                  alt="Post"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">{post.saves}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {post.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="stat-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-3 rounded-xl border",
                  alert.type === "spike" && "bg-success/10 border-success/20",
                  alert.type === "milestone" && "bg-primary/10 border-primary/20",
                  alert.type === "warning" && "bg-warning/10 border-warning/20"
                )}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="stat-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Activity Feed</h3>
        <div className="space-y-3">
          {activityFeed.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
            >
              <img
                src={activity.avatar}
                alt={activity.user}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
              </div>
              {getActivityIcon(activity.type)}
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
