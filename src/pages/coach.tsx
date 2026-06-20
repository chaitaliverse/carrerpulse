import { useState, useRef, useEffect } from "react";
import { useGetCoachMessages, useSendCoachMessage } from "@workspace/api-client-react";
import { MessageSquare, Send, Bot, User, Sparkles, BrainCircuit } from "lucide-react";

export function Coach() {
  const [input, setInput] = useState("");
  const [context, setContext] = useState("Career Switch");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { data: messages, isLoading } = useGetCoachMessages();
  const sendMessage = useSendCoachMessage();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sendMessage.isPending]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    sendMessage.mutate({ data: { message: input, context } });
    setInput("");
  };

  const contexts = ["Interview Prep", "Career Switch", "Salary Negotiation", "Learning"];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ height: 'calc(100dvh - 7rem)' }}>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          <BrainCircuit className="w-7 h-7 md:w-8 md:h-8 text-primary shrink-0" />
          AI Career Coach
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Your personal strategist for data career advancement.</p>
      </div>

      {/* Context tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 shrink-0">
        {contexts.map(c => (
          <button
            key={c}
            onClick={() => setContext(c)}
            className={`px-3 md:px-4 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all border whitespace-nowrap shrink-0 ${
              context === c 
                ? 'bg-primary/20 text-primary border-primary/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 glass-panel rounded-xl border border-white/5 flex flex-col overflow-hidden relative min-h-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 md:w-96 h-72 md:h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 md:space-y-6 min-h-0">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <div className="w-2/3 h-20 bg-white/5 animate-pulse rounded-2xl rounded-tl-none" />
              <div className="w-2/3 h-14 bg-white/5 animate-pulse rounded-2xl rounded-tr-none self-end" />
            </div>
          ) : (
            <>
              {messages?.map((msg, idx) => (
                <div key={msg.id || idx} className={`flex gap-2 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' 
                      ? 'bg-secondary text-white' 
                      : 'bg-primary/20 border border-primary/50 text-primary shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  }`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" />}
                  </div>
                  <div className={`flex flex-col max-w-[85%] md:max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-secondary/20 border border-secondary/30 text-white rounded-tr-none'
                        : 'bg-white/5 border border-white/10 text-white rounded-tl-none backdrop-blur-md'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => { setInput(sug); handleSend(); }}
                            className="text-xs bg-white/5 hover:bg-primary/20 text-primary border border-primary/20 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {sendMessage.isPending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-3 md:p-4 border-t border-white/10 bg-background/50 backdrop-blur-xl shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${context}...`}
              className="w-full bg-black/50 border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 rounded-full pl-4 pr-12 py-2.5 md:py-3 text-sm text-white placeholder:text-muted-foreground outline-none transition-all shadow-inner"
              disabled={sendMessage.isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sendMessage.isPending}
              className="absolute right-2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
