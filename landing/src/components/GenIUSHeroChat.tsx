import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, Zap, Command } from 'lucide-react';

export function GenIUSHeroChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'genius', text: string }[]>([
    { role: 'genius', text: "Welcome to the Nexus. I am GenIUS. How shall we orchestrate your marketing ecosystem today?" }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (forcedInput?: string) => {
    const userMsg = forcedInput || input;
    if (!userMsg.trim()) return;
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsThinking(true);

    // GenIUS logic for the Hero Section
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'genius', 
        text: `Command received: "${userMsg}". Initializing Swarm Protocol. Genetic optimization in progress... All 8 agents standing by.` 
      }]);
      setIsThinking(false);
    }, 1500);
  };

  const handleMicClick = () => {
    if (isListening || isThinking) return;
    setIsListening(true);
    setInput('');
    
    // Simulate real-time dictation
    const phrases = ["SN-00...", "SN-00, orchestrate...", "SN-00, orchestrate a global launch...", "SN-00, orchestrate a global launch campaign for enterprise SaaS."];
    
    setTimeout(() => setInput(phrases[0]), 800);
    setTimeout(() => setInput(phrases[1]), 1600);
    setTimeout(() => setInput(phrases[2]), 2400);
    setTimeout(() => setInput(phrases[3]), 3200);

    setTimeout(() => {
      setIsListening(false);
      handleSend(phrases[3]); 
    }, 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 relative z-30">
      {/* Terminal Bracketing & Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="ultra-lucid p-1 border-accent/20 relative overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_80px_rgba(0,229,255,0.05)]"
      >
        {/* Terminal Bracketing Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 rounded-tl-xl m-1 z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/40 rounded-tr-xl m-1 z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent/40 rounded-bl-xl m-1 z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 rounded-br-xl m-1 z-20 pointer-events-none" />

        {/* Intelligence Pulse Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                    : 'bg-white/10 text-white italic'
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
              GenIUS Processing
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-midnight/60 border-t border-accent/10 relative z-10">
          <div className={`flex items-center gap-3 bg-obsidian border p-2 transition-all ${isListening ? 'border-magenta shadow-[0_0_20px_rgba(255,0,122,0.2)]' : 'border-accent/20 focus-within:border-accent focus-within:shadow-[0_0_15px_rgba(0,229,255,0.2)]'}`}>
            <button 
              onClick={handleMicClick}
              className={`p-2 rounded-full transition-all ${isListening ? 'text-white bg-magenta animate-pulse' : 'text-accent hover:text-white hover:bg-white/5'}`}
            >
              <Mic size={18} />
            </button>
            
            {isListening ? (
              <div className="flex-1 flex items-center gap-4 py-2">
                <span className="text-magenta font-mono text-xs uppercase tracking-widest animate-pulse font-black">Listening...</span>
                <div className="flex items-center gap-1 h-4 flex-1">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 0.5 + ((i * 7) % 5) * 0.1, repeat: Infinity, delay: ((i * 3) % 4) * 0.125 }}
                      className="w-1 bg-magenta/60 rounded-full"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Terminal active. Awaiting voice or text directive..."
                className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-accent placeholder:text-accent/30 py-2 caret-accent"
              />
            )}
            
            {!isListening && (
              <button 
                onClick={() => handleSend()}
                className="w-10 h-10 bg-accent/10 flex items-center justify-center text-accent hover:bg-accent hover:text-midnight transition-all group border border-accent/20"
              >
                <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-accent/60 uppercase tracking-widest bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                <Bot size={10} /> GENIUS ACTIVE
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-mono text-emerald/60 uppercase tracking-widest bg-emerald/5 px-2 py-0.5 rounded border border-emerald/10">
                <Zap size={10} /> ZERO LATENCY
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
              Agenticum G5 · NEXUS TERMINAL
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
