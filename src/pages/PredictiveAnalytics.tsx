import { useState } from 'react';
import { Activity, Scale, Moon, Dumbbell, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { calculateDiabetesRisk, calculateStressRisk } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function PredictiveAnalytics() {
  const [bmi, setBmi] = useState(24);
  const [sleepHours, setSleepHours] = useState(7);
  const [activityLevel, setActivityLevel] = useState(3);
  const [moodScore, setMoodScore] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [diabetesRisk, setDiabetesRisk] = useState(0);
  const [stressRisk, setStressRisk] = useState(0);

  const calculateRisks = () => {
    const dRisk = calculateDiabetesRisk(bmi, sleepHours, activityLevel);
    const sRisk = calculateStressRisk(sleepHours, activityLevel, moodScore);
    setDiabetesRisk(dRisk);
    setStressRisk(sRisk);
    setShowResults(true);
  };

  const getRiskLevel = (risk: number) => {
    if (risk < 30) return { level: 'Low', color: 'success' };
    if (risk < 60) return { level: 'Medium', color: 'warning' };
    return { level: 'High', color: 'destructive' };
  };

  const RiskBar = ({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) => {
    const risk = getRiskLevel(value);
    
    return (
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            risk.color === 'success' && "bg-success/10 text-success",
            risk.color === 'warning' && "bg-warning/10 text-warning",
            risk.color === 'destructive' && "bg-destructive/10 text-destructive"
          )}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">Risk Assessment</p>
          </div>
        </div>
        
        <div className="mb-2">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                risk.color === 'success' && "bg-success",
                risk.color === 'warning' && "bg-warning",
                risk.color === 'destructive' && "bg-destructive"
              )}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            risk.color === 'success' && "bg-success/10 text-success",
            risk.color === 'warning' && "bg-warning/10 text-warning",
            risk.color === 'destructive' && "bg-destructive/10 text-destructive"
          )}>
            {risk.level} Risk
          </span>
          <span className="text-2xl font-bold text-foreground">{value}%</span>
        </div>

        {/* Recommendations */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations:</p>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {value >= 60 ? (
              <>
                <li className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  Consider consulting a healthcare professional
                </li>
                <li className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                  Make lifestyle changes immediately
                </li>
              </>
            ) : value >= 30 ? (
              <>
                <li className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                  Monitor your health metrics closely
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Maintain healthy lifestyle habits
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Keep up the great work!
                </li>
                <li className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-success" />
                  Continue your healthy lifestyle
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Predictive Health Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Assess your risk for chronic conditions based on lifestyle factors
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-6">Enter Your Health Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BMI Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-muted-foreground" />
              <Label>BMI (Body Mass Index)</Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[bmi]}
                onValueChange={(v) => setBmi(v[0])}
                min={15}
                max={40}
                step={0.5}
                className="flex-1"
              />
              <span className="w-16 text-center font-mono bg-secondary px-3 py-1 rounded-lg">
                {bmi}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
            </p>
          </div>

          {/* Sleep Hours */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-muted-foreground" />
              <Label>Average Sleep Hours</Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[sleepHours]}
                onValueChange={(v) => setSleepHours(v[0])}
                min={3}
                max={12}
                step={0.5}
                className="flex-1"
              />
              <span className="w-16 text-center font-mono bg-secondary px-3 py-1 rounded-lg">
                {sleepHours}h
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 7-9 hours per night
            </p>
          </div>

          {/* Activity Level */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-muted-foreground" />
              <Label>Activity Level</Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[activityLevel]}
                onValueChange={(v) => setActivityLevel(v[0])}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-center font-mono bg-secondary px-3 py-1 rounded-lg">
                {activityLevel}/5
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              1 = Sedentary, 5 = Very Active
            </p>
          </div>

          {/* Mood Score */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <Label>Overall Mood Score</Label>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                value={[moodScore]}
                onValueChange={(v) => setMoodScore(v[0])}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-center font-mono bg-secondary px-3 py-1 rounded-lg">
                {moodScore}/5
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              1 = Very Low, 5 = Excellent
            </p>
          </div>
        </div>

        <Button onClick={calculateRisks} className="w-full mt-6 gap-2">
          <TrendingUp className="w-4 h-4" />
          Calculate Risk Scores
        </Button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RiskBar 
            value={diabetesRisk} 
            label="Diabetes Risk" 
            icon={<Activity className="w-6 h-6" />} 
          />
          <RiskBar 
            value={stressRisk} 
            label="Chronic Stress Risk" 
            icon={<AlertTriangle className="w-6 h-6" />} 
          />
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <h4 className="font-medium text-foreground mb-2">About Diabetes Risk</h4>
          <p className="text-sm text-muted-foreground">
            This score is calculated based on your BMI, sleep patterns, and activity level. 
            Higher BMI and lower activity increase risk factors.
          </p>
        </div>
        <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
          <h4 className="font-medium text-foreground mb-2">About Stress Risk</h4>
          <p className="text-sm text-muted-foreground">
            Chronic stress risk factors include poor sleep, low physical activity, 
            and overall mood. Managing these can significantly reduce your risk.
          </p>
        </div>
      </div>
    </div>
  );
}
