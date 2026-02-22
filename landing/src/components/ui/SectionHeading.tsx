import { type ReactNode } from 'react';

interface SectionHeadingProps {
  title: string;
  label?: string;
  description?: string;
  labelColor?: 'accent' | 'gold' | 'magenta' | 'emerald' | 'default';
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: ReactNode;
}

const sizeMap = {
  sm: 'text-xl',
  md: 'text-2xl md:text-3xl',
  lg: 'text-3xl md:text-5xl',
  xl: 'text-4xl md:text-6xl',
};

const labelColorMap = {
  accent: 'label-active',
  gold: 'label-warning',
  magenta: 'label-error',
  emerald: 'text-emerald',
  default: '',
};

export function SectionHeading({
  title,
  label,
  description,
  labelColor = 'accent',
  align = 'left',
  size = 'md',
  icon,
}: SectionHeadingProps) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {label && (
        <span className={`label ${labelColorMap[labelColor]} mb-3 block`}>{label}</span>
      )}
      <h2 className={`font-display font-bold uppercase tracking-tight ${sizeMap[size]} flex items-center ${align === 'center' ? 'justify-center' : ''} gap-3`}>
        {icon}
        {title}
      </h2>
      {description && (
        <p className={`font-mono text-sm text-white/40 mt-3 ${align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'} leading-relaxed`}>
          {description}
        </p>
      )}
    </div>
  );
}
