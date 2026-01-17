// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
}

// Profile types (for /stats/dashboard)
export interface ProfileData {
  id: string;
  username: string;
  name: string;
  biography?: string;
  profilePicture?: string;
  accountType: string;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
}

// Profile with engagement (for /stats/profile - flat structure)
export interface ProfileWithEngagement {
  id: string;
  username: string;
  name: string;
  biography?: string;
  profilePicture?: string;
  website?: string;
  accountType: string;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgEngagementPerPost: number;
  postsAnalyzed: number;
}

// Media/Post types
export interface MediaPost {
  id: string;
  type: string;
  mediaUrl?: string;
  thumbnail?: string;
  permalink?: string;
  caption?: string;
  date: string;
  dateFormatted?: string;
  likes: number;
  comments: number;
  engagement: number;
}

// Dashboard types
export interface DashboardData {
  profile: ProfileData;
  engagement: {
    rate: number;
    totalLikes: number;
    totalComments: number;
    totalEngagement: number;
    avgPerPost: number;
    postsAnalyzed: number;
  };
  content: {
    breakdown: {
      IMAGE: number;
      VIDEO: number;
      CAROUSEL_ALBUM: number;
    };
    totalPosts: number;
    postingFrequency: string;
  };
  topPosts: MediaPost[];
}

// Chart data types
export interface EngagementChartPoint {
  date: string;
  fullDate: string;
  likes: number;
  comments: number;
  engagement: number;
}

// Followers growth chart point
export interface FollowersGrowthPoint {
  date: string;
  fullDate: string;
  followers_gained: number;
  total_followers: number;
  reach: number;
  profile_views: number;
}

// API response format for followers growth chart
export interface FollowersGrowthResponse {
  data: {
    raw: FollowersGrowthPoint[];
  };
}

// API response format for engagement chart
export interface EngagementChartResponse {
  labels: string[];
  datasets: {
    likes: number[];
    comments: number[];
    engagement: number[];
  };
  raw: EngagementChartPoint[];
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
