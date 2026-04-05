import React, { useState } from "react";
import { Sparkles, X, Send, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const quickChips = ["Where is my driver?", "How long more?", "Cancel ride", "Report issue"];

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GeminiChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your RapidX assistant. How can I help you with your ride?" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm looking into that for you. Your driver Ravi is currently 3 minutes away and heading to your pickup location." }]);
      setTyping(false);
    }, 1500);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-y-primary flex items-center justify-center shadow-lg hover:bg-y-hover transition-colors"
      >
        <div className="absolute inset-0 rounded-full bg-y-primary animate-pulse-ring" />
        <Sparkles size={24} className="text-y-dark relative z-10" />
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-sheet shadow-sheet flex flex-col" style={{ height: "70vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-rx-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-y-primary" />
          <div>
            <p className="font-bold text-rx-black text-base">RapidX Assistant</p>
            <p className="text-rx-gray-400 text-xs">Powered by Gemini</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="p-2 hover:bg-rx-gray-100 rounded-full">
          <X size={20} className="text-rx-gray-700" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div className={cn("max-w-[80%] px-4 py-2.5 text-sm", m.role === "user"
              ? "bg-y-primary text-y-dark rounded-[18px_18px_4px_18px]"
              : "bg-off-white text-rx-black rounded-[18px_18px_18px_4px]"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {messages.length === 1 && (
          <p className="text-rx-gray-400 text-[10px] text-center mt-1">AI responses may not always be accurate.</p>
        )}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-off-white rounded-[18px_18px_18px_4px] px-4 py-3 flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-y-primary animate-typing-1" />
              <span className="w-2 h-2 rounded-full bg-y-primary animate-typing-2" />
              <span className="w-2 h-2 rounded-full bg-y-primary animate-typing-3" />
            </div>
          </div>
        )}
      </div>

      {/* Quick chips */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {quickChips.map(chip => (
          <button
            key={chip}
            onClick={() => sendMessage(chip)}
            className="flex-shrink-0 bg-off-white text-rx-black text-xs font-medium rounded-pill px-3 py-1.5 hover:bg-rx-gray-100 transition-colors"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 flex items-center gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask anything about your ride..."
          className="flex-1 bg-off-white text-rx-black rounded-pill px-4 py-3 text-sm outline-none"
        />
        <button
          onClick={() => sendMessage(input)}
          className="w-10 h-10 rounded-full bg-y-primary flex items-center justify-center hover:bg-y-hover"
        >
          <ArrowUp size={18} className="text-y-dark" />
        </button>
      </div>
    </div>
  );
};

// Fix: i is not defined outside map
export default GeminiChatWidget;
