interface StatusBadgeProps {
  status: 'online' | 'offline' | 'processing' | 'warning' | 'error' | 'idle';
  label?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const statusConfig = {
  online: { badge: 'badge-online', text: 'Online', dotClass: 'bg-emerald' },
  offline: { badge: 'badge-offline', text: 'Offline', dotClass: 'bg-red-500' },
  processing: { badge: 'badge-processing', text: 'Processing', dotClass: 'bg-accent animate-glow-pulse' },
  warning: { badge: 'badge-warning', text: 'Warning', dotClass: 'bg-gold' },
  error: { badge: 'badge-error', text: 'Error', dotClass: 'bg-magenta' },
  idle: { badge: 'badge-online', text: 'Idle', dotClass: 'bg-white/30' },
};

export function StatusBadge({ status, label, size = 'sm', dot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`badge ${config.badge} ${size === 'sm' ? 'text-[8px]' : 'text-[10px]'}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />}
      {label || config.text}
    </span>
  );
}
