import { useQuery } from '@tanstack/react-query';
import {
  authService,
  dashboardService,
  mediaService,
  analyticsService,
  chartService,
  insightsService,
} from '@/lib/api/services';

// Query keys for cache management
export const queryKeys = {
  auth: {
    status: ['auth', 'status'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    profile: ['dashboard', 'profile'] as const,
    complete: ['dashboard', 'complete'] as const,
  },
  media: {
    all: ['media'] as const,
    byId: (id: string) => ['media', id] as const,
  },
  analytics: {
    engagement: ['analytics', 'engagement'] as const,
    content: ['analytics', 'content'] as const,
    posting: ['analytics', 'posting'] as const,
  },
  charts: {
    engagement: ['charts', 'engagement'] as const,
    breakdown: ['charts', 'breakdown'] as const,
    growth: ['charts', 'growth'] as const,
  },
  insights: {
    hashtags: ['insights', 'hashtags'] as const,
    predictions: ['insights', 'predictions'] as const,
    accountValue: ['insights', 'accountValue'] as const,
  },
} as const;

// ============ Auth Hooks ============
export function useAuthStatus() {
  return useQuery({
    queryKey: queryKeys.auth.status,
    queryFn: authService.getStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// ============ Dashboard Hooks ============
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.all,
    queryFn: dashboardService.getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.dashboard.profile,
    queryFn: dashboardService.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCompleteAnalytics() {
  return useQuery({
    queryKey: queryKeys.dashboard.complete,
    queryFn: dashboardService.getCompleteAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============ Media Hooks ============
export function useMedia(limit?: number) {
  return useQuery({
    queryKey: [...queryKeys.media.all, limit],
    queryFn: () => mediaService.getAllMedia(limit),
    staleTime: 2 * 60 * 1000,
  });
}

export function useMediaById(id: string) {
  return useQuery({
    queryKey: queryKeys.media.byId(id),
    queryFn: () => mediaService.getMediaById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Analytics Hooks ============
export function useEngagementTrends() {
  return useQuery({
    queryKey: queryKeys.analytics.engagement,
    queryFn: analyticsService.getEngagementTrends,
    staleTime: 5 * 60 * 1000,
  });
}

export function useContentPerformance() {
  return useQuery({
    queryKey: queryKeys.analytics.content,
    queryFn: analyticsService.getContentPerformance,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePostingPatterns() {
  return useQuery({
    queryKey: queryKeys.analytics.posting,
    queryFn: analyticsService.getPostingPatterns,
    staleTime: 5 * 60 * 1000,
  });
}

// ============ Chart Hooks ============
export function useEngagementChart() {
  return useQuery({
    queryKey: queryKeys.charts.engagement,
    queryFn: chartService.getEngagementChart,
    staleTime: 2 * 60 * 1000,
  });
}

export function useContentBreakdown() {
  return useQuery({
    queryKey: queryKeys.charts.breakdown,
    queryFn: chartService.getContentBreakdown,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGrowthSimulation() {
  return useQuery({
    queryKey: queryKeys.charts.growth,
    queryFn: chartService.getGrowthSimulation,
    staleTime: 10 * 60 * 1000,
  });
}

// ============ Insights Hooks ============
export function useHashtags() {
  return useQuery({
    queryKey: queryKeys.insights.hashtags,
    queryFn: insightsService.getHashtags,
    staleTime: 10 * 60 * 1000,
  });
}

export function usePredictions() {
  return useQuery({
    queryKey: queryKeys.insights.predictions,
    queryFn: insightsService.getPredictions,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useAccountValue() {
  return useQuery({
    queryKey: queryKeys.insights.accountValue,
    queryFn: insightsService.getAccountValue,
    staleTime: 30 * 60 * 1000,
  });
}
