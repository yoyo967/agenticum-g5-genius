import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Shield, Cpu, Zap, Palette, Film, 
  Terminal, Activity, CheckCircle2, 
  Sparkles, Scale, DollarSign, Leaf,
  Mic, MicOff, Volume2, Link2Off, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ExportMenu } from './ui';
import { downloadJSON, downloadTextFile } from '../utils/export';

import { type SwarmState } from '../types';

const SESSION_KEY = 'g5_console_session';

export function GeniusConsole() {
  const [swarm, setSwarm] = useState<SwarmState | null>(null);
  const [logs, setLogs] = useState<{ type: string; message: string; timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [output, setOutput] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected' | 'active' | 'error'>('disconnected');
  const [isRecording, setIsRecording] = useState(false);
  
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-save logs to localStorage
  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(logs.slice(-200)));
    }
  }, [logs]);

  const startNewSession = () => {
    setLogs([]);
    setOutput(null);
    localStorage.removeItem(SESSION_KEY);
  };

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const addLog = useCallback((type: string, message: string) => {
    setLogs(prev => [...prev.slice(-19), { type, message, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  // Audio processing functions isolated for mock phase

  // Audio playing utility (hoisted)
  function playAudioBase64(base64: string) {
    if (!audioContextRef.current) return;
    try {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
          float32[i] = int16[i] / 32768;
      }
      
      const buffer = audioContextRef.current.createBuffer(1, float32.length, 16000);
      buffer.getChannelData(0).set(float32);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  }

  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;
    
    setConnectionState('connecting');
    setLogs([]);
    
    // Real WebSocket Init
    const wsUrl = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8080`;
    const socket = new WebSocket(wsUrl);
    ws.current = socket;

    socket.onopen = () => {
      setConnectionState('connected');
      addLog('success', 'Neural Uplink Stable. Matrix Synchronized.');
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'status') {
          // Handle swarm status updates
          setSwarm(data.agent);
          
          // Dispatch global event for OS-wide telemetry
          window.dispatchEvent(new CustomEvent('swarm-status', { detail: data.agent }));
        }

        if (data.type === 'payload') {
          // Dispatch global event for SynergyMap telemetry
          window.dispatchEvent(new CustomEvent('swarm-payload', { detail: data }));
          addLog('action', `Data Transfer: ${String(data.from).toUpperCase()} → ${String(data.to).toUpperCase()} [${data.payloadType}]`);
        }

        if (data.type === 'senate') {
          // Dispatch global event for SecuritySenate
          window.dispatchEvent(new CustomEvent('swarm-senate', { detail: data }));
          addLog('error', `SENATE VETO: RA-01 has haulted orchestration.`);
        }

        if (data.type === 'output') {
          addLog('agent', `[${data.agentId.toUpperCase()}] ${data.data.substring(0, 100)}...`);
          if (data.agentId === 'sn-00') {
            setOutput(data.data);
          }
        }

        if (data.type === 'realtime_output') {
          // Play incoming audio from Gemini Live
          playAudioBase64(data.data);
        }

        if (data.type === 'error') {
          addLog('error', data.message);
          setConnectionState('error');
        }
      } catch (err) {
        console.error('Failed to parse socket message', err);
      }
    };

    socket.onclose = () => {
      setConnectionState('disconnected');
      addLog('system', 'Neural Uplink Terminated.');
    };

    socket.onerror = () => {
      setConnectionState('error');
      addLog('error', 'Fabric Connectivity Error. Check API Gateway.');
    };

  }, [addLog]);

  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (connectionState === 'connected' || connectionState === 'active') {
        setOutput(null);
        ws.current?.send(JSON.stringify({ 
          type: 'start', 
          input: detail.input || 'Initial brief' 
        }));
        addLog('action', `External Directive: ${detail.workflowId || 'Manual Injection'}`);
      }
    };

    window.addEventListener('trigger-orchestration', handleTrigger);
    return () => {
      window.removeEventListener('trigger-orchestration', handleTrigger);
      const currentReconnect = reconnectTimeoutRef.current;
      if (currentReconnect) {
        clearTimeout(currentReconnect);
      }
      ws.current?.close();
    };
  }, [connectionState, addLog]);

  const handleStart = () => {
    if (connectionState === 'connected' || connectionState === 'active') {
      setOutput(null);
      ws.current?.send(JSON.stringify({ 
        type: 'start', 
        input: 'Create a viral launch campaign for AGENTICUM G5.' 
      }));
      addLog('action', 'Initializing Neural Orchestration...');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      streamRef.current?.getTracks().forEach(track => track.stop());
      processorRef.current?.disconnect();
      addLog('system', 'Neural Uplink (Voice) Closed.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const float32Array = e.inputBuffer.getChannelData(0);
        // Convert Float32 to Int16
        const int16Array = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
           let val = float32Array[i] * 32768;
           val = Math.max(-32768, Math.min(32767, val));
           int16Array[i] = val;
        }

        // Convert Int16Array to Base64
        const uint8Array = new Uint8Array(int16Array.buffer);
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(uint8Array[i]);
        }
        const base64Data = window.btoa(binary);

        // Send over WS
        if (ws.current?.readyState === WebSocket.OPEN) {
           ws.current.send(JSON.stringify({
             type: 'realtime_input',
             sampleRate: 16000,
             data: base64Data
           }));
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
      
      setIsRecording(true);
      addLog('system', 'Neural Uplink (Voice) Established. Speak now.');
    } catch (err) {
      addLog('error', 'Microphone connection denied.');
      console.error(err);
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'sn-00': return <Cpu size={16} />;
      case 'sp-01': return <Zap size={16} />;
      case 'cc-06': return <Film size={16} />;
      case 'da-03': return <Palette size={16} />;
      case 'ra-01': return <Shield size={16} />;
      case 'pm-07': return <Bot size={16} />;
      default: return <Bot size={16} />;
    }
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Header handling
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-black uppercase italic tracking-tighter mb-4 mt-6 text-white">{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-display font-black uppercase tracking-tight mb-3 mt-5 text-neural-blue/90">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-display font-bold uppercase mb-2 mt-4 text-white/80">{line.replace('### ', '')}</h3>;
      
      // Image handling: ![Alt text](url)
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <div key={i} className="my-6 rounded-xl overflow-hidden border border-white/10 shadow-2xl group relative bg-black/20">
             <div className="absolute inset-0 bg-neural-blue/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
             <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover object-center max-h-[400px]" />
             <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-neural-black to-transparent">
                <span className="text-[10px] uppercase font-black tracking-widest text-neural-blue p-1 bg-neural-blue/10 rounded">{imgMatch[1]}</span>
             </div>
          </div>
        );
      }

      // Basic formatting
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-neural-gold/50 pl-4 py-1 italic text-white/60 mb-4 bg-white/2">{line.replace('> ', '')}</blockquote>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc mb-1 text-white/70">{line.replace('- ', '')}</li>;
      if (line.trim() === '') return <br key={i} />;
      
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>');
      
      return <p key={i} className="mb-4 leading-relaxed font-light text-white/70" dangerouslySetInnerHTML={{ __html: formatted }} />;
    });
  };

  return (
    <div className="w-full h-[800px] glass rounded-3xl overflow-hidden flex flex-col font-mono text-sm border border-white/5 relative bg-obsidian/40 backdrop-blur-3xl shadow-2xl">
      {/* Header Bar */}
      <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${
               connectionState === 'active' || connectionState === 'connected' ? 'bg-neural-blue animate-pulse shadow-[0_0_10px_rgba(0,229,255,0.8)]' : 
               connectionState === 'connecting' ? 'bg-neural-gold animate-pulse' : 'bg-red-500'
             }`} />
             <span className="text-[10px] uppercase tracking-widest font-black text-white/40">
               {connectionState === 'active' || connectionState === 'connected' ? 'Fabric Online' : 
                connectionState === 'connecting' ? 'Establishing Neural Bond...' : 
                connectionState === 'error' ? 'Connection Failed' : 'Fabric Offline'}
             </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-white/60">
            <Terminal size={14} />
            <span className="text-[10px] uppercase tracking-widest font-bold">GenIUS_Console_v2.0</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <ExportMenu label="Export Chat" options={[
            { label: 'JSON History', format: 'JSON', onClick: () => downloadJSON(logs.map(l => ({ role: l.type, content: l.message, timestamp: l.timestamp })), 'G5_Chat_History') },
            { label: 'Markdown Log', format: 'MD', onClick: () => downloadTextFile(logs.map(l => `**[${l.timestamp}] ${l.type}:**\n${l.message}`).join('\n\n---\n\n'), 'G5_Chat_Log', 'md') },
          ]} />
          <button onClick={startNewSession} className="text-[10px] uppercase tracking-widest font-bold text-white/30 hover:text-accent transition-colors px-3 py-1 border border-white/10 rounded hover:border-accent/30">
            + New Session
          </button>
          <div className="flex gap-2 text-[10px] uppercase font-black text-white/50 tracking-widest items-center mr-4">
             {isRecording ? (
                <span className="flex items-center gap-2 text-neural-gold border border-neural-gold/30 px-3 py-1 rounded bg-neural-gold/10">
                  <div className="flex items-end h-3 gap-[2px]">
                    {[0.6, 0.8, 0.55, 0.9, 0.7].map((val, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] bg-neural-gold"
                        animate={{ height: ['20%', `${val * 100}%`, '20%'] }}
                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
                      />
                    ))}
                  </div>
                  Live Uplink
                </span>
             ) : (
                <span className="flex items-center gap-2">
                  <Volume2 size={12} /> Idle Data
                </span>
             )}
          </div>
          <button 
            onClick={toggleRecording}
            className={`p-2 rounded border transition-all active:scale-95 ${isRecording ? 'bg-red-500/20 text-red-500 border-red-500/30' : 'bg-neural-gold/10 text-neural-gold hover:bg-neural-gold border-neural-gold/20 hover:text-obsidian'}`}
          >
            {isRecording ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
          <button 
            onClick={handleStart}
            disabled={(connectionState !== 'connected' && connectionState !== 'active') || (swarm?.state !== 'idle' && swarm?.state !== 'done')}
            className="bg-neural-blue/10 hover:bg-neural-blue text-neural-blue hover:text-obsidian px-4 py-1.5 rounded border border-neural-blue/20 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Spawn Swarm
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left Sidebar: Swarm Monitor */}
        <div className="w-80 border-r border-white/5 p-6 flex flex-col gap-6 bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-neural-blue" />
             <span className="text-[10px] uppercase font-black tracking-widest">Active Swarm</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {swarm && [swarm, ...Object.values(swarm.subAgents || {})].map((agent) => (
              <motion.div 
                key={agent.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-lg border transition-all ${agent.state !== 'idle' ? 'bg-white/[0.03]' : 'opacity-40'}`}
                style={{ borderColor: agent.state !== 'idle' ? `${agent.color}33` : 'transparent' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-white/5" style={{ color: agent.color }}>
                      {getAgentIcon(agent.id)}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-tight">{agent.id}</span>
                  </div>
                  {agent.state === 'done' ? (
                    <CheckCircle2 size={12} className="text-green-500" />
                  ) : agent.state !== 'idle' ? (
                    <div className="flex gap-0.5">
                      <motion.div animate={{ height: [4, 8, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-neural-blue" />
                      <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-0.5 bg-neural-blue" />
                    </div>
                  ) : null}
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[8px] uppercase tracking-widest font-black opacity-30">
                    <span>{agent.state}</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: agent.color }}
                      animate={{ width: `${agent.progress}%` }}
                    />
                  </div>
                  <p className="text-[9px] opacity-60 truncate italic mt-1 font-medium">{agent.lastStatus}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {!swarm && (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
               <Bot size={40} className="mb-4" />
               <p className="text-[10px] uppercase font-black tracking-tighter">Waiting for Neural Engagement</p>
            </div>
          )}
        </div>

        {/* Center: Live Terminal & Results */}
        <div className="flex-1 flex flex-col relative">
          {/* Algorithmic Senate Bar */}
          <AnimatePresence>
            {swarm?.subAgents?.auditor?.state === 'working' || swarm?.subAgents?.auditor?.state === 'done' ? (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-500/5 border-b border-red-500/20 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Scale size={14} className="text-red-500" />
                    <span className="text-[10px] uppercase font-black text-red-500 tracking-widest">Algorithmic Senate Tribunal</span>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[8px] font-black uppercase tracking-widest">Adversarial Review Active</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   {[
                     { name: 'Ethics', icon: Shield, color: '#EA4335' },
                     { name: 'Economy', icon: DollarSign, color: '#FBBC04' },
                     { name: 'Ecology', icon: Leaf, color: '#34A853' }
                   ].map((senator) => (
                     <div key={senator.name} className="glass p-2 flex items-center gap-3 border-white/5">
                        <senator.icon size={12} style={{ color: senator.color }} />
                        <span className="text-[9px] uppercase font-bold opacity-60">{senator.name}</span>
                        <div className="ml-auto flex items-center gap-1">
                           <div className={`w-1.5 h-1.5 rounded-full ${swarm.subAgents.auditor.state === 'done' ? 'bg-green-500' : 'bg-white/10 animate-pulse'}`} />
                           <span className="text-[8px] font-black opacity-40 italic">{swarm.subAgents.auditor.state === 'done' ? 'APPROVE' : 'VOTING'}</span>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex-1 p-8 overflow-y-auto font-mono scrollbar-none" ref={scrollRef}>
             <AnimatePresence>
               {isRecording && (
                 <motion.div 
                   key="voice-overlay"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="absolute inset-x-8 top-8 z-30 p-12 rounded-3xl bg-black/80 backdrop-blur-2xl border border-neural-gold/30 shadow-[0_0_100px_rgba(251,188,4,0.1)] flex flex-col items-center justify-center text-center"
                 >
                   <div className="relative mb-8">
                     <div className="absolute inset-0 bg-neural-gold/20 rounded-full blur-3xl animate-pulse" />
                     <div className="w-28 h-28 rounded-full border border-neural-gold/50 flex items-center justify-center relative z-10 bg-black/40 shadow-inner">
                       <Mic size={40} className="text-neural-gold animate-pulse shadow-[0_0_20px_rgba(251,188,4,0.5)]" />
                     </div>
                     {/* Orbiting rings */}
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute inset-[-15px] rounded-full border border-dashed border-neural-gold/30" />
                     <motion.div animate={{ rotate: -360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-30px] rounded-full border border-solid border-neural-gold/10" />
                   </div>
                   <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest mb-3">Gemini Live Active</h3>
                   <p className="text-xs text-neural-gold/80 uppercase tracking-[0.3em] font-mono">Transcribing Neuro-Acoustic Input...</p>
                   
                   <div className="flex items-center gap-1.5 mt-8 h-12 w-full max-w-sm justify-center">
                     {[0.8, 0.4, 0.9, 0.3, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3, 0.8, 0.6, 0.9, 0.4].map((val, i) => (
                       <motion.div
                          key={i}
                          className="w-2 bg-neural-gold/80 rounded-sm"
                          animate={{ height: ['20%', `${val * 100}%`, '20%'] }}
                          transition={{ repeat: Infinity, duration: 0.4 + (i % 5) * 0.1, ease: "easeInOut" }}
                       />
                     ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <AnimatePresence mode="wait">
               {output ? (
                 <motion.div 
                   key="output"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="prose prose-invert max-w-none prose-sm"
                 >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                      <Sparkles size={18} className="text-neural-blue" />
                      <h2 className="text-xl font-display font-black uppercase italic tracking-tighter m-0">Campaign Forge Complete</h2>
                    </div>
                    <div className="px-2 pb-12">
                      {renderMarkdown(output)}
                    </div>
                 </motion.div>
               ) : (
                  <motion.div key="logs" className="flex flex-col gap-2 relative">
                     {connectionState === 'disconnected' ? (
                       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center border border-red-500/20 rounded-xl p-8 shadow-2xl">
                         <Link2Off size={48} className="text-red-500/50 mb-6" />
                         <h3 className="text-2xl font-display font-black text-red-500 uppercase tracking-tighter mb-2">Neural Fabric Offline</h3>
                         <p className="text-white/40 text-xs mb-8 max-w-sm text-center">System awaiting explicit connection directive.</p>
                         
                         <div className="flex flex-col gap-3 w-full max-w-sm mb-8">
                           <div className="flex items-center justify-between p-3 rounded glass border-white/5">
                             <span className="text-xs uppercase font-black text-white/60">GCP Project</span>
                             <span className="flex items-center gap-1 text-[10px] text-green-500 uppercase font-bold"><CheckCircle2 size={12}/> alphate-enterprise-g5</span>
                           </div>
                           <div className="flex items-center justify-between p-3 rounded glass border-red-500/20 bg-red-500/5">
                             <span className="text-xs uppercase font-black text-white/60">Gemini API Key</span>
                             <button onClick={() => navigate('/os?module=global-config')} className="flex items-center gap-1 text-[10px] text-red-500 uppercase font-bold hover:text-red-400 transition-colors">
                               <AlertCircle size={12}/> Not Configured →
                             </button>
                           </div>
                           <div className="flex items-center justify-between p-3 rounded glass border-neural-gold/20 bg-neural-gold/5">
                             <span className="text-xs uppercase font-black text-white/60">Microphone</span>
                             <button onClick={() => navigator.mediaDevices.getUserMedia({ audio: true })} className="flex items-center gap-1 text-[10px] text-neural-gold uppercase font-bold hover:text-neural-gold/80 transition-colors">
                               ⚠ Not Requested → Grant Permission
                             </button>
                           </div>
                         </div>

                         <div className="flex gap-4">
                           <button onClick={() => connect()} className="px-6 py-2 rounded bg-neural-blue text-obsidian hover:bg-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                             <Zap size={14} /> Connect
                           </button>
                         </div>
                       </div>
                     ) : connectionState === 'error' ? (
                       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center border border-red-500/20 rounded-xl p-8 shadow-2xl">
                         <Link2Off size={48} className="text-red-500/50 mb-6" />
                         <h3 className="text-2xl font-display font-black text-red-500 uppercase tracking-tighter mb-2">Connection Failed</h3>
                         <div className="flex gap-4 mt-4">
                           <button onClick={() => connect()} className="px-6 py-2 rounded bg-neural-blue text-obsidian hover:bg-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                             <Zap size={14} /> Retry
                           </button>
                         </div>
                       </div>
                     ) : (
                       <>
                         {logs.map((log, i) => (
                           <motion.div 
                             key={i}
                             initial={{ opacity: 0, x: -5 }}
                             animate={{ opacity: 1, x: 0 }}
                             className="flex gap-4 items-start"
                           >
                             <span className="text-[9px] opacity-20 font-black tabular-nums">[{log.timestamp}]</span>
                             <span className={`text-[10px] font-black uppercase tracking-tighter w-16 ${
                               log.type === 'system' ? 'text-white/30' : 
                               log.type === 'error' ? 'text-red-500' : 
                               log.type === 'success' ? 'text-green-500' : 'text-neural-blue'
                             }`}>{log.type}</span>
                             <p className="text-[11px] opacity-80 flex-1 leading-normal">{log.message}</p>
                           </motion.div>
                         ))}
                         {swarm?.state !== 'idle' && (
                           <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex gap-4 items-center mt-4">
                              <span className="text-[9px] opacity-20 font-black tabular-nums">[{new Date().toLocaleTimeString()}]</span>
                              <span className="text-neural-blue font-black uppercase text-[10px] tracking-tighter">WAIT</span>
                              <div className="flex gap-1 mt-1">
                                {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-neural-blue/40 rounded-full" />)}
                              </div>
                           </motion.div>
                         )}
                       </>
                     )}
                  </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Sensory Feedback Visualizer (Corner) */}
          <div className="absolute bottom-6 right-6 flex items-end gap-1">
             {[...Array(6)].map((_, i) => (
               <motion.div 
                key={i}
                animate={{ height: swarm?.state !== 'idle' ? [8, 40 + (i * 10), 8] : 8 }}
                transition={{ repeat: Infinity, duration: 0.4 + i*0.1 }}
                className="w-1 bg-neural-blue/20 rounded-full"
               />
             ))}
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/1 flex justify-between items-center opacity-40">
        <span className="text-[8px] font-black uppercase tracking-[0.5em]">Agenticum Genius G5 // Nexus Shell</span>
        <div className="flex gap-4">
           {['Neural Threading', 'Senate Substrate', 'Grounding Engine'].map(t => (
             <span key={t} className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 border border-white/10 rounded-sm italic">{t}</span>
           ))}
        </div>
      </div>
    </div>
  );
}
