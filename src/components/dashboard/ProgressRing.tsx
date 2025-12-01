import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit?: string;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'accent';
}

export function ProgressRing({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 10, 
  label, 
  unit = '',
  color = 'primary'
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  const colorClasses = {
    primary: 'stroke-primary',
    success: 'stroke-success',
    warning: 'stroke-warning',
    destructive: 'stroke-destructive',
    accent: 'stroke-accent',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            className="stroke-muted"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={cn("transition-all duration-500 ease-out", colorClasses[color])}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}
