import { useState } from 'react';
import { Stethoscope, AlertTriangle, CheckCircle, Info, Send, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { analyzeSymptoms } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface SymptomResult {
  condition: string;
  severity: string;
  advice: string;
  timestamp: Date;
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [history, setHistory] = useState<SymptomResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeSymptoms(symptoms);
    
    if (analysis) {
      const newResult: SymptomResult = {
        condition: analysis.condition,
        severity: analysis.severity,
        advice: analysis.advice,
        timestamp: new Date(),
      };
      setResult(newResult);
      setHistory(prev => [newResult, ...prev].slice(0, 5));
    } else {
      setResult({
        condition: 'Unable to identify specific condition',
        severity: 'Unknown',
        advice: 'Your symptoms don\'t match our database. Please provide more details or consult a healthcare professional for a proper diagnosis.',
        timestamp: new Date(),
      });
    }
    
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-success/10 text-success border-success/30';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/30';
      case 'High': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      case 'Medium': return <Info className="w-5 h-5" />;
      case 'High': return <AlertTriangle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const quickSymptoms = [
    'I have a headache',
    'Feeling stressed and anxious',
    'I feel very tired',
    'Frequent thirst and urination',
    'Chest pain',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Symptom Checker</h1>
        <p className="text-muted-foreground mt-2">
          Describe your symptoms and our AI will analyze potential conditions
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <label className="block text-sm font-medium text-foreground mb-2">
          Describe your symptoms
        </label>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Example: I've been experiencing headaches for the past few days, along with fatigue and difficulty sleeping..."
          className="min-h-32 mb-4 bg-background"
        />
        
        {/* Quick symptom buttons */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {quickSymptoms.map((symptom) => (
              <button
                key={symptom}
                onClick={() => setSymptoms(symptom)}
                className="px-3 py-1.5 text-xs bg-secondary rounded-full hover:bg-secondary/80 transition-colors text-secondary-foreground"
              >
                {symptom}
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleAnalyze} 
          disabled={!symptoms.trim() || isAnalyzing}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Analyze Symptoms
            </>
          )}
        </Button>
      </div>

      {/* Result Section */}
      {result && (
        <div className={cn(
          "rounded-2xl p-6 border-2 transition-all",
          getSeverityColor(result.severity)
        )}>
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              result.severity === 'Low' && "bg-success/20",
              result.severity === 'Medium' && "bg-warning/20",
              result.severity === 'High' && "bg-destructive/20",
              result.severity === 'Unknown' && "bg-muted"
            )}>
              {getSeverityIcon(result.severity)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground">{result.condition}</h3>
                <span className={cn(
                  "px-2 py-0.5 text-xs font-medium rounded-full",
                  getSeverityColor(result.severity)
                )}>
                  {result.severity} Severity
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{result.advice}</p>
              {result.severity === 'High' && (
                <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ This condition may require immediate medical attention. Please consult a healthcare professional.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Recent Checks</h3>
          </div>
          <div className="space-y-3">
            {history.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getSeverityIcon(item.severity)}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.condition}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className={cn(
                  "px-2 py-0.5 text-xs rounded-full",
                  getSeverityColor(item.severity)
                )}>
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-muted/50 rounded-xl p-4 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Note:</strong> This AI symptom checker provides general information only and should not replace 
          professional medical advice. Always consult a healthcare provider for accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
