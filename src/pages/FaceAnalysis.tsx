import { useState, useRef, useEffect } from 'react';
import { ScanFace, Upload, Sparkles, Trophy, RefreshCw, AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface HealthIndicator {
  name: string;
  status: 'normal' | 'attention' | 'concern';
  confidence: number;
  description: string;
}

interface AnalysisResult {
  overallHealth: 'Good' | 'Fair' | 'Needs Attention';
  indicators: HealthIndicator[];
  recommendations: string[];
}

const healthIndicators = [
  { name: 'Skin Tone', normal: 'Healthy skin coloration detected', attention: 'Slight pallor detected - may indicate anemia', concern: 'Noticeable discoloration - consult a doctor' },
  { name: 'Eye Health', normal: 'Clear eyes with good appearance', attention: 'Minor redness or fatigue signs', concern: 'Yellowing detected - possible liver issues' },
  { name: 'Facial Symmetry', normal: 'Normal facial symmetry', attention: 'Minor asymmetry detected', concern: 'Significant asymmetry - neurological check advised' },
  { name: 'Stress Indicators', normal: 'No visible stress markers', attention: 'Dark circles or tension detected', concern: 'High stress indicators present' },
  { name: 'Hydration Level', normal: 'Good skin hydration', attention: 'Mild dehydration signs', concern: 'Significant dehydration markers' },
  { name: 'Nutritional Status', normal: 'No deficiency markers', attention: 'Possible vitamin deficiency signs', concern: 'Multiple deficiency indicators' },
];

export default function FaceAnalysis() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [score, setScore] = useState(0);
  const [scansCompleted, setScansCompleted] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraError('Could not access camera. Please allow camera permissions.');
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        setImage(canvas.toDataURL('image/jpeg'));
        setResult(null);
        stopCamera();
      }
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1000));

    const analyzedIndicators: HealthIndicator[] = healthIndicators.map(indicator => {
      const rand = Math.random();
      let status: 'normal' | 'attention' | 'concern';
      let description: string;
      
      if (rand > 0.3) {
        status = 'normal';
        description = indicator.normal;
      } else if (rand > 0.1) {
        status = 'attention';
        description = indicator.attention;
      } else {
        status = 'concern';
        description = indicator.concern;
      }
      
      return {
        name: indicator.name,
        status,
        confidence: Math.floor(Math.random() * 15) + 85,
        description,
      };
    });

    const concernCount = analyzedIndicators.filter(i => i.status === 'concern').length;
    const attentionCount = analyzedIndicators.filter(i => i.status === 'attention').length;
    
    let overallHealth: 'Good' | 'Fair' | 'Needs Attention';
    if (concernCount > 0) {
      overallHealth = 'Needs Attention';
    } else if (attentionCount > 2) {
      overallHealth = 'Fair';
    } else {
      overallHealth = 'Good';
    }

    const recommendations: string[] = [];
    if (analyzedIndicators.find(i => i.name === 'Hydration Level' && i.status !== 'normal')) {
      recommendations.push('Increase water intake to at least 8 glasses per day');
    }
    if (analyzedIndicators.find(i => i.name === 'Stress Indicators' && i.status !== 'normal')) {
      recommendations.push('Practice relaxation techniques and ensure adequate sleep');
    }
    if (analyzedIndicators.find(i => i.name === 'Nutritional Status' && i.status !== 'normal')) {
      recommendations.push('Consider a balanced diet rich in vitamins and minerals');
    }
    if (recommendations.length === 0) {
      recommendations.push('Maintain your current healthy lifestyle!');
    }

    setResult({
      overallHealth,
      indicators: analyzedIndicators,
      recommendations,
    });

    setScore(prev => prev + (overallHealth === 'Good' ? 15 : overallHealth === 'Fair' ? 10 : 5));
    setScansCompleted(prev => prev + 1);
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResult(null);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (status: 'normal' | 'attention' | 'concern') => {
    switch (status) {
      case 'normal': return 'success';
      case 'attention': return 'warning';
      case 'concern': return 'destructive';
    }
  };

  const getOverallColor = (health: string) => {
    switch (health) {
      case 'Good': return 'success';
      case 'Fair': return 'warning';
      case 'Needs Attention': return 'destructive';
      default: return 'primary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <ScanFace className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Face Health Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Upload or capture a face photo for AI-powered health indicator detection
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
            <p className="text-xs text-muted-foreground">Health Points</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{scansCompleted}</p>
            <p className="text-xs text-muted-foreground">Scans Completed</p>
          </div>
        </div>
      </div>

      {/* Upload/Camera Area */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {!image && !isCameraActive ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className="p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
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
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Upload Photo</h3>
                  <p className="text-sm text-muted-foreground">
                    Click to upload a face photo
                  </p>
                </div>
              </div>
              
              <div 
                className="p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                onClick={startCamera}
              >
                <div className="text-center">
                  <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium text-foreground mb-1">Use Camera</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a photo with your camera
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : isCameraActive ? (
          <div className="p-4">
            {cameraError ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-destructive" />
                </div>
                <p className="text-destructive font-medium mb-2">Camera Error</p>
                <p className="text-sm text-muted-foreground mb-4">{cameraError}</p>
                <Button variant="outline" onClick={stopCamera}>
                  Go Back
                </Button>
              </div>
            ) : (
              <>
                <div className="relative aspect-video max-h-80 mx-auto mb-4 rounded-xl overflow-hidden bg-muted">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={capturePhoto} className="gap-2">
                    <Camera className="w-4 h-4" />
                    Capture Photo
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Image Preview */}
            <div className="relative aspect-square max-h-80 mx-auto mb-4 rounded-xl overflow-hidden bg-muted">
              <img 
                src={image!} 
                alt="Face" 
                className="w-full h-full object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                  <div className="text-center text-primary-foreground">
                    <div className="w-12 h-12 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm font-medium">Analyzing facial features...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 justify-center mb-4">
              <Button onClick={analyzeImage} disabled={isAnalyzing} className="gap-2">
                <ScanFace className="w-4 h-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze Face'}
              </Button>
              <Button variant="outline" onClick={resetAnalysis} disabled={isAnalyzing}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                {/* Overall Health */}
                <div className={cn(
                  "rounded-xl p-4 border-2",
                  getOverallColor(result.overallHealth) === 'success' && "bg-success/5 border-success/30",
                  getOverallColor(result.overallHealth) === 'warning' && "bg-warning/5 border-warning/30",
                  getOverallColor(result.overallHealth) === 'destructive' && "bg-destructive/5 border-destructive/30"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      getOverallColor(result.overallHealth) === 'success' && "bg-success/20 text-success",
                      getOverallColor(result.overallHealth) === 'warning' && "bg-warning/20 text-warning",
                      getOverallColor(result.overallHealth) === 'destructive' && "bg-destructive/20 text-destructive"
                    )}>
                      {result.overallHealth === 'Good' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Overall Health: {result.overallHealth}</h3>
                      <p className="text-sm text-muted-foreground">Based on {result.indicators.length} health indicators</p>
                    </div>
                  </div>
                </div>

                {/* Health Indicators */}
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-foreground mb-3">Health Indicators</h4>
                  {result.indicators.map((indicator, index) => (
                    <div key={index} className="bg-card rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-foreground">{indicator.name}</span>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-full",
                          getStatusColor(indicator.status) === 'success' && "bg-success/10 text-success",
                          getStatusColor(indicator.status) === 'warning' && "bg-warning/10 text-warning",
                          getStatusColor(indicator.status) === 'destructive' && "bg-destructive/10 text-destructive"
                        )}>
                          {indicator.status === 'normal' ? 'Normal' : indicator.status === 'attention' ? 'Attention' : 'Concern'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{indicator.description}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={indicator.confidence} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground">{indicator.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Points earned */}
                <div className="flex items-center justify-center gap-2 text-sm py-2">
                  <Trophy className="w-4 h-4 text-warning" />
                  <span className="text-muted-foreground">
                    +{result.overallHealth === 'Good' ? 15 : result.overallHealth === 'Fair' ? 10 : 5} health points earned!
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
          <h4 className="font-medium text-foreground mb-2">🔬 What We Analyze</h4>
          <p className="text-sm text-muted-foreground">
            Our AI examines skin tone, eye health, facial symmetry, stress markers, hydration levels, and nutritional indicators.
          </p>
        </div>
        <div className="bg-warning/5 rounded-xl p-4 border border-warning/20">
          <h4 className="font-medium text-foreground mb-2">⚠️ Important Notice</h4>
          <p className="text-sm text-muted-foreground">
            This is a demonstration tool using simulated analysis. 
            For accurate medical diagnosis, please consult a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
