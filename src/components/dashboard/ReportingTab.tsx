import { topPosts as mockTopPosts } from "@/lib/mockData";
import { UnifiedAnalyticsCard } from "./UnifiedAnalyticsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMedia } from "@/hooks/useInstagramApi";
import { useMemo } from "react";

export function ReportingTab() {
  const { data: mediaData, isLoading, error } = useMedia(10);

  // Transform API media to topPosts format, or use mock data
  const topPosts = useMemo(() => {
    if (mediaData && mediaData.length > 0) {
      return mediaData
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 4)
        .map((post, index) => ({
          id: index + 1,
          image: post.thumbnail || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop`,
          likes: post.likes || 0,
          comments: post.comments || 0,
          reach: post.engagement || 0,
          date: post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown',
        }));
    }
    return mockTopPosts;
  }, [mediaData]);

  if (error) {
    console.warn("Failed to fetch media, using mock data:", error);
  }

  return (
    <div className="space-y-6 slide-up">
      {/* Header with friendly title - centered */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back to your reporting space 👋
        </h2>
        <p className="text-muted-foreground mt-1">Your Instagram insights, simplified</p>
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
              {isLoading ? (
                // Loading skeleton for table rows
                [...Array(4)].map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-6 h-4" />
                        <Skeleton className="w-12 h-12 rounded-lg" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-8 ml-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : (
                topPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <img
                          src={post.image}
                          alt="Post thumbnail"
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{post.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{post.likes.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{post.comments}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground text-right">{(post.reach / 1000).toFixed(1)}K</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
