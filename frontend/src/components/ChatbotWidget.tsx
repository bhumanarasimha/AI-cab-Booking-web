import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle } from 'lucide-react';
import axios from 'axios';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      sender: 'ai',
      text: 'Hello! I am Aether-AI. I can analyze price surge models, search verified companions on your routes, or find optimized travel options. What is your destination today?'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const chips = [
    { label: 'Cheapest to Station', prompt: 'Find cheapest ride to Central Station' },
    { label: 'Rain & Surge check', prompt: 'Will it rain later? Surge risk?' },
    { label: 'Find companions', prompt: 'Show verified companions on tech park route' }
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const query = inputText;
    setInputText('');
    
    // Append user message
    setMessages((prev) => [...prev, { sender: 'me', text: query }]);
    setLoading(true);

    try {
      // Fetch EMMDE prediction parameters to dynamically respond
      const compareRes = await axios.post('http://localhost:5000/api/rides/compare', {
        origin: 'Central Business District',
        destination: 'International Tech Park'
      });

      const bestRide = compareRes.data.bestRide;
      const allOptions = compareRes.data.allOptions;

      // Simple keyword matching replies
      let reply = "I am processing your query using Aether's deep-learning mobility indexes. I can optimize routes, identify dynamic platform pricing, or map ride-sharing corridors.";
      const q = query.toLowerCase();

      if (q.includes('cheapest') || q.includes('compare')) {
        const cheapest = allOptions.sort((a: any, b: any) => a.fare - b.fare)[0];
        reply = `Analyzing live fares... The cheapest active option is **${cheapest.name}** costing **₹${cheapest.fare}** with an ETA of **${cheapest.duration} minutes**. Wait 5 minutes to avoid a dynamic pricing markup.`;
      } else if (q.includes('rain') || q.includes('surge') || q.includes('weather')) {
        reply = `Precipitation is currently influencing pricing structures. The surge multiplier factor is at **${bestRide.surgeMultiplier}x**. Wait 5 minutes to allow supply normalization.`;
      } else if (q.includes('companion') || q.includes('share')) {
        reply = `I identified active commuters matching your destination coordinates (e.g. Whitefield ITPL corridor). Connect via the **Commute Matching** tab to share costs!`;
      } else if (q.includes('hello') || q.includes('hi')) {
        reply = "Hello! I am your Aether AI travel routing companion. Ask me to find the cheapest booking path, perform weather surge analysis, or find travel group matches.";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Connection to EMMDE engine failed.' }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleChipClick = (prompt: string) => {
    setInputText(prompt);
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 rounded-3xl bg-zinc-950/90 border border-zinc-800/60 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl flex flex-col overflow-hidden glass-panel animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-zinc-800/60 bg-zinc-900/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white font-outfit">Aether Assistant</h4>
                <span className="text-[8px] text-cyan-400 block tracking-widest uppercase mt-0.5">ONLINE REASONING</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-white cursor-pointer bg-transparent border-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-outfit">
            {messages.map((msg, index) => {
              const isAi = msg.sender === 'ai';
              return (
                <div
                  key={index}
                  className={`max-w-[80%] p-2.5 rounded-2xl text-[11px] leading-relaxed ${
                    isAi
                      ? 'bg-zinc-900/40 border border-zinc-850 text-zinc-300 self-start rounded-bl-none'
                      : 'bg-purple-500/8 border border-purple-500/20 text-white self-end rounded-br-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              );
            })}
            {loading && (
              <div className="bg-zinc-900/40 border border-zinc-850 text-zinc-500 self-start rounded-2xl rounded-bl-none p-2.5 text-[10px] animate-pulse">
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chips */}
          <div className="px-4 py-2 border-t border-zinc-800/40 flex gap-1.5 overflow-x-auto bg-zinc-900/10">
            {chips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip.prompt)}
                className="px-2.5 py-1 bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-white rounded-full text-[9px] font-semibold whitespace-nowrap cursor-pointer transition-all duration-200"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-800/60 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask EMMDE about pricing, routing..."
              className="flex-1 bg-zinc-900/40 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-purple-500 transition-all font-outfit"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 flex items-center justify-center text-white border-none cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Pulsing FAB trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-glow-purple border-none flex items-center justify-center cursor-pointer transition-all duration-200 relative group"
      >
        <MessageSquare className="w-5.5 h-5.5 group-hover:scale-105 transition-transform" />
        <span className="absolute inset-0 rounded-full border-2 border-purple-500 animate-ping opacity-35 pointer-events-none"></span>
      </button>
    </div>
  );
}
