import { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline, Circle } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Radar, Shield, Activity, Globe, Terminal, Layers, RefreshCw, Zap, Search, Database } from 'lucide-react';
import { useCounterStrike } from '../../hooks/useCounterStrike';
import { API_BASE_URL } from '../../config';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '100%',
};

const CENTER = {
  lat: 48.1351, // Munich (G5 HQ)
  lng: 11.5820,
};

// Cyber-Obsidian Map Style (Custom JSON)
const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0a0118" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#00e5ff" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#05000a" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#1d0e3a" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2d1354" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d1b7a" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d0121" }] },
  ],
};

interface TacticalEntity {
  id: string;
  type: 'agent' | 'competitor' | 'infrastructure';
  name: string;
  role?: string;
  status: string;
  lat: number;
  lng: number;
  threatLevel?: number;
}

const BASE_ENTITIES: TacticalEntity[] = [
  { id: 'SN00', type: 'agent', name: 'NEXUS PRIME', role: 'Orchestrator', status: 'ONLINE', lat: 48.137, lng: 11.575 },
  { id: 'RA01', type: 'agent', name: 'SECURITY SENATE', role: 'Regulatory Arbiter', status: 'VERIFYING', lat: 48.140, lng: 11.585 },
  { id: 'CC06', type: 'agent', name: 'CREATIVE CATALYST', role: 'Storyteller', status: 'FORGING', lat: 48.145, lng: 11.570 },
  { id: 'VE01', type: 'agent', name: 'CINE DIRECTOR', role: 'Visual Synthesis', status: 'RENDERING', lat: 48.150, lng: 11.580 },
  { id: 'DA03', type: 'agent', name: 'DESIGN ARCHITECT', role: 'UX/UI Synthesis', status: 'STYLING', lat: 48.130, lng: 11.565 },
  { id: 'SP01', type: 'agent', name: 'STRATEGIC PLANNER', role: 'PMax Architect', status: 'OPTIMIZING', lat: 48.135, lng: 11.600 },
  { id: 'MI01', type: 'agent', name: 'MARKET INTEL', role: 'Data Harvester', status: 'SCANNING', lat: 48.120, lng: 11.590 },
  { id: 'BA07', type: 'agent', name: 'BROWSER AGENT', role: 'Web Explorer', status: 'CRAWLING', lat: 48.125, lng: 11.575 },
  { id: 'PM07', type: 'agent', name: 'PROACTIVE MANAGER', role: 'Workflow Guard', status: 'MONITORING', lat: 48.142, lng: 11.560 },
  { id: 'GCP_01', type: 'infrastructure', name: 'GCP-EUROPE-WEST1', status: 'HEALTHY', lat: 48.125, lng: 11.560 },
];

export function GlobalRadarConsole() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [mapInstance, setMap] = useState<google.maps.Map | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<TacticalEntity | null>(null);
  const [activeStrikes, setActiveStrikes] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [vaultUsage, setVaultUsage] = useState<{ formatted: string; fileCount: number; gb: number } | null>(null);
  const [neuralSignal, setNeuralSignal] = useState(99.9);

  // Fluctuating neural signal for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralSignal(prev => {
        const delta = (Math.random() - 0.5) * 0.2;
        return Math.min(Math.max(prev + delta, 98.5), 100);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const { data, loading, analyzeTopic } = useCounterStrike();
  const [topic, setTopic] = useState("");

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 15));
  }, []);

  // Fetch real vault telemetry from the new endpoint
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/vault/usage`);
        const json = await res.json();
        if (json.status === 'ok') setVaultUsage(json);
      } catch (err) {
        console.error("Failed to fetch vault telemetry", err);
      }
    };
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(topic.trim()) {
      addLog(`[SYSTEM] SCANNING NEURAL FABRIC FOR TOPIC: ${topic.toUpperCase()}...`);
      analyzeTopic(topic);
    }
  };

  useEffect(() => {
    if (data?.overlap?.length) {
      const timer = setTimeout(() => {
        addLog(`[CRITICAL] DETECTED ${data.overlap.length} COMPETITOR OVERLAPS IN SECTOR.`);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, addLog]);

  const mapEntities = useMemo(() => {
    const dynamicCompetitors = data?.overlap?.map((comp, idx) => ({
      id: `COMP_${idx}`,
      type: 'competitor' as const,
      name: comp.competitor,
      role: 'Infiltrated Topic',
      status: 'DETECTED',
      lat: CENTER.lat + (Math.sin(idx * 2) * 0.02) + (Math.sin(idx * 100) * 0.002),
      lng: CENTER.lng + (Math.cos(idx * 2) * 0.02) + (Math.cos(idx * 100) * 0.002),
      threatLevel: 80 + ((idx * 7) % 15)
    })) || [];
    return [...BASE_ENTITIES, ...dynamicCompetitors];
  }, [data]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const triggerStrike = (entityId: string) => {
    setActiveStrikes(prev => [...prev, entityId]);
    addLog(`INITIALIZING SEO STRIKE ON ${entityId}...`);
    setTimeout(() => {
      setActiveStrikes(prev => prev.filter(id => id !== entityId));
      addLog(`TARGET ${entityId} NEUTRALIZED. DOMAINS DECOMPILED.`);
      addLog(`[ACTION] INJECTING G5 CANONICAL LINKS INTO TARGET INFRASTRUCTURE.`);
    }, 4500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      addLog("Tactical Command Center Initialized.");
      addLog("Neural G5 Uplink Established.");
    }, 500);
    return () => clearTimeout(timer);
  }, [addLog]);

  const [layers, setLayers] = useState({
    neuralTraces: true,
    threatHeatmap: true,
    networkFabric: false
  });

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    addLog(`[SYSTEM] ${layer.toUpperCase()} LAYER ${!layers[layer] ? 'ACTIVATED' : 'DEACTIVATED'}`);
  };

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden p-2 relative">
      {/* Background Scanning Overlay (Global) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#00e5ff_0%,transparent_70%)] opacity-20" />
         <div className="scanning-line" />
      </div>

      <div className="flex items-center justify-between shrink-0 mb-2 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/10 border border-accent/30 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Radar size={20} className="text-accent animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tighter italic">Strategic Radar Console</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_#10b981]" />
              <p className="font-mono text-[9px] text-white/50 uppercase tracking-[0.2em]">Cyber-Command Node v5.2 // COUNTER-STRIKE ACTIVE</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <form onSubmit={handleSearch} className="flex gap-2 mr-4 group">
             <div className="relative">
               <input 
                 type="text" 
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 placeholder="Search threat topic..."
                 className="w-72 bg-obsidian-900/80 border border-white/10 rounded px-4 py-1.5 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all"
                 disabled={loading}
               />
               <Search size={12} className="absolute right-3 top-2.5 text-white/10 group-focus-within:text-accent transition-colors" />
               {loading && <RefreshCw size={12} className="absolute right-8 top-2.5 text-accent animate-spin" />}
             </div>
             <button 
               type="submit" 
               className="bg-accent/10 border border-accent/40 text-accent px-4 py-1.5 rounded text-[10px] font-black uppercase hover:bg-accent hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
               disabled={loading}
             >
               Scan Fabric
             </button>
           </form>
           <div className="flex gap-1">
             <div className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-[9px] text-white/40 uppercase">Grid: Operational</div>
             <div className="px-2 py-1 bg-accent/5 border border-accent/20 rounded font-mono text-[9px] text-accent uppercase animate-pulse">{BASE_ENTITIES.filter(e => e.type === 'agent').length} Agents Synced</div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0 z-10">
        {/* Main Tactical Map Container */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 glass-card shadow-2xl flex flex-col">
          
          <div className="flex-1 relative">
            {loadError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-900/90 text-center p-8 backdrop-blur-md">
                <div className="w-20 h-20 rounded-full border-2 border-magenta/20 flex items-center justify-center mb-6 animate-pulse">
                  <Shield size={40} className="text-magenta" />
                </div>
                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tighter mb-2">Satellite Uplink Denied</h3>
                <p className="font-mono text-[10px] text-white/30 max-w-sm uppercase leading-relaxed tracking-widest">
                  Authentication failure in Google Cloud Substrate. Activate <strong>Maps JavaScript API</strong> and authorize origin <code>*.web.app/*</code> in GCP Console.
                </p>
                <div className="mt-8 px-4 py-1 border border-magenta/20 rounded-full font-mono text-[8px] text-magenta animate-pulse uppercase">Tactical Fallback Active</div>
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={CENTER}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={MAP_OPTIONS}
              >
                {/* Tactical Overlays (Heatmap) */}
                {layers.threatHeatmap && mapEntities.filter(e => e.type === 'competitor').map(entity => (
                  <Circle
                    key={`heatmap-${entity.id}`}
                    center={{ lat: entity.lat, lng: entity.lng }}
                    radius={500}
                    options={{
                      fillColor: '#ff007a',
                      fillOpacity: 0.15,
                      strokeColor: '#ff007a',
                      strokeOpacity: 0.3,
                      strokeWeight: 1,
                    }}
                  />
                ))}

                {/* Neural Traces (UPLINK) */}
                {layers.neuralTraces && mapEntities.filter(e => e.type === 'agent').map(agent => (
                  <Polyline
                    key={`uplink-${agent.id}`}
                    path={[{ lat: agent.lat, lng: agent.lng }, CENTER]}
                    options={{
                      strokeColor: '#00e5ff',
                      strokeOpacity: 0.15,
                      strokeWeight: 1,
                      icons: [{
                        icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.5, scale: 2, strokeColor: '#00e5ff' },
                        offset: '0',
                        repeat: '20px'
                      }]
                    }}
                  />
                ))}

                {/* Network Fabric (Inter-Agent Mesh) */}
                {layers.networkFabric && mapEntities.filter(e => e.type === 'agent').map((agent, idx, arr) => {
                  if (idx === arr.length - 1) return null;
                  return (
                    <Polyline
                      key={`fabric-${agent.id}-${idx}`}
                      path={[{ lat: agent.lat, lng: agent.lng }, { lat: arr[idx + 1].lat, lng: arr[idx + 1].lng }]}
                      options={{
                        strokeColor: '#00e5ff',
                        strokeOpacity: 0.2,
                        strokeWeight: 1,
                      }}
                    />
                  );
                })}

                {mapEntities.map(entity => (
                  <Marker
                    key={entity.id}
                    position={{ lat: entity.lat, lng: entity.lng }}
                    onClick={() => setSelectedEntity(entity)}
                    options={{
                      icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        fillColor: entity.type === 'agent' ? '#00e5ff' : entity.type === 'competitor' ? '#ff007a' : '#ffd700',
                        fillOpacity: 0.9,
                        scale: selectedEntity?.id === entity.id ? 14 : 9,
                        strokeColor: '#fff',
                        strokeWeight: 2,
                      },
                    }}
                  />
                ))}

                {/* Tactical Overlays on Map */}
                {activeStrikes.map(strikeId => {
                  const target = mapEntities.find(e => e.id === strikeId);
                  if (!target) return null;
                  return (
                    <Polyline
                      key={`strike-${strikeId}`}
                      path={[CENTER, { lat: target.lat, lng: target.lng }]}
                      options={{
                        strokeColor: '#ff007a',
                        strokeOpacity: 0.9,
                        strokeWeight: 3,
                        icons: [{
                          icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4, strokeColor: '#fff' },
                          offset: '0',
                          repeat: '15px'
                        }]
                      }}
                    />
                  );
                })}

                {selectedEntity && (
                  <InfoWindow
                    position={{ lat: selectedEntity.lat, lng: selectedEntity.lng }}
                    onCloseClick={() => setSelectedEntity(null)}
                  >
                    <div className="p-3 text-midnight min-w-[180px] bg-white rounded shadow-2xl">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-display font-black text-sm uppercase tracking-tighter">{selectedEntity.name}</h4>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded text-white font-black ${selectedEntity.type === 'agent' ? 'bg-accent' : selectedEntity.type === 'competitor' ? 'bg-magenta' : 'bg-gold'}`}>
                          {selectedEntity.type}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] uppercase text-black/40 mb-3 border-b border-black/5 pb-2">Status: <span className="text-black font-bold">{selectedEntity.status}</span></p>
                      {selectedEntity.type === 'competitor' && (
                        <button 
                          onClick={() => triggerStrike(selectedEntity.id)}
                          className="w-full bg-magenta text-white py-1.5 text-[10px] font-black uppercase rounded shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Zap size={12} /> Deploy Counter-Strike
                        </button>
                      )}
                      {selectedEntity.type === 'agent' && (
                        <div className="text-[9px] font-mono leading-relaxed text-black/60 italic">
                          Neural integrity nominal. Synchronized with G5 Hive Mind.
                        </div>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian-900/60 backdrop-blur-sm">
                <RefreshCw className="animate-spin text-accent mb-4" size={48} />
                <span className="font-display text-lg font-black uppercase tracking-[0.3em] text-white/80 animate-pulse">Initializing Cyber-Grid</span>
                <span className="mt-2 font-mono text-[9px] text-white/30 uppercase tracking-widest">Awaiting Command Link Authorization</span>
              </div>
            )}
          </div>

          {/* Map Overlay HUD (In-Map) */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-3">
             <HUDBlock icon={<Globe size={14}/>} label="VECTOR_ORIGIN" value="48.1351 N / 11.5820 E" />
             <HUDBlock icon={<Activity size={14}/>} label="NEURAL_SIGNAL" value={`${neuralSignal.toFixed(1)}% UPLINK`} />
             <HUDBlock 
              icon={<Database size={14}/>} 
              label="VAULT_STORAGE" 
              value={vaultUsage ? `${vaultUsage.formatted} / ${vaultUsage.fileCount} ASSETS` : "SYNCING..."} 
              accent 
             />
          </div>
          
          <div className="absolute bottom-6 left-6 pointer-events-none">
             <div className="glass p-4 rounded-xl border border-white/10 flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Hive Mind Load</span>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                        className={`w-1.5 h-3 rounded-sm ${i > 7 ? 'bg-magenta' : 'bg-emerald'}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Active Threads</span>
                  <span className="font-mono text-sm text-accent font-black tracking-tighter">1,204 K/TPS</span>
                </div>
             </div>
          </div>

          <div className="absolute bottom-6 right-6 z-10">
             <div className="glass-card p-4 rounded-2xl border border-white/15 space-y-4 min-w-[200px] shadow-2xl backdrop-blur-xl">
                <h4 className="font-display text-[11px] font-black uppercase text-accent flex items-center gap-2 tracking-widest">
                   <Layers size={14} className="animate-pulse" /> Tactical Layers
                </h4>
                <div className="space-y-3">
                   {[
                    { id: 'neuralTraces', label: 'Neural Traces', color: 'bg-accent' },
                    { id: 'threatHeatmap', label: 'Threat Heatmap', color: 'bg-magenta' },
                    { id: 'networkFabric', label: 'Network Fabric', color: 'bg-white/20' }
                   ].map(layer => {
                     const isActive = layers[layer.id as keyof typeof layers];
                     return (
                      <div key={layer.id} className="flex justify-between items-center px-1">
                          <span className={`text-[9px] font-mono uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-white/20'}`}>{layer.label}</span>
                          <div 
                            onClick={() => toggleLayer(layer.id as keyof typeof layers)}
                            className={`w-7 h-4 rounded-full border border-white/10 relative cursor-pointer transition-colors ${isActive ? 'bg-accent/10 border-accent/30' : 'bg-black/20'}`}
                          >
                            <motion.div 
                              animate={{ x: isActive ? 12 : 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className={`absolute top-0.5 left-0.5 w-2.5 h-2.5 rounded-full ${isActive ? layer.color : 'bg-white/10'}`} 
                            />
                          </div>
                      </div>
                     );
                   })}
                </div>
                <div className="pt-2 border-t border-white/5 flex gap-2">
                   <button
                     onClick={() => {
                       const blob = new Blob([logs.join('\n')], { type: 'text/plain' });
                       const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                       a.download = `G5_IntelLog_${Date.now()}.txt`; a.click();
                       URL.revokeObjectURL(a.href);
                       addLog('[SYSTEM] INTELLIGENCE LOG EXPORTED.');
                     }}
                     className="flex-1 py-1 bg-white/5 rounded text-[8px] font-black uppercase text-white/40 hover:bg-white/10 transition-colors">Export Map</button>
                   <button
                     onClick={() => { mapInstance?.panTo(CENTER); mapInstance?.setZoom(14); addLog('[SYSTEM] MAP RECENTERED TO HQ NODE.'); }}
                     className="flex-1 py-1 bg-accent/20 rounded text-[8px] font-black uppercase text-accent hover:bg-accent hover:text-black transition-colors">Center</button>
                </div>
             </div>
          </div>
        </div>

        {/* Tactical Feed & Intelligence Sidebar */}
        <div className="w-96 flex flex-col gap-4 min-h-0">
          <div className="glass-card flex-1 p-6 flex flex-col overflow-hidden border border-white/10 relative">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Terminal size={64} className="rotate-12" />
            </div>

            <h3 className="font-display text-base font-black uppercase mb-5 flex items-center gap-3 tracking-tighter">
              <Terminal size={18} className="text-accent animate-pulse" /> Intelligence Directives
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] pr-2 scrollbar-none custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className={`p-3 rounded-lg border-l-4 transition-all hover:bg-white/5 ${
                  log.includes('CRITICAL') || log.includes('NEUTRALIZED') 
                    ? 'bg-magenta/5 border-magenta text-magenta animate-pulse shadow-[0_0_10px_rgba(255,0,122,0.1)]' 
                    : 'bg-white/2 border-accent/40 text-white/70'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="opacity-40 text-[8px]">{log.match(/\[(.*?)\]/)?.[1] || "SYSTEM"}</span>
                    <span className="text-[7px] bg-white/5 px-1 rounded">SEC_L4</span>
                  </div>
                  {log.replace(/\[(.*?)\] /, "")}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
               <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-emerald font-black">Sovereignty Status</span>
                  <span className="text-white/30 animate-pulse">Scanning...</span>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between font-mono text-[9px] text-white/40 uppercase">
                    <span>Threat Containment</span>
                    <span>88%</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['80%', '92%', '88%'] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                      className="h-full bg-emerald shadow-[0_0_15px_#10b981]" />
                 </div>
               </div>
               <div className="space-y-2">
                 <div className="flex justify-between font-mono text-[9px] text-white/40 uppercase">
                    <span>Neural Integrity</span>
                    <span>100%</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="w-full h-full bg-accent shadow-[0_0_15px_#00e5ff]" />
                 </div>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-emerald/20 bg-emerald/5 flex flex-col justify-between">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald/20 flex items-center justify-center border border-emerald/40 animate-pulse">
                  <Shield size={18} className="text-emerald" />
                </div>
                <div>
                   <h3 className="font-display text-sm font-black uppercase tracking-tight">Sovereign Protection</h3>
                   <span className="font-mono text-[8px] text-emerald uppercase tracking-widest">Protocol: ABSOLUTE-GUARD</span>
                </div>
             </div>
             <p className="text-[10px] font-mono text-white/50 leading-relaxed italic my-4">
               "Autonome Verteidigungsalgorithmen sind aktiv. Der Cyber-Umkreis um den Münchener Kernknoten ist gesichert. Unautorisierte Infiltrationen werden sofort neutralisiert."
             </p>
             <div className="flex gap-2">
                <button
                  onClick={() => { setActiveStrikes([]); addLog('[SYSTEM] DE-ESCALATION PROTOCOL ENGAGED. ALL STRIKES ABORTED.'); }}
                  className="flex-1 bg-white/5 border border-white/10 py-2 text-[10px] font-black uppercase hover:bg-white/10 transition-all text-white/40 rounded-lg">De-Escalate</button>
                <button
                  onClick={() => { fetch(`${API_BASE_URL}/vault/usage`).then(r => r.json()).then(j => { if (j.status === 'ok') setVaultUsage(j); }).catch(() => {}); addLog('[SYSTEM] PERIMETER REFRESH INITIATED. VAULT TELEMETRY UPDATED.'); }}
                  className="flex-1 bg-emerald/10 border border-emerald/40 text-emerald py-2 text-[10px] font-black uppercase hover:bg-emerald hover:text-black transition-all rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]">Refresh Perimeter</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HUDBlock({ icon, label, value, accent }: { icon: React.ReactNode, label: string, value: string, accent?: boolean }) {
  return (
    <div className={`glass px-4 py-2.5 rounded-xl border border-white/5 flex items-center gap-4 min-w-[200px] shadow-lg backdrop-blur-md ${accent ? 'border-accent/20 bg-accent/5' : ''}`}>
       <div className={`${accent ? 'text-accent' : 'text-accent/40'} animate-pulse`}>{icon}</div>
       <div className="flex-1">
         <div className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em] mb-0.5">{label}</div>
         <div className={`text-[11px] font-mono ${accent ? 'text-accent' : 'text-white/80'} font-black tracking-tight`}>{value}</div>
       </div>
    </div>
  );
}
