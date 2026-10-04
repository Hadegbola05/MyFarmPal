import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './integrations/supabase/client';
import { Toaster } from './components/ui/sonner';

const MainLayout = React.lazy(() => import('./components/MainLayout'));
const WeatherDashboard = React.lazy(() => import('./pages/WeatherDashboard'));
const MarketIntelligence = React.lazy(() => import('./pages/MarketIntelligence'));
const CropLearningCenter = React.lazy(() => import('./pages/CropLearningCenter'));
const PestDiseaseGuide = React.lazy(() => import('./pages/PestDiseaseGuide'));
const CropRecommendationEngine = React.lazy(() => import('./pages/CropRecommendationEngine'));
const PlantingCalendar = React.lazy(() => import('./pages/PlantingCalendar'));
const FertilizerRecommendation = React.lazy(() => import('./pages/FertilizerRecommendation'));
const SellingGuide = React.lazy(() => import('./pages/SellingGuide'));
const CostAnalysis = React.lazy(() => import('./pages/CostAnalysis'));
const FarmRecordBook = React.lazy(() => import('./pages/FarmRecordBook'));
const InputFinder = React.lazy(() => import('./pages/InputFinder'));
const GrantInformation = React.lazy(() => import('./pages/GrantInformation'));
const LearningAcademy = React.lazy(() => import('./pages/LearningAcademy'));
const VoiceAssistant = React.lazy(() => import('./pages/VoiceAssistant'));
const Auth = React.lazy(() => import('./pages/Auth'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<any>(undefined);

  React.useEffect(() => {
    const demoUser = localStorage.getItem('agri_demo_user');
    if (demoUser) {
      try {
        setSession({ user: JSON.parse(demoUser) });
        return;
      } catch {
        localStorage.removeItem('agri_demo_user');
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    }).catch(() => {
      const demo = localStorage.getItem('agri_demo_user');
      setSession(demo ? { user: JSON.parse(demo) } : null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
      } else {
        const demo = localStorage.getItem('agri_demo_user');
        setSession(demo ? { user: JSON.parse(demo) } : null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (!session) return <Navigate to="/auth" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<WeatherDashboard />} />
            <Route path="market" element={<MarketIntelligence />} />
            <Route path="crops" element={<CropLearningCenter />} />
            <Route path="recommendations" element={<CropRecommendationEngine />} />
            <Route path="calendar" element={<PlantingCalendar />} />
            <Route path="fertilizer" element={<FertilizerRecommendation />} />
            <Route path="sell" element={<SellingGuide />} />
            <Route path="pests" element={<PestDiseaseGuide />} />
            <Route path="cost" element={<CostAnalysis />} />
            <Route path="records" element={<FarmRecordBook />} />
            <Route path="academy" element={<LearningAcademy />} />
            <Route path="grants" element={<GrantInformation />} />
            <Route path="finder" element={<InputFinder />} />
            <Route path="voice" element={<VoiceAssistant />} />
            <Route path="*" element={<div className="flex items-center justify-center h-full text-muted-foreground italic">Module coming soon in Phase 2...</div>} />
          </Route>
        </Routes>
      </React.Suspense>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default App;
