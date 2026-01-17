// API Configuration
// Update this to your Express backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://tyrannisingly-dendritic-nayeli.ngrok-free.dev';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login',
    callback: '/auth/callback',
    status: '/auth/status',
    refresh: '/auth/refresh',
  },
  // Stats & Dashboard
  stats: {
    dashboard: '/stats/dashboard',
    profile: '/stats/profile',
    complete: '/stats/complete',
    media: '/stats/media',
    mediaById: (id: string) => `/stats/media/${id}`,
  },
  // Analytics & Charts
  analytics: {
    engagementTrends: '/stats/engagement-trends',
    contentPerformance: '/stats/content-performance',
    postingPatterns: '/stats/posting-patterns',
  },
  charts: {
    engagement: '/stats/charts/engagement',
    contentBreakdown: '/stats/charts/content-breakdown',
    growthSimulation: '/stats/charts/growth-simulation',
  },
  // Insights
  insights: {
    hashtags: '/stats/hashtags',
    predictions: '/stats/predictions',
    accountValue: '/stats/account-value',
  },
} as const;
