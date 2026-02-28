import { useState, useCallback, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polyline } from '@react-google-maps/api';
import { motion } from 'framer-motion';
import { Radar, Shield, Activity, Globe, Terminal, Layers, RefreshCw } from 'lucide-react';
import { useCounterStrike } from '../../hooks/useCounterStrike';
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
    { elementType: "geometry", stylers: [{ color: "#12022b" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#00e5ff" }] },
    { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#0a0118" }] },
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
  { id: 'RA01', type: 'agent', name: 'SECURITY SENATE', role: 'Auditor', status: 'VERIFYING', lat: 48.140, lng: 11.585 },
  { id: 'BA07', type: 'agent', name: 'BROWSER', role: 'Researcher', status: 'SCANNING', lat: 48.132, lng: 11.590 },
  { id: 'GCP_01', type: 'infrastructure', name: 'GCP-EUROPE-WEST1', status: 'HEALTHY', lat: 48.125, lng: 11.560 },
];

export function GlobalRadarConsole() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "",
  });

  const [, setMap] = useState<google.maps.Map | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<TacticalEntity | null>(null);
  const [activeStrikes, setActiveStrikes] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const { data, loading, analyzeTopic } = useCounterStrike();
  const [topic, setTopic] = useState("");

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
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
      addLog(`[SYSTEM] DETECTED ${data.overlap.length} COMPETITOR OVERLAPS IN SECTOR.`);
    }
  }, [data, addLog]);

  const mapEntities = useMemo(() => {
    const dynamicCompetitors = data?.overlap?.map((comp, idx) => ({
      id: `COMP_${idx}`,
      type: 'competitor' as const,
      name: comp.competitor,
      role: 'Infiltrated Topic',
      status: 'DETECTED',
      lat: CENTER.lat + (Math.sin(idx * 2) * 0.02),
      lng: CENTER.lng + (Math.cos(idx * 2) * 0.02),
      threatLevel: 80 + ((idx * 7) % 15)
    })) || [];
    return [...BASE_ENTITIES, ...dynamicCompetitors];
  }, [data]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    console.log("Tactical Map Loaded Successfully");
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
    }, 4000);
  };

  useEffect(() => {
    addLog("Tactical Command Center Initialized.");
  }, [addLog]);

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden p-2">
      <div className="flex items-center justify-between shrink-0 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-accent/10 border border-accent/20">
            <Radar size={20} className="text-accent animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-display text-xl uppercase tracking-tighter">Strategic Radar Console</h2>
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-[0.2em]">Global Control Plane // Counter-Strike Mode ACTIVE</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <form onSubmit={handleSearch} className="flex gap-2 mr-4">
             <div className="relative">
               <input 
                 type="text" 
                 value={topic}
                 onChange={e => setTopic(e.target.value)}
                 placeholder="Analyze competitor topic..."
                 className="w-64 bg-white/5 border border-white/10 rounded px-3 py-1 text-xs font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-accent transition-all"
                 disabled={loading}
               />
               {loading && <RefreshCw size={12} className="absolute right-2 top-1.5 text-accent animate-spin" />}
             </div>
             <button 
               type="submit" 
               className="bg-accent/20 border border-accent/40 text-accent px-3 py-1 rounded text-[10px] font-black uppercase hover:bg-accent hover:text-black transition-colors"
               disabled={loading}
             >
               Scan
             </button>
           </form>
           <div className="flex gap-1">
             <span className="badge badge-online">Grid Active</span>
             <span className="badge badge-processing">8 Agents Linked</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Main Tactical Map */}
        <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 glass shadow-2xl">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={CENTER}
              zoom={14}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={MAP_OPTIONS}
            >
              {mapEntities.map(entity => (
                <Marker
                  key={entity.id}
                  position={{ lat: entity.lat, lng: entity.lng }}
                  onClick={() => setSelectedEntity(entity)}
                  options={{
                    icon: {
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: entity.type === 'agent' ? '#00e5ff' : entity.type === 'competitor' ? '#ff007a' : '#ffd700',
                      fillOpacity: 0.8,
                      scale: 10,
                      strokeColor: '#fff',
                      strokeWeight: 2,
                    },
                  }}
                />
              ))}

              {/* Dynamic Strike Paths */}
              {activeStrikes.map(strikeId => {
                const target = mapEntities.find(e => e.id === strikeId);
                if (!target) return null;
                return (
                  <Polyline
                    key={`strike-${strikeId}`}
                    path={[CENTER, { lat: target.lat, lng: target.lng }]}
                    options={{
                      strokeColor: '#ff007a',
                      strokeOpacity: 0.8,
                      strokeWeight: 2,
                      icons: [{
                        icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 4 },
                        offset: '0',
                        repeat: '20px'
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
                  <div className="p-2 text-midnight min-w-[150px]">
                    <h4 className="font-display font-black text-sm uppercase">{selectedEntity.name}</h4>
                    <p className="font-mono text-[9px] uppercase text-black/60">{selectedEntity.role || selectedEntity.status}</p>
                    {selectedEntity.type === 'competitor' && (
                      <button 
                        onClick={() => triggerStrike(selectedEntity.id)}
                        className="mt-2 w-full bg-magenta text-white py-1 text-[10px] font-black uppercase rounded"
                      >
                        ⚡ Deploy Strike
                      </button>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <RefreshCw className="animate-spin text-accent" size={32} />
              <span className="ml-3 font-mono text-xs uppercase tracking-widest">Synchronizing Satellite Uplink...</span>
            </div>
          )}

          {/* Map Overlay HUD */}
          <div className="absolute top-4 left-4 pointer-events-none space-y-2">
             <HUDBlock icon={<Globe size={12}/>} label="LATITUDE" value="48.1351 N" />
             <HUDBlock icon={<Activity size={12}/>} label="SIGNAL" value="98.2%" />
          </div>
          
          <div className="absolute bottom-4 right-4 z-10">
             <div className="glass p-3 rounded-xl border border-white/10 space-y-3 min-w-[180px]">
                <h4 className="font-mono text-[10px] font-black uppercase text-accent/60 flex items-center gap-2">
                   <Layers size={12}/> Layer Control
                </h4>
                <div className="space-y-1.5">
                   {['Agent Traces', 'Threat Heatmap', 'Infrastructure Mesh'].map(layer => (
                     <div key={layer} className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-mono text-white/40 uppercase">{layer}</span>
                        <div className="w-6 h-3 rounded-full bg-accent/20 border border-accent/40 relative">
                           <div className="absolute right-0.5 top-0.5 w-2 h-2 rounded-full bg-accent" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Tactical Feed & Intelligence Sidebar */}
        <div className="w-80 flex flex-col gap-4">
          <div className="glass-card flex-1 p-5 flex flex-col overflow-hidden">
            <h3 className="font-display text-sm uppercase mb-4 flex items-center gap-2">
              <Terminal size={14} className="text-accent" /> Intelligence Feed
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px]">
              {logs.map((log, i) => (
                <div key={i} className={`p-2 rounded bg-white/2 border-l-2 ${log.includes('NEUTRALIZED') ? 'border-magenta text-magenta' : 'border-accent text-white/60'}`}>
                  {log}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Threat Level</span>
                  <span className="text-[10px] font-mono text-magenta">STRICT-04</span>
               </div>
               <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['40%', '70%', '60%'] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-full bg-magenta shadow-[0_0_10px_rgba(255,0,122,0.5)]" />
               </div>
            </div>
          </div>

          <div className="glass-card p-5 h-40">
             <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-emerald" />
                <h3 className="font-display text-xs uppercase">Sovereign Protection</h3>
             </div>
             <p className="text-[10px] font-mono text-white/30 leading-relaxed italic">
               Nexus-Sovereignty protocols active. Defensive perimeter established around Munich Node-01.
             </p>
             <div className="mt-4 flex gap-2">
                <button className="flex-1 bg-white/5 border border-white/10 py-1.5 text-[9px] font-black uppercase hover:bg-white/10 transition-colors">Abort</button>
                <button className="flex-1 bg-emerald/20 border border-emerald/50 text-emerald py-1.5 text-[9px] font-black uppercase">Refresh</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HUDBlock({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="glass px-3 py-1.5 rounded border border-white/5 flex items-center gap-3">
       <div className="text-accent/40">{icon}</div>
       <div>
         <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{label}</div>
         <div className="text-[10px] font-mono text-accent font-black">{value}</div>
       </div>
    </div>
  );
}
