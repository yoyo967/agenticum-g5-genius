import { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, MiniMap, addEdge, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type Connection, type NodeChange, type EdgeChange, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitMerge, Plus, Bot, Calendar, Play, Save, Settings, Trash2 } from 'lucide-react';

interface NodeData extends Record<string, unknown> {
  title: string;
  config: string;
  agentId?: string;
}

const getAgentColor = (id?: string) => {
  switch (id) {
    case 'sn-00': return 'text-neural-blue border-neural-blue/30 bg-neural-blue/10';
    case 'sp-01': return 'text-pink-500 border-pink-500/30 bg-pink-500/10';
    case 'cc-06': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
    case 'da-03': return 'text-neural-purple border-neural-purple/30 bg-neural-purple/10';
    case 'ra-01': return 'text-red-500 border-red-500/30 bg-red-500/10';
    default: return 'text-white/80 border-white/20 bg-white/5';
  }
};

const TriggerNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div className={`w-72 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex flex-col gap-3 group transition-all ${selected ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-pink-500/10' : 'border-green-500/30 bg-green-500/10'}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10 text-green-500">
          <Calendar size={14} />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">{data.title}</h3>
        </div>
      </div>
      <p className="text-[10px] font-mono opacity-80 text-green-400">{data.config}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-500 border-2 border-black" />
    </div>
  );
};

const AgentNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  const colorClass = getAgentColor(data.agentId);
  return (
    <div className={`w-72 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex flex-col gap-3 group transition-all ${selected ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-pink-500/10' : colorClass}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white border-2 border-black" />
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10 ${colorClass.split(" ")[0]}`}>
          <Bot size={14} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
             <h3 className="text-xs font-black uppercase tracking-widest text-white">{data.title}</h3>
             <span className="text-[8px] uppercase font-black px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-white/70">{data.agentId?.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-mono opacity-80 text-white/70">{data.config}</p>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white border-2 border-black" />
    </div>
  );
};

const ActionNode = ({ data, selected }: { data: NodeData; selected: boolean }) => {
  return (
    <div className={`w-72 p-4 rounded-xl border backdrop-blur-md shadow-2xl flex flex-col gap-3 group transition-all ${selected ? 'border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.3)] bg-pink-500/10' : 'border-neural-gold/30 bg-neural-gold/10'}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-neural-gold border-2 border-black" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center shrink-0 border border-white/10 text-neural-gold">
          <Settings size={14} />
        </div>
        <div className="flex-1">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">{data.title}</h3>
        </div>
      </div>
      <p className="text-[10px] font-mono opacity-80 text-neural-gold/80">{data.config}</p>
    </div>
  );
};

const initialNodes: Node[] = [
  { id: '1', type: 'triggerNode', position: { x: 250, y: 50 }, data: { title: 'Schedule Trigger', config: 'Every Monday @ 8:00 AM' } },
  { id: '2', type: 'agentNode', position: { x: 250, y: 200 }, data: { title: 'Market Research', agentId: 'sn-00', config: 'Analyze competitor pricing.' } },
  { id: '3', type: 'agentNode', position: { x: 250, y: 350 }, data: { title: 'LinkedIn Post Draft', agentId: 'cc-06', config: 'Write B2B LinkedIn post.' } },
  { id: '4', type: 'actionNode', position: { x: 250, y: 500 }, data: { title: 'Awaiting Boss Approval', config: 'Send to OS Portal' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } },
];

export function WorkflowBuilder() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isRunning, setIsRunning] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Define custom nodes
  const nodeTypes = useMemo(() => ({ triggerNode: TriggerNode, agentNode: AgentNode, actionNode: ActionNode }), []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } }, eds)),
    [],
  );

  const updateNodeData = (nodeId: string, newData: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const simulateWorkflow = () => {
    setIsRunning(true);
    // Simulate frontend visual testing
    setTimeout(() => {
      setIsRunning(false);
    }, 4500);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch('/api/workflow/deploy', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ nodes, edges })
      });
      if (!response.ok) throw new Error('Deploy Failed');
      console.log('Workflow Deployed to Cluster!');
      
      // Also tell the UI that an active external sequence is running
      window.dispatchEvent(new CustomEvent('trigger-orchestration', { 
        detail: { input: 'Executing Deployed Graph Workflow.', workflowId: 'Visual Builder Engine' } 
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsDeploying(false), 2000);
    }
  };

  const selectedNode = nodes.find(n => n.selected);

  return (
    <div className="h-full flex flex-col border border-white/5 rounded-2xl bg-black/20 glass overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40 shrink-0 z-20">
        <div>
           <h2 className="text-2xl font-display font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
             <GitMerge size={24} className="text-pink-500" />
             Automated Workflows
           </h2>
           <p className="text-white/40 font-light text-xs mt-1">Design End-To-End Agency Operations</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            disabled={isRunning}
            onClick={simulateWorkflow}
            className="flex items-center gap-2 bg-pink-500/20 text-pink-500 px-4 py-2 rounded-lg text-[10px] font-black hover:bg-pink-500 hover:text-white transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
          >
            <Play size={14} className={isRunning ? "animate-pulse" : ""} />
            {isRunning ? 'Autopilot Engaged...' : 'Test Sequence'}
          </button>
          <button 
             onClick={handleDeploy}
             disabled={isDeploying}
             className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black hover:bg-white/20 transition-all uppercase tracking-widest border border-white/10 shadow-lg disabled:opacity-50"
          >
            <Save size={14} className={isDeploying ? 'animate-pulse' : ''} />
            {isDeploying ? 'Deploying...' : 'Deploy to Cluster'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Node Canvas (React Flow) */}
        <div className="w-2/3 h-full border-r border-white/5 bg-black/60 relative">
             <ReactFlow
               nodes={nodes}
               edges={edges}
               onNodesChange={onNodesChange}
               onEdgesChange={onEdgesChange}
               onConnect={onConnect}
               nodeTypes={nodeTypes}
               fitView
               className="react-flow-dark"
               minZoom={0.2}
               maxZoom={2}
               defaultEdgeOptions={{ animated: true, style: { stroke: '#ec4899', strokeWidth: 2 } }}
             >
               <Background color="#ffffff" gap={16} size={1} className="opacity-[0.03]" />
               <Controls className="fill-white [&>button]:bg-black/80 [&>button]:border-white/10 [&>button]:text-white hover:[&>button]:bg-white/10" />
               <MiniMap 
                 nodeColor={(n) => {
                   if (n.type === 'triggerNode') return '#22c55e';
                   if (n.type === 'actionNode') return '#eab308';
                   return '#3b82f6';
                 }}
                 maskColor="rgba(0, 0, 0, 0.7)"
                 style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)' }}
                 className="rounded-lg shadow-xl"
               />
             </ReactFlow>
        </div>

        {/* Right: Configuration Panel */}
        <div className="w-1/3 p-6 flex flex-col bg-white/1 overflow-y-auto scrollbar-none">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
               <Settings size={14} /> Node Configuration
            </h3>
            {selectedNode && (
               <button className="text-red-500/50 hover:text-red-500 transition-colors p-1.5 bg-red-500/10 rounded border border-red-500/20">
                 <Trash2 size={12} />
               </button>
            )}
          </div>
          
          {selectedNode ? (
            <div className="flex-1 flex flex-col gap-6">
               <div className="p-5 border border-white/5 bg-black/40 rounded-xl">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 block">Node Title</label>
                  <input 
                    type="text"
                    key={`title-${selectedNode.id}`}
                    className="w-full bg-black border border-white/10 rounded p-3 text-xs font-mono text-white/80 focus:outline-none focus:border-pink-500/50 transition-colors"
                    defaultValue={selectedNode.data.title as string}
                    onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                  />
               </div>

               {selectedNode.type === 'agentNode' && (
                 <div className="p-5 border border-white/5 bg-black/40 rounded-xl">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 block">Agent Selection</label>
                    <select 
                      key={`agent-${selectedNode.id}`}
                      className="w-full bg-black border border-white/10 rounded p-3 text-xs font-mono text-white/80 focus:outline-none focus:border-pink-500/50 transition-colors"
                      defaultValue={selectedNode.data.agentId as string}
                      onChange={(e) => updateNodeData(selectedNode.id, { agentId: e.target.value })}
                    >
                      <option value="cc-06">CC-06 Director (Copywriter)</option>
                      <option value="sp-01">SP-01 Strategist (Research)</option>
                      <option value="da-03">DA-03 Architect (Creative)</option>
                      <option value="sn-00">SN-00 Overseer (Analyst)</option>
                      <option value="ra-01">RA-01 Interceptor (Engagement)</option>
                    </select>
                 </div>
               )}

               <div className="p-5 border border-white/5 bg-black/40 rounded-xl flex flex-col">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2 block">Directives / Configuration</label>
                  <textarea 
                    key={`config-${selectedNode.id}`}
                    className="w-full min-h-[120px] bg-black border border-white/10 rounded p-4 text-xs font-mono text-white/80 focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
                    defaultValue={selectedNode.data.config as string}
                    onChange={(e) => updateNodeData(selectedNode.id, { config: e.target.value })}
                  />
               </div>
               
               <button className="mt-2 flex items-center justify-center gap-2 bg-white/5 text-white/50 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border border-dashed border-white/10 hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/10 transition-colors">
                  <Plus size={16} /> Add Downstream Node
               </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-xl text-white/30 bg-black/20">
               <GitMerge size={32} className="mb-4 opacity-50" />
               <p className="text-xs font-mono">Select a node on the canvas to configure its parameters and specific agent directives.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
