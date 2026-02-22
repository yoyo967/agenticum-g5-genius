import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'magenta' | 'gold' | 'emerald' | 'none';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  accent?: 'left' | 'top' | 'none';
  accentColor?: string;
}

const glowMap = {
  cyan: 'card-glow-cyan',
  magenta: 'card-glow-magenta',
  gold: 'card-glow-gold',
  emerald: '',
  none: '',
};

const padMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

export function GlassCard({
  children,
  className = '',
  glow = 'none',
  hover = true,
  padding = 'md',
  onClick,
  accent = 'none',
  accentColor,
}: GlassCardProps) {
  const accentStyle = accent !== 'none' && accentColor
    ? { [`border${accent === 'left' ? 'Left' : 'Top'}Color`]: accentColor, [`border${accent === 'left' ? 'Left' : 'Top'}Width`]: '2px' }
    : {};

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      onClick={onClick}
      className={`glass-card ${padMap[padding]} ${glowMap[glow]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={accentStyle}
    >
      {children}
    </motion.div>
  );
}
