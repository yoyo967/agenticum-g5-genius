import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth'; 

interface CounterStrikeButtonProps {
  competitorId: string;
}

export const CounterStrikeButton: React.FC<CounterStrikeButtonProps> = ({ competitorId }) => {
  const { user } = useAuth(); // Erwartet { user: User | null }
  const [isStriking, setIsStriking] = useState<boolean>(false);
  const[showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const handleStrike = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsStriking(true);
    try {
      // Reale API Simulation
      await fetch('/api/counter-strike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId })
      });
      // Optional: Erfolgs-Notification via Toast hier einbinden
    } catch (error) {
      console.error("Strike Protocol Failed:", error);
    } finally {
      setIsStriking(false);
    }
  };

  return (
    <>
      <button
        onClick={handleStrike}
        disabled={isStriking}
        className="px-4 py-2 bg-[#1a0510] border border-magenta/50 text-magenta font-mono text-sm hover:bg-[#2a0815] transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {isStriking ? (
          <>
            <svg className="animate-spin h-4 w-4 text-magenta" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            EXECUTING STRIKE...
          </>
        ) : (
          'COUNTER-STRIKE: Generate Superior Cluster →'
        )}
      </button>

      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-midnight/90 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-[#0a0a0f] border border-accent shadow-[0_0_30px_rgba(0,229,255,0.15)] rounded-lg p-6 relative">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white font-mono"
            >
              [X]
            </button>
            
            <div className="mb-6">
              <h3 className="text-xl font-mono text-accent mb-2">ACCESS DENIED</h3>
              <p className="text-white/70 font-mono text-sm leading-relaxed">
                Initialize your Agent Profile to deploy the Counter-Strike. The Swarm awaits your command.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="/os?auth=register" 
                className="w-full text-center py-3 bg-accent/10 border border-accent text-accent font-mono text-sm hover:bg-accent hover:text-midnight transition-colors"
              >
                INITIALIZE AGENT PROFILE
              </a>
              <a 
                href="/os?auth=signin" 
                className="w-full text-center py-3 border border-white/20 text-white/60 font-mono text-sm hover:border-accent/50 hover:text-white transition-colors"
              >
                SIGN IN
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
