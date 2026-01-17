import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Plus, MessageSquare, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockConversations, mockAIResponses } from "@/lib/mockData";
import { cn } from "@/lib/utils";

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
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewConversation = () => {
    setActiveConversation(null);
    setMessages([]);
    setShowHistory(false);
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
    setShowHistory(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
      const newAIMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, newAIMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Mock voice recording
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("What are the best times to post for maximum engagement?");
      }, 2000);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] lg:h-[calc(100vh-80px)] gap-4 slide-up">
      {/* Conversation History Sidebar */}
      <div
        className={cn(
          "bg-card rounded-xl border border-border flex-col transition-all duration-300",
          showHistory ? "w-80 flex" : "w-0 hidden lg:flex lg:w-80"
        )}
      >
        <div className="p-4 border-b border-border">
          <Button
            onClick={handleNewConversation}
            className="w-full gradient-accent text-accent-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
        
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  activeConversation?.id === conv.id
                    ? "bg-accent/10 border border-accent/20"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.preview}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{conv.date}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <h1 className="text-lg text-muted-foreground text-center font-medium">
                Ask me about growth strategies, content ideas, or monetisation tips...
              </h1>
            </div>
          ) : (
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
                    <p className="leading-relaxed">{message.content}</p>
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
          )}
        </div>

        {/* Input */}
        <div className="p-3">
          <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about growth strategies, content ideas..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={toggleRecording}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                isRecording
                  ? "bg-destructive text-white recording-pulse"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                inputValue.trim()
                  ? "bg-gradient-to-br from-metric-pink to-metric-orange text-white hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
