interface AgentAvatarProps {
  agentId: string;
  name?: string;
  role?: string;
  status?: 'online' | 'offline' | 'processing' | 'idle';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const agentConfig: Record<string, { color: string; defaultName: string; defaultRole: string }> = {
  'sn00': { color: '#00E5FF', defaultName: 'NEXUS PRIME', defaultRole: 'Orchestrator' },
  'sp01': { color: '#7B2FBE', defaultName: 'STRATEGIC CORTEX', defaultRole: 'Strategist' },
  'cc06': { color: '#FF007A', defaultName: 'COGNITIVE CORE', defaultRole: 'Copywriter' },
  'da03': { color: '#FFD700', defaultName: 'DESIGN ARCHITECT', defaultRole: 'Visual Artist' },
  'ra01': { color: '#00FF88', defaultName: 'SECURITY CORTEX', defaultRole: 'Auditor' },
};

const sizeMap = {
  sm: { outer: 'w-8 h-8', inner: 'w-3 h-3', text: 'text-[9px]', roleText: 'text-[7px]' },
  md: { outer: 'w-10 h-10', inner: 'w-4 h-4', text: 'text-xs', roleText: 'text-[9px]' },
  lg: { outer: 'w-14 h-14', inner: 'w-5 h-5', text: 'text-sm', roleText: 'text-[10px]' },
};

export function AgentAvatar({ agentId, name, role, status = 'idle', size = 'md', showLabel = true }: AgentAvatarProps) {
  const config = agentConfig[agentId] || { color: '#00E5FF', defaultName: agentId, defaultRole: 'Agent' };
  const s = sizeMap[size];
  const isActive = status === 'online' || status === 'processing';

  return (
    <div className="flex items-center gap-3">
      <div className={`${s.outer} rounded-full flex items-center justify-center relative`}
        style={{ background: config.color + '20', border: `1px solid ${config.color}40` }}>
        <div className={`${s.inner} rounded-full`} style={{ background: config.color, opacity: isActive ? 1 : 0.5 }} />
        {status === 'processing' && (
          <div className="absolute inset-0 rounded-full animate-glow-pulse" style={{ boxShadow: `0 0 12px ${config.color}40` }} />
        )}
      </div>
      {showLabel && (
        <div>
          <p className={`font-mono ${s.text} font-bold`} style={{ color: config.color }}>
            {name || config.defaultName}
          </p>
          <p className={`font-mono ${s.roleText} text-white/30 uppercase tracking-wider`}>
            {role || config.defaultRole}
          </p>
        </div>
      )}
    </div>
  );
}
