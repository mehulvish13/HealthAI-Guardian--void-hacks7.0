import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'stable';
  status?: 'normal' | 'warning' | 'critical';
  subtitle?: string;
}

export function VitalCard({ title, value, unit, icon, trend, status = 'normal', subtitle }: VitalCardProps) {
  const statusColors = {
    normal: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    critical: 'border-destructive/30 bg-destructive/5',
  };

  const iconColors = {
    normal: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    critical: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 border-2 transition-all hover:shadow-lg",
      statusColors[status]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          iconColors[status]
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend === 'up' && "bg-success/10 text-success",
            trend === 'down' && "bg-destructive/10 text-destructive",
            trend === 'stable' && "bg-muted text-muted-foreground"
          )}>
            {trend === 'up' && '↑ Rising'}
            {trend === 'down' && '↓ Falling'}
            {trend === 'stable' && '→ Stable'}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
