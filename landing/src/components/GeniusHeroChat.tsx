import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, Sparkles, Zap, Command } from 'lucide-react';

export function GeniusHeroChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'genius', text: string }[]>([
    { role: 'genius', text: "Welcome to the Nexus. I am GENIUS. How shall we orchestrate your marketing ecosystem today?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    // GENIUS logic for the Hero Section
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'genius', 
        text: `Command received: "${userMsg}". Initializing Swarm Protocol. Genetic optimization in progress... All 8 agents standing by.` 
      }]);
      setIsThinking(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 relative z-30">
      {/* The Chat Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-1 rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-obsidian/40 backdrop-blur-2xl relative overflow-hidden group"
      >
        {/* Intelligence Pulse Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-accent/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-neural-gold/10 blur-[120px] rounded-full"
          />
        </div>

        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="h-[300px] overflow-y-auto px-6 py-8 space-y-6 scrollbar-hide relative z-10"
        >
          <AnimatePresence mode='popLayout'>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-lg ${
                  msg.role === 'genius' 
                    ? 'bg-accent/10 border-accent/20 text-accent group-hover:shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}>
                  {msg.role === 'genius' ? <Zap size={14} className="animate-pulse" /> : <Command size={14} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm font-mono leading-relaxed ${
                  msg.role === 'genius'
                    ? 'bg-accent/5 border border-white/5 text-white/80'
                    : 'bg-white/5 text-white/60 italic'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isThinking && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-accent/60 font-mono text-[10px] uppercase tracking-widest pl-12"
            >
              <div className="flex gap-1">
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>.</motion.span>
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}>.</motion.span>
              </div>
              GENIUS Processing
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/2 border-t border-white/5 relative z-10">
          <div className="flex items-center gap-2 bg-black/40 rounded-2xl border border-white/10 p-2 focus-within:border-accent/40 transition-all">
            <div className="p-2 text-white/20">
              <Mic size={18} className="hover:text-accent cursor-pointer transition-colors" />
            </div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Speak to GENIUS..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white placeholder:text-white/20 py-2"
            />
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-obsidian transition-all group"
            >
              <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                <Bot size={10} /> GENIUS Active
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-white/20 uppercase tracking-widest">
                <Sparkles size={10} /> Zero Latency
              </span>
            </div>
            <span className="text-[8px] font-mono text-white/10 uppercase tracking-[0.2em]">
              Agenticum G5 · Master Intelligence
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
