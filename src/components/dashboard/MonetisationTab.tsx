import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Plus, MessageSquare, Clock, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="flex-1 flex flex-col bg-card rounded-xl border border-border overflow-hidden">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", showHistory && "rotate-180")} />
            </button>
            <div className="gradient-accent p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Growth Assistant</h3>
              <p className="text-xs text-muted-foreground">Monetisation insights & content strategy</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="gradient-accent p-4 rounded-2xl mb-4">
                <Sparkles className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Growth Assistant</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                Get personalized insights for growth, best posting times, content suggestions, and monetisation strategies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  "What are my best posting times?",
                  "Give me content ideas",
                  "Analyze my engagement rate",
                  "How can I grow faster?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInputValue(prompt)}
                    className="p-3 text-sm text-left rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 slide-in-right",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="gradient-accent p-2 rounded-lg h-fit shrink-0">
                      <Sparkles className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%]",
                      message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 items-start">
                  <div className="gradient-accent p-2 rounded-lg h-fit">
                    <Sparkles className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about growth strategies, content ideas..."
                className="min-h-[48px] max-h-[120px] resize-none pr-12 bg-muted/50 border-border"
                rows={1}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={cn(
                "shrink-0 h-12 w-12 rounded-xl transition-all",
                isRecording 
                  ? "bg-destructive text-destructive-foreground recording-pulse" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="shrink-0 h-12 w-12 rounded-xl gradient-accent text-accent-foreground hover:opacity-90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {isRecording && (
            <p className="text-xs text-destructive mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              Recording... Speak now
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
