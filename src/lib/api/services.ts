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
export type ChatMode = 'content_analyst' | 'monetization' | 'strategy' | 'audience';

export interface ChatRequest {
  question: string;
  mode?: ChatMode;
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

export interface StatsResponse {
  username: string;
  followers: number;
  avg_engagement_rate: number;
  niche: string;
  total_posts_indexed: number;
}

export interface ModeInfo {
  mode: string;
  description: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  agent_initialized: boolean;
  message: string;
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

  monetization: `## 💰 Monetization Strategies

### Your Current Value
Based on your profile with ~15K followers and high engagement:
- **Estimated post value**: €150-300 per sponsored post
- **Reel value**: €200-400 per sponsored Reel
- **Monthly potential**: €800-1,500

### Recommendations
1. **Brand Collaborations**: Chess apps, learning platforms, lifestyle brands
2. **Affiliate Marketing**: Chess equipment, courses, apps
3. **Digital Products**: Create your own chess tutorials or ebooks

### Next Steps
- Build a media kit highlighting your engagement rates
- Reach out to 5 chess-related brands this week
- Set up Instagram Shopping for merchandise`,

  strategy: `## 🎯 Growth Strategy

### Current Status
You're in a strong position with excellent engagement rates on chess content.

### 30-Day Action Plan
**Week 1-2**: Content Foundation
- Post 3 Reels per week (chess humor format)
- Respond to all comments within 1 hour
- Use 5-7 targeted hashtags

**Week 3-4**: Expansion
- Collaborate with 2 chess creators
- Go live once per week
- Test carousel posts for educational content

### Growth Targets
- **Followers**: +500-800 in 30 days
- **Engagement**: Maintain 180%+ rate
- **Reach**: Increase by 40%`,
};

const getMockResponse = (question: string, mode: ChatMode): string => {
  const q = question.toLowerCase();
  
  // Mode-based responses first
  if (mode === 'monetization') {
    return mockResponses.monetization;
  }
  if (mode === 'strategy') {
    return mockResponses.strategy;
  }
  if (mode === 'audience') {
    return mockResponses.audience;
  }
  
  // Keyword-based for content_analyst
  if (q.includes('post') || q.includes('perform') || q.includes('meilleur') || q.includes('top')) {
    return mockResponses.posts;
  }
  if (q.includes('audience') || q.includes('follower') || q.includes('abonné')) {
    return mockResponses.audience;
  }
  if (q.includes('money') || q.includes('monetiz') || q.includes('argent') || q.includes('gagner')) {
    return mockResponses.monetization;
  }
  if (q.includes('strateg') || q.includes('grow') || q.includes('croissance')) {
    return mockResponses.strategy;
  }
  
  return mockResponses.default;
};

const getModeDescription = (mode: ChatMode): string => {
  const descriptions: Record<ChatMode, string> = {
    content_analyst: 'Analyzes post performance and engagement metrics',
    monetization: 'Provides monetization strategies and earning potential',
    strategy: 'Develops growth strategies and action plans',
    audience: 'Analyzes audience demographics and behavior',
  };
  return descriptions[mode];
};

export const chatService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const mode = request.mode || 'content_analyst';
    const payload = {
      question: request.question,
      mode,
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
        response: getMockResponse(request.question, mode),
        mode: mode,
        mode_description: getModeDescription(mode),
        question: request.question,
        relevant_posts_count: payload.n_posts,
      };
    }
  },

  getModes: async (): Promise<ModeInfo[]> => {
    try {
      return await llmClient.postRaw<ModeInfo[]>('/api/modes', {});
    } catch {
      return [
        { mode: 'content_analyst', description: 'Analyzes post performance and engagement metrics' },
        { mode: 'monetization', description: 'Provides monetization strategies' },
        { mode: 'strategy', description: 'Develops growth strategies' },
        { mode: 'audience', description: 'Analyzes audience demographics' },
      ];
    }
  },

  getStats: async (): Promise<StatsResponse> => {
    try {
      return await llmClient.postRaw<StatsResponse>('/api/stats', {});
    } catch {
      return {
        username: 'instametrics_user',
        followers: 15234,
        avg_engagement_rate: 4.2,
        niche: 'Entertainment/Chess',
        total_posts_indexed: 25,
      };
    }
  },

  getHealth: async (): Promise<HealthResponse> => {
    try {
      return await llmClient.postRaw<HealthResponse>('/health', {});
    } catch {
      return {
        status: 'degraded',
        agent_initialized: false,
        message: 'Using mock data - LLM API unavailable',
      };
    }
  },
};
