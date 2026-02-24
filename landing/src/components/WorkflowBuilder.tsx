import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type Connection, type NodeChange, type EdgeChange, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitMerge, Plus, Bot, Calendar, Play, Save, Trash2, Activity, Zap } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { ExportMenu } from './ui';
import { downloadJSON } from '../utils/export';

interface NodeData {
  title: string;
  config: string;
  agentId?: string;
}

const getAgentColor = (id?: string) => {
  const colors: Record<string, string> = {
    'sn00': '#00E5FF', 'sp01': '#7B2FBE', 'cc06': '#FF007A',
    'da03': '#FFD700', 'ra01': '#00FF88', 'prom07': '#00E5FF',
    'ba07': '#f59e0b', 've01': '#ef4444'
  };
  return id ? colors[id] || '#00E5FF' : '#00E5FF';
};

function TriggerNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`glass p-4 min-w-[200px] transition-all border-2 ${selected ? 'border-neural-gold glow-gold' : 'border-white/5 bg-obsidian/40'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded bg-neural-gold/10">
          <Calendar size={16} className="text-neural-gold" />
        </div>
        <span className="font-display text-sm font-black uppercase tracking-widest text-neural-gold">{data.title}</span>
      </div>
      <p className="font-mono text-[10px] text-white/40 leading-relaxed">{data.config}</p>
      <Handle type="source" position={Position.Bottom} className="bg-neural-gold! border-neural-gold/30! w-3! h-3!" />
    </div>
  );
}

function AgentNode({ data, selected }: { data: NodeData; selected: boolean }) {
  const color = getAgentColor(data.agentId);
  const geniusScore = useMemo(() => {
    // Stable score based on content length + base offset
    const seed = (data.title?.length || 0) + (data.agentId?.length || 0);
    return (88 + (seed % 11)).toFixed(1);
  }, [data.title, data.agentId]);
  
  return (
    <div className={`glass p-4 min-w-[220px] transition-all border-2 ${selected ? 'glow-cyan' : 'border-white/5 bg-obsidian/40'}`}
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}>
      <Handle type="target" position={Position.Top} className="bg-neural-blue! border-neural-blue/30! w-3! h-3!" />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-white/5" style={{ color }}>
            {data.agentId === 'prom07' ? <Activity size={16} /> : <Bot size={16} />}
          </div>
          <span className="font-display text-sm font-black uppercase tracking-widest" style={{ color }}>{data.agentId || 'Agent'}</span>
        </div>
        <div className="text-[10px] font-mono font-bold text-accent/60 flex items-center gap-1">
          <Zap size={10} className="text-accent" /> {geniusScore}
        </div>
      </div>
      <p className="font-display text-xs font-bold text-white/90 mb-1 uppercase tracking-tight">{data.title}</p>
      <div className="flex items-center justify-between mt-3">
        <p className="font-mono text-[9px] text-white/30 leading-relaxed max-w-xs truncate">{data.config}</p>
        <div className="px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[7px] font-mono text-white/20 uppercase tracking-tighter">
          Context Sync Active
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="bg-neural-blue! border-neural-blue/30! w-3! h-3!" />
    </div>
  );
}

function ActionNode({ data, selected }: { data: NodeData; selected: boolean }) {
  return (
    <div className={`glass p-4 min-w-[200px] transition-all border-2 ${selected ? 'border-emerald-500/50 glow-emerald' : 'border-white/5 bg-obsidian/40'}`}>
      <Handle type="target" position={Position.Top} className="bg-emerald-500! border-emerald-500/30! w-3! h-3!" />
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded bg-emerald-500/10">
          <Play size={16} className="text-emerald-500" />
        </div>
        <span className="font-display text-sm font-black uppercase tracking-widest text-emerald-500">{data.title}</span>
      </div>
      <p className="font-mono text-[10px] text-white/40 leading-relaxed">{data.config}</p>
    </div>
  );
}

const initialNodes: Node[] = [
  { id: '1', type: 'triggerNode', position: { x: 250, y: 50 }, data: { title: 'Intelligence Trigger', config: 'Persistent Market Monitoring' } },
  { id: '2', type: 'agentNode', position: { x: 100, y: 200 }, data: { title: 'Deep Research', config: 'Prometheus ground-scavenge mode', agentId: 'prom07' } },
  { id: '3', type: 'agentNode', position: { x: 400, y: 200 }, data: { title: 'Strategic Synthesis', config: 'Generate disruptive brief', agentId: 'sp01' } },
  { id: '4', type: 'agentNode', position: { x: 400, y: 380 }, data: { title: 'Cinema Forge', config: 'Synthesize motion assets', agentId: 've01' } },
  { id: '5', type: 'actionNode', position: { x: 250, y: 540 }, data: { title: 'Neural Deployment', config: 'Push to Nexus World State' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#00E5FF', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#7B2FBE', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#FF007A', strokeWidth: 2 } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#00B8D4', strokeWidth: 2 } },
];

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const nodeTypes = useMemo(() => ({
    triggerNode: TriggerNode,
    agentNode: AgentNode,
    actionNode: ActionNode,
  }), []);

  const onNodesChange = useCallback((changes: NodeChange[]) =>
    setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) =>
    setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((conn: Connection) =>
    setEdges(eds => addEdge({ ...conn, animated: true, style: { stroke: '#00E5FF', strokeWidth: 2 } }, eds)), []);

  const addNode = (type: 'triggerNode' | 'agentNode' | 'actionNode') => {
    const agents = ['sn00', 'sp01', 'cc06', 'da03', 'ra01', 'prom07', 'ba07', 've01'];
    const id = String(nodes.length + 1);
    const titles: Record<string, string> = {
      triggerNode: 'New Trigger',
      agentNode: 'Agent Task',
      actionNode: 'Action Step',
    };
    const configs: Record<string, string> = {
      triggerNode: 'Manual directive trigger...',
      agentNode: 'Autonomous work sequence...',
      actionNode: 'Final deployment step...',
    };
    const newNode: Node = {
      id,
      type,
      position: { x: 200 + Math.random() * 200, y: 100 + Math.random() * 300 },
      data: {
        title: titles[type],
        config: configs[type],
        agentId: type === 'agentNode' ? agents[Math.floor(Math.random() * agents.length)] : undefined,
      },
    };
    setNodes(prev => [...prev, newNode]);
  };

  const [simulateResult, setSimulateResult] = useState<string | null>(null);

  const simulateWorkflow = async () => {
    setIsSimulating(true);
    setSimulateResult(null);
    try {
      const workflowData = {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
        edges: edges.map(e => ({ source: e.source, target: e.target })),
      };
      const res = await fetch(`${API_BASE_URL}/workflows/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulateResult(data.message || 'Workflow dispatched successfully.');
      } else {
        setSimulateResult('Dispatch failed — check agent connectivity.');
      }
    } catch {
      setSimulateResult('Network error — backend offline.');
    }
    setTimeout(() => { setIsSimulating(false); setSimulateResult(null); }, 5000);
  };

  const handleDeploy = async () => {
    setDeployStatus('deploying');
    try {
      const workflowData = {
        nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
        edges: edges.map(e => ({ source: e.source, target: e.target })),
      };
      const res = await fetch(`${API_BASE_URL}/api/workflows/deploy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData),
      });
      setDeployStatus(res.ok ? 'success' : 'error');
      // Persist to localStorage on successful deploy
      if (res.ok) {
        localStorage.setItem('g5_workflow', JSON.stringify(workflowData));
      }
    } catch {
      setDeployStatus('error');
    }
    setTimeout(() => setDeployStatus('idle'), 3000);
  };

  // Load workflow from localStorage on mount
  useState(() => {
    try {
      const saved = localStorage.getItem('g5_workflow');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.nodes?.length) {
          setNodes(data.nodes.map((n: Node) => ({
            ...n,
            position: n.position || { x: 200, y: 150 },
          })));
          setEdges(data.edges || []);
        }
      }
    } catch { /* ignore corrupted data */ }
  });

  const clearAll = () => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem('g5_workflow');
  };

  return (
    <div className="h-full flex flex-col animate-in">
      {/* Toolbar */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-surface-overlay/50">
        <div className="flex items-center gap-3">
          <GitMerge size={20} className="text-accent" />
          <h2 className="font-display text-xl font-bold uppercase tracking-tight">Workflow Builder</h2>
          <span className="label text-white/20 mt-0.5">Visual DAG Editor</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Add Nodes */}
          <div className="flex items-center gap-1 mr-4">
            <button onClick={() => addNode('triggerNode')} className="btn-outline text-[10px] py-1.5 px-3 flex items-center gap-1">
              <Calendar size={10} className="text-gold" /> <Plus size={10} /> Trigger
            </button>
            <button onClick={() => addNode('agentNode')} className="btn-outline text-[10px] py-1.5 px-3 flex items-center gap-1">
              <Bot size={10} className="text-accent" /> <Plus size={10} /> Agent
            </button>
            <button onClick={() => addNode('actionNode')} className="btn-outline text-[10px] py-1.5 px-3 flex items-center gap-1">
              <Play size={10} className="text-emerald" /> <Plus size={10} /> Action
            </button>
            <ExportMenu options={[
              { label: 'JSON Workflow', format: 'JSON', onClick: () => downloadJSON({ nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data, position: n.position })), edges }, `G5_Workflow_${Date.now()}`) },
            ]} />
          </div>

          {/* Actions */}
          <button onClick={simulateWorkflow} disabled={isSimulating}
            className={`btn-outline text-[10px] py-1.5 px-4 flex items-center gap-1 ${isSimulating ? 'border-accent/50 text-accent' : ''}`}>
            <Play size={10} /> {isSimulating ? 'Simulating...' : 'Simulate'}
          </button>
          <button onClick={handleDeploy}
            className={`btn-primary text-[10px] py-1.5 px-4 flex items-center gap-1 ${
              deployStatus === 'success' ? 'bg-emerald! text-midnight!' : deployStatus === 'error' ? 'bg-magenta! text-white!' : ''
            }`}>
            <Save size={10} />
            {deployStatus === 'deploying' ? 'Deploying...' : deployStatus === 'success' ? 'Deployed ✓' : deployStatus === 'error' ? 'Failed ✕' : 'Deploy'}
          </button>
          <button onClick={clearAll} className="btn-outline text-[10px] py-1.5 px-3 text-magenta border-magenta/30 hover:bg-magenta/10">
            <Trash2 size={10} />
          </button>
        </div>
      </div>

      {/* Simulate Result Banner */}
      {simulateResult && (
        <div className="px-4 py-2 bg-accent/10 border-b border-accent/20 font-mono text-xs text-accent flex items-center gap-2">
          <Play size={10} /> {simulateResult}
        </div>
      )}

      {/* ReactFlow Canvas */}
      <div className="flex-1 relative" style={{ minHeight: '600px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{ animated: true }}
          style={{ background: 'transparent' }}
        >
          <Background color="rgba(255,255,255,0.03)" gap={20} size={1} />
          <Controls
            showInteractive={false}
            style={{ background: 'rgba(10,1,24,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
          />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'triggerNode') return '#FFD700';
              if (n.type === 'actionNode') return '#00FF88';
              return getAgentColor((n.data as unknown as NodeData)?.agentId);
            }}
            style={{ background: 'rgba(10,1,24,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            maskColor="rgba(10,1,24,0.5)"
          />
        </ReactFlow>

        {/* Simulation Overlay */}
        {isSimulating && (
          <div className="absolute inset-0 bg-midnight/50 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
            <div className="glass-card p-8 text-center pointer-events-auto">
              <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="font-display text-lg font-bold uppercase tracking-tight text-accent">Simulating Workflow</p>
              <p className="font-mono text-xs text-white/30 mt-2">Running all agent nodes in parallel...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
