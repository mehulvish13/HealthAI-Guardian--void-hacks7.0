import { useState, useEffect } from 'react';
import { 
  Heart, 
  Footprints, 
  Brain, 
  Moon, 
  Flame, 
  Activity,
  Bell,
  TrendingUp
} from 'lucide-react';
import { VitalCard } from '@/components/dashboard/VitalCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { generateVitalSigns, type VitalSigns } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function Dashboard() {
  const [vitals, setVitals] = useState<VitalSigns>(generateVitalSigns());
  const [heartRateHistory, setHeartRateHistory] = useState<{ time: string; value: number }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial data
    const initialHistory = Array.from({ length: 10 }, (_, i) => ({
      time: `${i}m ago`,
      value: Math.floor(Math.random() * 30) + 65,
    })).reverse();
    setHeartRateHistory(initialHistory);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newVitals = generateVitalSigns();
      setVitals(newVitals);

      // Update heart rate history
      setHeartRateHistory(prev => {
        const newHistory = [...prev.slice(1), { time: 'now', value: newVitals.heartRate }];
        return newHistory.map((item, i) => ({
          ...item,
          time: i === newHistory.length - 1 ? 'now' : `${(newHistory.length - 1 - i)}m`
        }));
      });

      // Alert for high heart rate
      if (newVitals.heartRate > 95) {
        toast({
          title: "⚠️ High Heart Rate Alert",
          description: `Your heart rate is ${newVitals.heartRate} BPM. Consider taking a moment to relax.`,
          variant: "destructive",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [toast]);

  const getHeartRateStatus = (hr: number) => {
    if (hr < 60 || hr > 100) return 'warning';
    if (hr > 95) return 'critical';
    return 'normal';
  };

  const getStressStatus = (level: number) => {
    if (level > 70) return 'critical';
    if (level > 50) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Health Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of your vital signs</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-xl border border-border">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-muted-foreground">Live Monitoring</span>
        </div>
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <VitalCard
          title="Heart Rate"
          value={vitals.heartRate}
          unit="BPM"
          icon={<Heart className="w-6 h-6" />}
          status={getHeartRateStatus(vitals.heartRate)}
          trend={vitals.heartRate > 80 ? 'up' : 'stable'}
          subtitle="Resting heart rate"
        />
        <VitalCard
          title="Daily Steps"
          value={vitals.steps.toLocaleString()}
          unit="steps"
          icon={<Footprints className="w-6 h-6" />}
          status={vitals.steps > 5000 ? 'normal' : 'warning'}
          trend="up"
          subtitle="Goal: 10,000 steps"
        />
        <VitalCard
          title="Stress Level"
          value={vitals.stressLevel}
          unit="%"
          icon={<Brain className="w-6 h-6" />}
          status={getStressStatus(vitals.stressLevel)}
          trend={vitals.stressLevel > 50 ? 'up' : 'down'}
          subtitle="Based on HRV analysis"
        />
        <VitalCard
          title="Blood Pressure"
          value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
          unit="mmHg"
          icon={<Activity className="w-6 h-6" />}
          status={vitals.bloodPressure.systolic > 130 ? 'warning' : 'normal'}
          subtitle="Systolic/Diastolic"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Heart Rate Trend</h3>
              <p className="text-sm text-muted-foreground">Last 10 minutes</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateHistory}>
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[50, 110]} className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#heartGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Rings */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Daily Goals</h3>
              <p className="text-sm text-muted-foreground">Track your progress</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <ProgressRing
              value={vitals.sleepHours}
              max={8}
              label="Sleep"
              unit="hours"
              color={vitals.sleepHours >= 7 ? 'success' : 'warning'}
            />
            <ProgressRing
              value={vitals.calories}
              max={2000}
              label="Calories"
              unit="kcal"
              color={vitals.calories > 1500 ? 'success' : 'warning'}
            />
            <ProgressRing
              value={vitals.steps / 100}
              max={100}
              label="Steps"
              unit="%"
              color={vitals.steps > 8000 ? 'success' : 'accent'}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Today's Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <Moon className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold text-foreground">{vitals.sleepHours.toFixed(1)}h</p>
            <p className="text-xs text-muted-foreground">Sleep Duration</p>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <Flame className="w-6 h-6 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold text-foreground">{vitals.calories}</p>
            <p className="text-xs text-muted-foreground">Calories Burned</p>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <Activity className="w-6 h-6 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold text-foreground">Good</p>
            <p className="text-xs text-muted-foreground">Overall Health</p>
          </div>
          <div className="text-center p-4 bg-secondary/50 rounded-xl">
            <Bell className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold text-foreground">2</p>
            <p className="text-xs text-muted-foreground">Health Alerts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
