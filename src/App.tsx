import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SymptomChecker = lazy(() => import("./pages/SymptomChecker"));
const PredictiveAnalytics = lazy(() => import("./pages/PredictiveAnalytics"));
const HealthPlans = lazy(() => import("./pages/HealthPlans"));
const ChatBot = lazy(() => import("./pages/ChatBot"));
const MRIAnalysis = lazy(() => import("./pages/MRIAnalysis"));
const FaceAnalysis = lazy(() => import("./pages/FaceAnalysis"));
const CognitiveGames = lazy(() => import("./pages/CognitiveGames"));
const StressReliefGames = lazy(() => import("./pages/StressReliefGames"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <RouteLoader />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <RouteLoader />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/symptoms" element={<SymptomChecker />} />
        <Route path="/analytics" element={<PredictiveAnalytics />} />
        <Route path="/plans" element={<HealthPlans />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/mri" element={<MRIAnalysis />} />
        <Route path="/face-analysis" element={<FaceAnalysis />} />
        <Route path="/cognitive-games" element={<CognitiveGames />} />
        <Route path="/stress-relief" element={<StressReliefGames />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <AppRoutes />
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
