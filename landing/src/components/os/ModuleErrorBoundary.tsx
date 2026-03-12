import { Component, type ErrorInfo, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, ShieldAlert, Cpu } from 'lucide-react';

interface Props {
  children: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ModuleErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[NEXUS_OS_GUARD] Module Failure: ${this.props.moduleName || 'Unknown Node'}`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); // Hard reset for maximum safety in OS context
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-12 bg-obsidian/40 backdrop-blur-3xl rounded-3xl border border-red-500/20 shadow-2xl overflow-hidden relative">
          {/* Background Neural Noise */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
             <div className="w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2)_0%,transparent_70%)]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="max-w-xl w-full text-center relative z-10"
          >
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10 border border-red-500/30 mb-8">
               <ShieldAlert size={48} className="text-red-500 animate-pulse" />
            </div>
            
            <h2 className="text-4xl font-display font-black italic tracking-tighter text-white mb-4">
               NODE COLLAPSE DETECTED
            </h2>
            
            <p className="text-white/50 font-mono text-sm leading-relaxed mb-12">
               The cognitive node <span className="text-red-400 font-bold uppercase tracking-widest px-2 py-1 bg-red-500/10 rounded">{this.props.moduleName || 'GENIUS_CORE'}</span> has experienced a critical execution failure. System integrity has been maintained via Global Protection Protocol.
            </p>

            <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-12 text-left font-mono">
               <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/30 mb-3">
                  <Cpu size={12} /> Diagnostic Stack Trace
               </div>
               <div className="text-[11px] text-red-400/80 break-all overflow-y-auto max-h-[100px] scrollbar-none">
                  {this.state.error?.message || 'Unknown Protocol Violation'}
                  <br />
                  <span className="opacity-40 italic mt-2 block capitalize">Code: 0xG5_FATAL_INTERRUPT</span>
               </div>
            </div>

            <div className="flex items-center justify-center gap-4">
               <button 
                 onClick={this.handleReset}
                 className="px-8 py-4 rounded-xl bg-white text-obsidian font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
               >
                 <RefreshCcw size={16} /> Re-Initialize Node
               </button>
               
               <a 
                 href="/"
                 className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white/50 font-black uppercase tracking-widest text-xs transition-all hover:bg-white/10 hover:text-white"
               >
                 Emergency Abort
               </a>
            </div>
          </motion.div>

          <div className="absolute top-6 left-6 opacity-20">
             <AlertTriangle size={24} className="text-red-500" />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
