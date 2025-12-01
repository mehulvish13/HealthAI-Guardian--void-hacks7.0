import { useState, useRef } from 'react';
import { Brain, Upload, Sparkles, Trophy, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { mriLabels } from '@/lib/mockData';

interface AnalysisResult {
  label: string;
  confidence: number;
  description: string;
}

export default function MRIAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Mock analysis result based on MRI dataset labels
    const randomIndex = Math.floor(Math.random() * mriLabels.length);
    const label = mriLabels[randomIndex];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-99%

    const descriptions: Record<string, string> = {
      'NonDemented': 'No signs of cognitive decline detected. Brain structure appears normal with healthy tissue patterns.',
      'MildDemented': 'Early signs of mild cognitive impairment detected. Minor changes in brain structure observed.',
      'VeryMildDemented': 'Very mild cognitive changes observed. Minimal structural variations detected.',
      'ModerateDemented': 'Moderate cognitive decline indicators present. Notable changes in brain tissue patterns.',
    };

    setResult({
      label,
      confidence,
      description: descriptions[label] || 'Analysis complete.',
    });

    // Update gamification
    setScore(prev => prev + Math.floor(confidence / 10));
    setStreak(prev => prev + 1);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getResultColor = (label: string) => {
    switch (label) {
      case 'NonDemented': return 'success';
      case 'VeryMildDemented': return 'warning';
      case 'MildDemented': return 'warning';
      case 'ModerateDemented': return 'destructive';
      default: return 'primary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Brain MRI Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload brain MRI scans for AI-powered cognitive health assessment
        </p>
      </div>

      {/* Gamification Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{score}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Scans Analyzed</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {!image ? (
          <div 
            className="p-8 border-2 border-dashed border-border m-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-1">Upload MRI Scan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click or drag and drop your brain MRI image
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, DICOM • Max size: 10MB
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Image Preview */}
            <div className="relative aspect-square max-h-80 mx-auto mb-4 rounded-xl overflow-hidden bg-muted">
              <img 
                src={image} 
                alt="MRI Scan" 
                className="w-full h-full object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="w-12 h-12 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm font-medium">Analyzing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-center mb-4">
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="gap-2">
                <Brain className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze MRI'}
              </Button>
              <Button variant="outline" onClick={resetAnalysis} disabled={isAnalyzing}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className={cn(
                "rounded-xl p-5 border-2",
                getResultColor(result.label) === 'success' && "bg-success/5 border-success/30",
                getResultColor(result.label) === 'warning' && "bg-warning/5 border-warning/30",
                getResultColor(result.label) === 'destructive' && "bg-destructive/5 border-destructive/30"
              )}>
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    getResultColor(result.label) === 'success' && "bg-success/20 text-success",
                    getResultColor(result.label) === 'warning' && "bg-warning/20 text-warning",
                    getResultColor(result.label) === 'destructive' && "bg-destructive/20 text-destructive"
                  )}>
                    {result.label === 'NonDemented' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <AlertTriangle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {result.label.replace(/([A-Z])/g, ' $1').trim()}
                      </h3>
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-medium rounded-full",
                        getResultColor(result.label) === 'success' && "bg-success/10 text-success",
                        getResultColor(result.label) === 'warning' && "bg-warning/10 text-warning",
                        getResultColor(result.label) === 'destructive' && "bg-destructive/10 text-destructive"
                      )}>
                        {result.confidence}% Confidence
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{result.description}</p>
                    
                    {/* Confidence Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Analysis Confidence</span>
                        <span>{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>

                    {/* Points earned */}
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-sm">
                      <Trophy className="w-4 h-4 text-warning" />
                      <span className="text-muted-foreground">
                        +{Math.floor(result.confidence / 10)} points earned!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <h4 className="font-medium text-foreground mb-2">🧠 About This Feature</h4>
          <p className="text-sm text-muted-foreground">
            This AI model is trained on the Alzheimer's MRI dataset to detect cognitive decline patterns.
            It analyzes brain structure and tissue patterns to provide risk assessments.
          </p>
        </div>
        <div className="bg-warning/5 rounded-xl p-4 border border-warning/20">
          <h4 className="font-medium text-foreground mb-2">⚠️ Important Notice</h4>
          <p className="text-sm text-muted-foreground">
            This is a demonstration tool using mock AI analysis. 
            For accurate medical diagnosis, please consult a qualified healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
