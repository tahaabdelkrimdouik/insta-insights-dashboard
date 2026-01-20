import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageSquare, Clock, Sparkles, ArrowLeft, DollarSign, RefreshCw } from "lucide-react";
import { mockConversations } from "@/lib/mockData";
import { useAccountValue } from "@/hooks/useInstagramApi";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

const STATS_BASE_URL = import.meta.env.VITE_STATS_BASE_URL;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  messages: Message[];
}

export function MonetisationTab() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInChat, setIsInChat] = useState(false);
  const [showAllConversations, setShowAllConversations] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Store fetched data
  const [profileData, setProfileData] = useState<unknown>(null);
  const [mediaData, setMediaData] = useState<unknown>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const { data: accountValue, isLoading: accountValueLoading } = useAccountValue();

  // Fetch data from endpoints
  const fetchData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const [profileRes, mediaRes] = await Promise.all([
        fetch(`${STATS_BASE_URL}/stats/profile`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        }),
        fetch(`${STATS_BASE_URL}/stats/media`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        })
      ]);

      if (profileRes.ok) {
        const profile = await profileRes.json();
        setProfileData(profile);
        console.log("Profile loaded:", profile);
      }

      if (mediaRes.ok) {
        const media = await mediaRes.json();
        setMediaData(media);
        console.log("Media loaded:", media);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectConversation = (conversation: Conversation) => {
    setMessages(conversation.messages);
    setIsInChat(true);
  };

  const handleBack = () => {
    if (messages.length > 0 && currentConversationId) {
      const existingIndex = conversations.findIndex(c => c.id === currentConversationId);
      if (existingIndex === -1) {
        const newConversation: Conversation = {
          id: currentConversationId,
          title: messages[0]?.content.slice(0, 40) + "..." || "New conversation",
          preview: messages[messages.length - 1]?.content.slice(0, 50) + "..." || "",
          date: "Just now",
          messages: messages,
        };
        setConversations(prev => [newConversation, ...prev]);
      }
    }
    setMessages([]);
    setIsInChat(false);
    setCurrentConversationId(null);
  };

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    if (!isInChat) {
      setIsInChat(true);
      setCurrentConversationId(Date.now().toString());
    }

    const userQuestion = inputValue;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userQuestion,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    const systemContext = `You are an expert Instagram growth strategist and monetization consultant. You have access to the user's complete Instagram analytics data. Your role is to provide actionable, data-driven insights to help them grow their account and monetize effectively.

=== ACCOUNT PROFILE DATA ===
${JSON.stringify(profileData, null, 2)}

=== MEDIA/POSTS DATA (includes engagement, likes, comments, reach, impressions) ===
${JSON.stringify(mediaData, null, 2)}

=== YOUR EXPERTISE ===
You can help with:
1. Content Strategy - Analyze what content performs best
2. Engagement Optimization - How to increase likes, comments, saves
3. Best Posting Times - Based on when their audience is most active
4. Hashtag Strategy - Relevant hashtags to increase reach
5. Monetization - Brand deals, affiliate marketing, based on their engagement
6. Growth Tactics - Strategies to grow followers organically
7. Content Calendar - Planning and scheduling recommendations

=== RESPONSE GUIDELINES ===
- Be specific and reference actual data from their account
- Use numbers and percentages when discussing performance
- Provide actionable steps, not just generic advice
- Format responses clearly with sections and bullet points
- Be encouraging but honest about areas needing improvement`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemContext}\n\nUser Question: ${userQuestion}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          }
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const responseText = data.candidates[0].content.parts[0].text;
        const newAIMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newAIMessage]);
      } else {
        const newAIMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I couldn't generate a response. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, newAIMessage]);
      }
    } catch (error) {
      console.log("API error:", error);
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, there was an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newAIMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isInChat, profileData, mediaData]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: "📈 Best posting times", query: "What are the best times for me to post?" },
    { label: "💰 Monetization", query: "How can I monetize my account?" },
    { label: "🎯 Content ideas", query: "Give me 3 content ideas" },
    { label: "📊 Performance", query: "How is my account performing?" },
  ];

  return (
    <div className="flex flex-col h-full min-h-0 slide-up px-6 md:px-12 lg:px-16">
      {/* Header */}
      {isInChat && (
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={fetchData}
            disabled={isLoadingData}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isLoadingData && "animate-spin")} />
            Refresh Data
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Welcome screen */}
        {!isInChat && messages.length === 0 ? (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                AI Instagram Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {isLoadingData ? "Loading your Instagram data..." : "Powered by Gemini AI"}
              </p>
            </div>

            {isLoadingData ? (
              <div className="space-y-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            ) : (
              <>
                {/* Quick Actions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(action.query);
                        }}
                        className="p-4 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-violet-500/30 transition-all text-left"
                      >
                        <span className="text-sm font-medium">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account Value */}
                {(accountValueLoading || accountValue) && (
                  <div className="mb-6">
                    {accountValueLoading ? (
                      <Skeleton className="h-24 rounded-xl" />
                    ) : accountValue && (
                      <div className="bg-gradient-to-br from-metric-pink/10 to-metric-orange/10 border border-border rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-metric-pink to-metric-orange">
                            <DollarSign className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estimated Per Post Value</p>
                            <p className="text-2xl font-bold text-foreground">
                              {accountValue.perPost}
                            </p>
                            {accountValue.monthlyPotential && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Monthly potential: {accountValue.monthlyPotential}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Previous conversations */}
                {conversations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-3">Previous conversations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(showAllConversations ? conversations : conversations.slice(0, 3)).map((conv) => (
                        <button
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className="text-left p-4 rounded-xl bg-card border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted shrink-0">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{conv.title}</p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.preview}</p>
                              <div className="flex items-center gap-1 mt-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{conv.date}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {conversations.length > 3 && (
                      <button
                        onClick={() => setShowAllConversations(!showAllConversations)}
                        className="mt-4 w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border hover:bg-muted/50"
                      >
                        {showAllConversations ? "Show less" : `Show all ${conversations.length}`}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Chat messages area */
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  {message.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-metric-pink to-metric-orange flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm",
                      message.role === "user"
                        ? "bg-gradient-to-br from-metric-pink to-metric-orange text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    )}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-1.5",
                        message.role === "user" ? "text-white/70" : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span className="text-xs text-muted-foreground">Gemini AI</span>
            {profileData && <span className="text-xs text-emerald-500">• Data loaded</span>}
          </div>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your Instagram..."
              className="w-full bg-muted/50 border border-border rounded-2xl pl-4 pr-14 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  inputValue.trim() && !isTyping
                    ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white hover:opacity-90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
