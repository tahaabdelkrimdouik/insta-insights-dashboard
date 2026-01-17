import { apiClient, llmClient } from './client';
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
  FollowersGrowthPoint,
  FollowersGrowthResponse,
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
  getAllMedia: async (limit?: number): Promise<MediaPost[]> => {
    const response = await apiClient.get<{ posts: MediaPost[] }>(
      API_ENDPOINTS.stats.media, 
      limit ? { limit: limit.toString() } : undefined
    );
    return response.posts || [];
  },
  
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
  getEngagementChart: async (days?: number): Promise<EngagementChartPoint[]> => {
    const response = await apiClient.get<EngagementChartResponse>(API_ENDPOINTS.charts.engagement);
    let data = response.raw || [];
    
    if (days && data.length > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      data = data.filter(point => new Date(point.fullDate) >= cutoffDate);
    }
    
    return data;
  },

  getFollowersGrowth: async (days?: number): Promise<FollowersGrowthPoint[]> => {
    const response = await apiClient.get<FollowersGrowthResponse>(API_ENDPOINTS.charts.followersGrowth);
    let data = response.data?.raw || [];
    
    if (days && data.length > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      data = data.filter(point => new Date(point.fullDate) >= cutoffDate);
    }
    
    return data;
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

// ============ Chat Services ============
export interface ChatRequest {
  question: string;
  mode?: 'content_analyst' | 'growth_strategist' | 'engagement_expert';
  max_tokens?: number;
  temperature?: number;
  n_posts?: number;
}

export interface ChatResponse {
  response: string;
  mode: string;
  mode_description: string;
  question: string;
  relevant_posts_count: number;
}

// Mock responses for demo/fallback
const mockResponses: Record<string, string> = {
  default: `## 📊 Performance Analysis

Based on your recent content, here are the key insights:

### 🏆 Top Performers
Your **chess-related Reels** are generating exceptional engagement! The humorous content with relatable situations resonates strongly with your audience.

### 📈 Key Metrics
- **Average engagement rate**: 188.3%
- **Best performing format**: Short-form video (Reels)
- **Peak posting time**: Evening hours (6-9 PM)

### 💡 Recommendations
1. **Continue the chess + humor formula** - it's working exceptionally well
2. **Post more consistently** - aim for 2-3 Reels per week
3. **Engage with comments** within the first hour of posting

### 🎯 Growth Opportunities
- Collaborate with other chess content creators
- Create tutorial content mixed with entertainment
- Use trending audio to boost discoverability`,
  
  posts: `## 🏆 Your Top Performing Posts

### #1 - Chess Humor Reel (Aug 4)
- **575K likes** | 5K comments
- Engagement rate: **3,797%** 🔥
- This viral hit shows the power of humor + niche content

### #2 - Chess Misunderstanding (Nov 18)
- **255K likes** | 580 comments
- Caption humor drove massive shares

### #3 - Meeting the Chess GOAT (Oct 18)
- **31K likes** | 255 comments
- Behind-the-scenes content performs well

### 📌 Pattern: Humorous, authentic content with chess themes consistently outperforms other formats.`,

  audience: `## 👥 Audience Insights

### Demographics
- **Primary audience**: 18-34 years old
- **Top locations**: France (87%), Belgium, Switzerland
- **Gender split**: 65% female, 35% male

### Behavior Patterns
- Most active: **Tuesday-Thursday evenings**
- Preferred content: Short, entertaining Reels
- High save rate on educational content

### What They Love
✅ Humor and authenticity
✅ Chess content with personality
✅ Behind-the-scenes moments

### What Works Less
❌ Overly promotional content
❌ Long-form vlogs
❌ Sponsored posts without entertainment value`,
};

const getMockResponse = (question: string): string => {
  const q = question.toLowerCase();
  if (q.includes('post') || q.includes('perform') || q.includes('meilleur')) {
    return mockResponses.posts;
  }
  if (q.includes('audience') || q.includes('follower') || q.includes('abonné')) {
    return mockResponses.audience;
  }
  return mockResponses.default;
};

export const chatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const payload = {
      question: request.question,
      mode: request.mode || 'content_analyst',
      max_tokens: request.max_tokens || 1000,
      temperature: request.temperature || 0.5,
      n_posts: request.n_posts || 3,
    };
    
    try {
      return await llmClient.postRaw<ChatResponse>(API_ENDPOINTS.chat, payload);
    } catch (error) {
      // Fallback to mock data if API is unavailable
      console.log('LLM API unavailable, using mock response');
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
      return {
        response: getMockResponse(request.question),
        mode: payload.mode,
        mode_description: '📊 Analyse de Performance - Évalue vos posts et identifie ce qui fonctionne',
        question: request.question,
        relevant_posts_count: 3,
      };
    }
  },
};
