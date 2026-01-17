import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  AuthStatus,
  DashboardData,
  ProfileWithEngagement,
  CompleteAnalytics,
  MediaPost,
  EngagementTrends,
  ContentPerformance,
  PostingPatterns,
  EngagementChartPoint,
  EngagementChartResponse,
  ContentBreakdown,
  GrowthSimulation,
  HashtagPerformance,
  GrowthPredictions,
  AccountValue,
} from './types';

// ============ Auth Services ============
export const authService = {
  getStatus: () => 
    apiClient.get<AuthStatus>(API_ENDPOINTS.auth.status),
  
  refreshToken: () => 
    apiClient.post<{ success: boolean }>(API_ENDPOINTS.auth.refresh),
  
  getLoginUrl: () => 
    `${API_ENDPOINTS.auth.login}`,
};

// ============ Dashboard & Profile Services ============
export const dashboardService = {
  getDashboard: () => 
    apiClient.get<DashboardData>(API_ENDPOINTS.stats.dashboard),
  
  getProfile: () => 
    apiClient.get<ProfileWithEngagement>(API_ENDPOINTS.stats.profile),
  
  getCompleteAnalytics: () => 
    apiClient.get<CompleteAnalytics>(API_ENDPOINTS.stats.complete),
};

// ============ Media Services ============
export const mediaService = {
  getAllMedia: (limit?: number) => 
    apiClient.get<MediaPost[]>(
      API_ENDPOINTS.stats.media, 
      limit ? { limit: limit.toString() } : undefined
    ),
  
  getMediaById: (id: string) => 
    apiClient.get<MediaPost>(API_ENDPOINTS.stats.mediaById(id)),
};

// ============ Analytics Services ============
export const analyticsService = {
  getEngagementTrends: () => 
    apiClient.get<EngagementTrends>(API_ENDPOINTS.analytics.engagementTrends),
  
  getContentPerformance: () => 
    apiClient.get<ContentPerformance>(API_ENDPOINTS.analytics.contentPerformance),
  
  getPostingPatterns: () => 
    apiClient.get<PostingPatterns>(API_ENDPOINTS.analytics.postingPatterns),
};

// ============ Chart Services ============
export const chartService = {
  getEngagementChart: async (): Promise<EngagementChartPoint[]> => {
    const response = await apiClient.get<EngagementChartResponse>(API_ENDPOINTS.charts.engagement);
    // Extract raw data array from the API response
    return response.raw || [];
  },
  
  getContentBreakdown: () => 
    apiClient.get<ContentBreakdown[]>(API_ENDPOINTS.charts.contentBreakdown),
  
  getGrowthSimulation: () => 
    apiClient.get<GrowthSimulation>(API_ENDPOINTS.charts.growthSimulation),
};

// ============ Insights Services ============
export const insightsService = {
  getHashtags: () => 
    apiClient.get<HashtagPerformance[]>(API_ENDPOINTS.insights.hashtags),
  
  getPredictions: () => 
    apiClient.get<GrowthPredictions>(API_ENDPOINTS.insights.predictions),
  
  getAccountValue: () => 
    apiClient.get<AccountValue>(API_ENDPOINTS.insights.accountValue),
};
