import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, UserPlus, LogIn, ChevronRight, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export function OSAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAppStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create initial user document
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: 'ADMIN',
          settings: { theme: 'dark' },
          createdAt: serverTimestamp()
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'Authentication failed. Neural link rejected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian flex flex-col items-center justify-center overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full animate-glow-pulse pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/40 border border-white/10 mb-6 relative group">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Shield className="text-accent w-8 h-8 relative z-10" />
          </div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-white mb-2">
            GenIUS <span className="text-accent">OS</span>
          </h1>
          <p className="font-mono text-xs text-white/40 uppercase tracking-[0.2em]">
            Neural Authentication Gateway
          </p>
        </div>

        <div className="glass p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="flex gap-1 p-1 bg-black/40 rounded-lg mb-8 h-10">
            <button 
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 rounded-md font-display text-xs uppercase tracking-wide transition-all ${isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 rounded-md font-display text-xs uppercase tracking-wide transition-all ${!isLogin ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">Agent Identification (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20">
                  <Activity size={14} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-white/10"
                  placeholder="sys.admin@cyberdyne.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-1.5 block">Decryption Key (Password)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/20">
                  <Lock size={14} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-9 pr-3 text-sm text-white focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-white/10"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-magenta/10 border border-magenta/20 rounded p-3 flex items-start gap-2"
                >
                  <Zap size={14} className="text-magenta shrink-0 mt-0.5" />
                  <p className="font-mono text-[10px] text-magenta/90 leading-relaxed">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full btn py-3 mt-4 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'btn-primary shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]'}`}
            >
              {loading ? (
                <>
                  <Activity size={16} className="animate-spin" /> 
                  <span className="font-display uppercase text-xs tracking-widest">Bridging Connection...</span>
                </>
              ) : isLogin ? (
                <>
                  <LogIn size={16} /> 
                  <span className="font-display uppercase text-xs tracking-widest">Establish Link</span>
                  <ChevronRight size={14} className="ml-1 opacity-50" />
                </>
              ) : (
                <>
                  <UserPlus size={16} /> 
                  <span className="font-display uppercase text-xs tracking-widest">Initialize Agent Profile</span>
                  <ChevronRight size={14} className="ml-1 opacity-50" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Decorative Terminal Overlay */}
      <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white/20 leading-relaxed pointer-events-none opacity-50 hidden md:block">
        &gt; INITIATING HANDSHAKE PROTOCOL v5.2...<br/>
        &gt; CONNECTING TO NEURAL MESH [eu-west1]...<br/>
        &gt; AWAITING CREDENTIALS...<br/>
      </div>
    </div>
  );
}
