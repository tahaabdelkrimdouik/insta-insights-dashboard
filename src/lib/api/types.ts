// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
}

// Profile types
export interface ProfileData {
  username: string;
  followers: number;
  following: number;
  posts: number;
  accountType: string;
  profilePicture?: string;
  bio?: string;
  isConnected?: boolean;
}

export interface ProfileWithEngagement extends ProfileData {
  engagementRate: string;
  totalLikes: number;
  totalComments: number;
  avgPerPost: number;
}

// Media/Post types
export interface MediaPost {
  id: string;
  type: string;
  caption?: string;
  likes: number;
  comments: number;
  engagement: number;
  timestamp: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  permalink?: string;
}

// Dashboard types
export interface DashboardData {
  profile: ProfileData;
  stats: {
    totalLikes: number;
    totalComments: number;
    avgPerPost: number;
    engagementRate: string;
  };
  topPosts: MediaPost[];
  recentPosts: MediaPost[];
}

// Chart data types
export interface EngagementChartPoint {
  date: string;
  likes: number;
  comments: number;
  engagement: number;
}

export interface ContentBreakdown {
  type: string;
  count: number;
  percentage: number;
  avgEngagement: number;
}

export interface GrowthSimulation {
  current: number;
  projected: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  growthRate: number;
}

// Analytics types
export interface EngagementTrends {
  daily: EngagementChartPoint[];
  weekly: EngagementChartPoint[];
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ContentPerformance {
  byType: ContentBreakdown[];
  bestPerformingType: string;
  worstPerformingType: string;
}

export interface PostingPatterns {
  bestDays: { day: string; avgEngagement: number }[];
  bestHours: { hour: number; avgEngagement: number }[];
  recommendation: string;
}

// Hashtag analysis
export interface HashtagPerformance {
  hashtag: string;
  usage: number;
  avgEngagement: number;
  reach?: number;
}

// Predictions
export interface GrowthPredictions {
  followerGrowth: {
    current: number;
    predicted: number;
    timeframe: string;
    confidence: number;
  };
  engagementForecast: {
    current: number;
    predicted: number;
    trend: string;
  };
  recommendations: string[];
}

// Account value / Monetization
export interface AccountValue {
  tier: string;
  perPost: string;
  perReel: string;
  monthlyPotential: string;
  yearlyPotential: string;
  factors: {
    followers: number;
    engagementRate: string;
    niche?: string;
  };
}

// Complete analytics
export interface CompleteAnalytics {
  profile: ProfileWithEngagement;
  dashboard: DashboardData;
  engagement: EngagementTrends;
  content: ContentPerformance;
  posting: PostingPatterns;
  hashtags: HashtagPerformance[];
  predictions: GrowthPredictions;
  accountValue: AccountValue;
}

// Auth types
export interface AuthStatus {
  authenticated: boolean;
  username?: string;
  tokenExpiry?: string;
}
