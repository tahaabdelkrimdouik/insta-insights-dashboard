import { useState, useCallback } from "react";
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
}

export function ReportingChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleVoiceResult = useCallback((transcript: string) => {
    setInput(prev => prev + (prev ? " " : "") + transcript);
  }, []);

  const { isRecording, toggleRecording, isSupported } = useSpeechRecognition({
    onResult: handleVoiceResult,
    language: "fr-FR",
  });

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

    try {
      const response = await chatService.sendMessage({
        question: userQuestion,
        mode: 'content_analyst',
        max_tokens: 1000,
        temperature: 0.5,
        n_posts: 3,
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
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
        {isTyping && (
          <div className="flex animate-fade-in justify-start">
            <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Analyzing your data...</span>
            </div>
          </div>
        )}
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
