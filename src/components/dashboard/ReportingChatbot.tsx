import { useState, useCallback, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { chatService } from "@/lib/api/services";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export function ReportingChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isUserNearBottomRef = useRef(true);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(prev => prev + (prev ? " " : "") + transcript);
  }, []);

  const { isRecording, toggleRecording, isSupported } = useSpeechRecognition({
    onResult: handleVoiceResult,
    language: "fr-FR",
  });

  // Scroll to bottom within the container only (not the page)
  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Check if user is near bottom of chat container
  const checkIfNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    isUserNearBottomRef.current = distanceFromBottom < 100; // 100px threshold
  }, []);

  // Auto-scroll only if user is near bottom (don't fight manual scrolling)
  useEffect(() => {
    if (isUserNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userQuestion = input;
    setInput("");
    setIsTyping(true);
    
    // Scroll to bottom when user sends a message
    setTimeout(() => scrollToBottom(), 50);

    // Create placeholder for streaming response
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      await chatService.sendMessageStream(
        {
          question: userQuestion,
          mode: 'content_analyst',
          max_tokens: 1000,
          temperature: 0.5,
          n_posts: 3,
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
            ? { ...msg, content: "Sorry, I couldn't process your request. Please try again.", isStreaming: false }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={checkIfNearBottom}
        className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <h1 className="text-lg text-muted-foreground text-center font-medium">
              How can I help you with your insights?
            </h1>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex animate-fade-in",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[90%] rounded-2xl px-4 py-3 text-sm",
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
                <p className="leading-relaxed">{message.content}</p>
              )}
              <p
                className={cn(
                  "text-[10px] mt-2",
                  message.role === "user" ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        {isTyping && messages[messages.length - 1]?.content === "" && (
          <div className="flex animate-fade-in justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Analyzing your data...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3">
        <div className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your analytics..."
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
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              input.trim() && !isTyping
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
  );
}
