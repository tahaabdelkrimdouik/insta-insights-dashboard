import { useState, useRef, useCallback, useEffect } from "react";
import { Send, MessageSquare, Clock, Sparkles, ArrowLeft, DollarSign, Mic, MicOff, Loader2 } from "lucide-react";
import { mockConversations } from "@/lib/mockData";
import { useAccountValue } from "@/hooks/useInstagramApi";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { chatService } from "@/lib/api/services";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
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

  const { data: accountValue, isLoading: accountValueLoading } = useAccountValue();

  const handleVoiceResult = useCallback((transcript: string) => {
    setInputValue(prev => prev + (prev ? " " : "") + transcript);
  }, []);

  const { isRecording, toggleRecording, isSupported } = useSpeechRecognition({
    onResult: handleVoiceResult,
    language: "en-US",
  });

  // Auto-scroll when streaming
  useEffect(() => {
    if (isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

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

    // Create placeholder for streaming response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      await chatService.sendMessageStream(
        {
          question: userQuestion,
          mode: 'monetization',
          max_tokens: 1000,
          temperature: 0.7,
          n_posts: 5,
        },
        (_chunk, fullText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: fullText }
                : msg
            )
          );
        }
      );

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: "Sorry, there was an error processing your request. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isInChat]);

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
        <div className="mb-4 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Welcome screen */}
        {!isInChat && messages.length === 0 ? (
          <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-metric-pink to-metric-orange bg-clip-text text-transparent">
                Monetization Assistant
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Get insights on brand deals, earnings & growth strategies
              </p>
            </div>

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
                    className="p-4 rounded-xl bg-card border border-border hover:bg-muted/50 hover:border-primary/30 transition-all text-left"
                  >
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

          

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
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mt-3 [&>h2]:mb-2 [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mt-2 [&>h3]:mb-1 [&>p]:my-1.5 [&>ul]:my-1.5 [&>ul]:pl-4 [&>ol]:my-1.5 [&>ol]:pl-4 [&>li]:my-0.5 [&_strong]:font-semibold">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-foreground/50 animate-pulse ml-1" />
                        )}
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    )}
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
              {isTyping && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analyzing monetization options...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about monetization tips..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={isTyping}
            />
            {isSupported && (
              <button
                onClick={toggleRecording}
                disabled={isTyping}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isRecording
                    ? "bg-destructive text-white recording-pulse"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  isTyping && "opacity-50 cursor-not-allowed"
                )}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                inputValue.trim() && !isTyping
                  ? "bg-gradient-to-br from-metric-pink to-metric-orange text-white hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
