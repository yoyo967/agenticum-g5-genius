import { type ReactNode } from 'react';

interface DataMetricProps {
  value: string | number;
  label: string;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  trendValue?: string;
  icon?: ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { value: 'text-lg', label: 'text-[8px]' },
  md: { value: 'text-2xl', label: 'text-[10px]' },
  lg: { value: 'text-4xl', label: 'text-xs' },
};

const trendIcons = {
  up: '↑',
  down: '↓',
  flat: '→',
};

const trendColors = {
  up: 'text-emerald',
  down: 'text-magenta',
  flat: 'text-white/30',
};

export function DataMetric({ value, label, unit, trend, trendValue, icon, color, size = 'md' }: DataMetricProps) {
  const s = sizeMap[size];
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon && <span style={{ color: color || 'var(--color-accent)' }}>{icon}</span>}
        <span className={`label mb-0! ${s.label}`}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono font-bold ${s.value}`} style={{ color: color || 'white' }}>
          {value}
        </span>
        {unit && <span className="font-mono text-[10px] text-white/30">{unit}</span>}
        {trend && (
          <span className={`font-mono text-[10px] ml-2 ${trendColors[trend]}`}>
            {trendIcons[trend]} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
