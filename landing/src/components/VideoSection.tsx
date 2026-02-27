import React, { useEffect, useState } from 'react';

interface VideoSectionProps {
  videoId?: string;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoId }) => {
  const[autoPlay, setAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    // Listener für den Hero-Button (Lücke 4)
    const handlePlayVideo = () => {
      setAutoPlay(true);
      const section = document.getElementById('see-it-live');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('play-demo-video', handlePlayVideo);
    return () => window.removeEventListener('play-demo-video', handlePlayVideo);
  },[]);

  return (
    <section id="see-it-live" className="w-full py-24 bg-[#0a0a0f] border-t border-cyan-500/20 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-mono text-cyan-400 mb-2">[ DIRECT TRANSMISSION ]</h2>
          <p className="text-gray-400 font-mono text-sm">SEE IT LIVE // GLOBAL DEPLOYMENT FEED</p>
        </div>

        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-cyan-500/30 bg-black shadow-[0_0_40px_rgba(0,255,255,0.05)] group">
          {videoId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1${autoPlay ? '&autoplay=1' : ''}`}
              title="Agenticum G5 GenIUS Live Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050508] overflow-hidden">
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px)] bg-size-[100%_4px] pointer-events-none" />
              
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 mb-6 rounded-full border border-cyan-500/50 flex items-center justify-center bg-cyan-500/10">
                  <svg className="w-6 h-6 text-cyan-400 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="font-mono text-cyan-400 text-lg tracking-widest text-center">
                  AWAITING TRANSMISSION SYNC<br/>
                  <span className="text-xs text-gray-500 tracking-normal mt-2 block">AVAILABLE GLOBALLY Q1 2026</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
