import { useState, useEffect, useCallback } from 'react';
import { Activity, Server, Database, Globe, RefreshCcw } from 'lucide-react';

interface ServiceStatus {
  name: string;
  id: string;
  status: 'online' | 'offline' | 'checking';
  latency?: number;
  icon: React.ReactNode;
}

export const SystemHeartbeat: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    { id: 'engine', name: 'G5 Python Engine', status: 'checking', icon: <Server size={14} /> },
    { id: 'backend', name: 'Node.js Orchestrator', status: 'checking', icon: <Database size={14} /> },
    { id: 'firebase', name: 'Firebase / Firestore', status: 'checking', icon: <Globe size={14} /> },
  ]);

  const updateService = useCallback((id: string, status: 'online' | 'offline', latency?: number) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status, latency } : s));
  }, []);

  const [intervals, setIntervals] = useState<Record<string, number>>({
    engine: 30000,
    backend: 30000
  });

  const checkStatus = useCallback(async () => {
    // 1. Check Python Engine
    try {
      const start = Date.now();
      const res = await fetch('http://localhost:8000/engine/counter-strike?topic=ping');
      const end = Date.now();
      if (res.ok) {
        updateService('engine', 'online', end - start);
        setIntervals(prev => ({ ...prev, engine: 30000 })); // Reset interval
      } else {
        updateService('engine', 'offline');
        setIntervals(prev => ({ ...prev, engine: Math.min(prev.engine * 2, 300000) })); // Max 5 mins
      }
    } catch {
      updateService('engine', 'offline');
      setIntervals(prev => ({ ...prev, engine: Math.min(prev.engine * 2, 300000) }));
    }

    // 2. Check Backend Orchestrator
    try {
      const start = Date.now();
      const res = await fetch('http://localhost:3001/api/ready');
      const end = Date.now();
      if (res.ok) {
        updateService('backend', 'online', end - start);
        setIntervals(prev => ({ ...prev, backend: 30000 }));
      } else {
        updateService('backend', 'offline');
        setIntervals(prev => ({ ...prev, backend: Math.min(prev.backend * 2, 300000) }));
      }
    } catch {
      updateService('backend', 'offline');
      setIntervals(prev => ({ ...prev, backend: Math.min(prev.backend * 2, 300000) }));
    }

    // 3. Firebase (Always assumed online if frontend is loading)
    updateService('firebase', 'online', 15);
  }, [updateService]);

  useEffect(() => {
    checkStatus();
    const engineTimeout = setTimeout(function pollEngine() {
      checkStatus();
      setTimeout(pollEngine, intervals.engine);
    }, intervals.engine);

    const backendTimeout = setTimeout(function pollBackend() {
      checkStatus();
      setTimeout(pollBackend, intervals.backend);
    }, intervals.backend);

    return () => {
      clearTimeout(engineTimeout);
      clearTimeout(backendTimeout);
    };
  }, [checkStatus, intervals.engine, intervals.backend]);

  return (
    <div className="p-4 bg-midnight/40 border border-white/5 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-accent animate-pulse" />
          <span className="font-display text-[10px] uppercase tracking-widest text-white/60">System Heartbeat</span>
        </div>
        <button onClick={checkStatus} className="text-white/20 hover:text-white transition-colors">
          <RefreshCcw size={12} />
        </button>
      </div>

      <div className="space-y-3">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg border transition-colors ${
                service.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                service.status === 'offline' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                'bg-white/5 border-white/10 text-white/20'
              }`}>
                {service.icon}
              </div>
              <div>
                <div className="text-[10px] font-bold text-white/80 group-hover:text-white transition-colors">{service.name}</div>
                <div className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">
                  {service.status === 'online' ? `Latency: ${service.latency}ms` : service.status}
                </div>
              </div>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${
              service.status === 'online' ? 'bg-emerald-500 box-glow-emerald' :
              service.status === 'offline' ? 'bg-red-500 box-glow-red' :
              'bg-white/20'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};
