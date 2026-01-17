// Mock data for Instagram Analytics Dashboard

export const profileData = {
  username: "creative_studio",
  displayName: "Creative Studio",
  bio: "✨ Digital Content Creator | Photography | Design\n🌍 Paris, France\n📧 hello@creativestudio.com",
  profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  followers: 45892,
  following: 1247,
  posts: 342,
  isConnected: true,
  verifiedBadge: true,
};

export const statsOverview = {
  followers: {
    current: 45892,
    change: 1234,
    changePercent: 2.76,
    trend: "up" as const,
  },
  engagement: {
    current: 4.8,
    change: 0.3,
    changePercent: 6.67,
    trend: "up" as const,
  },
  reach: {
    current: 128500,
    change: -5200,
    changePercent: -3.89,
    trend: "down" as const,
  },
  impressions: {
    current: 245000,
    change: 12000,
    changePercent: 5.15,
    trend: "up" as const,
  },
};

export const followerGrowthData = [
  { date: "Jan 1", followers: 42000 },
  { date: "Jan 5", followers: 42450 },
  { date: "Jan 10", followers: 43100 },
  { date: "Jan 15", followers: 43800 },
  { date: "Jan 20", followers: 44200 },
  { date: "Jan 25", followers: 44890 },
  { date: "Jan 30", followers: 45892 },
];

export const engagementData = [
  { day: "Mon", likes: 2400, comments: 180 },
  { day: "Tue", likes: 1800, comments: 120 },
  { day: "Wed", likes: 3200, comments: 280 },
  { day: "Thu", likes: 2800, comments: 220 },
  { day: "Fri", likes: 4100, comments: 380 },
  { day: "Sat", likes: 3600, comments: 320 },
  { day: "Sun", likes: 2900, comments: 240 },
];

export const topPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    likes: 4521,
    comments: 234,
    reach: 32400,
    date: "Jan 28, 2024",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop",
    likes: 3892,
    comments: 187,
    reach: 28900,
    date: "Jan 25, 2024",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=300&fit=crop",
    likes: 3456,
    comments: 156,
    reach: 25600,
    date: "Jan 22, 2024",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=300&fit=crop",
    likes: 3201,
    comments: 142,
    reach: 24100,
    date: "Jan 20, 2024",
  },
];

export const activityFeed = [
  {
    id: 1,
    type: "like" as const,
    user: "john_doe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    action: "liked your post",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "comment" as const,
    user: "sarah_design",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    action: "commented: \"Amazing shot! 📸\"",
    time: "5 min ago",
  },
  {
    id: 3,
    type: "follow" as const,
    user: "mike_travels",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    action: "started following you",
    time: "12 min ago",
  },
  {
    id: 4,
    type: "like" as const,
    user: "emma_photo",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face",
    action: "liked your post",
    time: "18 min ago",
  },
  {
    id: 5,
    type: "comment" as const,
    user: "alex_creative",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    action: "commented: \"Love the colors!\"",
    time: "25 min ago",
  },
];

export const alerts = [
  {
    id: 1,
    type: "spike" as const,
    title: "Engagement Spike",
    message: "Your latest post is performing 3x better than average!",
    time: "1 hour ago",
  },
  {
    id: 2,
    type: "milestone" as const,
    title: "Milestone Reached",
    message: "Congratulations! You've reached 45K followers!",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "warning" as const,
    title: "Follower Drop",
    message: "You lost 23 followers in the last 24 hours",
    time: "5 hours ago",
  },
];

export const latestPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    likes: 1234,
    comments: 56,
    shares: 23,
    saves: 89,
    time: "2 hours ago",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop",
    likes: 987,
    comments: 43,
    shares: 18,
    saves: 67,
    time: "1 day ago",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=300&fit=crop",
    likes: 1567,
    comments: 78,
    shares: 34,
    saves: 112,
    time: "2 days ago",
  },
];

// Mock chat conversations for Monetisation tab
export const mockConversations = [
  {
    id: "1",
    title: "Growth Strategy",
    preview: "Let's analyze your best posting times...",
    date: "Today",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "What are my best posting times for maximum engagement?",
        timestamp: "10:30 AM",
      },
      {
        id: "2",
        role: "assistant" as const,
        content: "Based on your analytics, your audience is most active between 6-8 PM on weekdays and 10 AM-12 PM on weekends. Your top performing posts were published on Wednesdays at 7 PM and Saturdays at 11 AM. I recommend scheduling your key content during these peak hours for maximum visibility.",
        timestamp: "10:30 AM",
      },
    ],
  },
  {
    id: "2",
    title: "Content Ideas",
    preview: "Here are some trending content ideas...",
    date: "Yesterday",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "Give me content ideas for next week",
        timestamp: "3:15 PM",
      },
      {
        id: "2",
        role: "assistant" as const,
        content: "Based on trending topics in your niche and your audience preferences, here are 5 content ideas:\n\n1. Behind-the-scenes of your creative process\n2. Before/after transformation post\n3. Quick tutorial or tip carousel\n4. User-generated content spotlight\n5. Trending audio reel in your style\n\nWould you like me to elaborate on any of these?",
        timestamp: "3:15 PM",
      },
    ],
  },
  {
    id: "3",
    title: "Hashtag Strategy",
    preview: "Optimizing your hashtag reach...",
    date: "Jan 15",
    messages: [
      {
        id: "1",
        role: "user" as const,
        content: "What hashtags should I use?",
        timestamp: "11:00 AM",
      },
      {
        id: "2",
        role: "assistant" as const,
        content: "I recommend a mix of hashtag sizes for optimal reach:\n\n**Large (1M+ posts):** #photography, #travel, #instagood\n**Medium (100K-1M):** #creativephotography, #wanderlustlife\n**Small (10K-100K):** #parisphotographer, #frenchcreator\n**Niche (<10K):** #creativestudiolife\n\nUse 20-25 hashtags per post, rotating them to avoid shadowban.",
        timestamp: "11:01 AM",
      },
    ],
  },
];

export const mockAIResponses = [
  "Based on your recent performance data, I'd recommend focusing on carousel posts - they're generating 40% more engagement than single images for your account.",
  "Your audience engagement peaks between 6-8 PM local time. Consider scheduling your most important posts during this window.",
  "I notice your Reels are underperforming compared to your static posts. Try adding trending audio and keeping them under 15 seconds for better retention.",
  "Your top performing content themes are: nature photography (32% of engagement), behind-the-scenes (28%), and tutorial content (24%). Double down on these!",
  "Looking at your follower growth, you're averaging +150 new followers per week. To accelerate this, I recommend collaborating with creators in adjacent niches.",
  "Your engagement rate of 4.8% is above the industry average of 3.5%. Great job! To maintain this, keep responding to comments within the first hour of posting.",
];
