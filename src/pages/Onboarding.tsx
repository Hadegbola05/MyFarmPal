import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CloudSun, 
  TrendingUp, 
  Mic, 
  Sprout, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  Globe2
} from 'lucide-react';
import OnboardingAnimation from '@/components/OnboardingAnimation';

const featureHighlights = [
  {
    icon: CloudSun,
    color: "from-amber-400 to-amber-600",
    title: "Localized Weather Forecasts",
    desc: "Hour-by-hour rain probability, optimal sowing windows, and harvest risk warnings calibrated for your state and LGA."
  },
  {
    icon: TrendingUp,
    color: "from-emerald-500 to-green-700",
    title: "Live Market Intelligence",
    desc: "Daily farmgate and wholesale commodity prices across Mile 12, Bodija, Dawanau, and major Nigerian markets."
  },
  {
    icon: Mic,
    color: "from-yellow-400 to-amber-500",
    title: "Multilingual Voice Assistant",
    desc: "Speak naturally in English, Pidgin, Yoruba, Hausa, or Igbo to get direct agronomy and fertilizer answers."
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-transparent.png" 
            alt="MyFarmPal Logo" 
            className="w-10 h-10 object-contain filter drop-shadow-xs"
            onError={(e: any) => {
              e.currentTarget.src = "/logo.png";
            }}
          />
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              <span>My</span>
              <span className="text-[#4EA923]">Farm</span>
              <span className="text-[#FAB814]">Pal</span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold">Your Farm Pal. Your Language.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/auth')}
            className="text-xs font-bold text-slate-700 hover:text-emerald-700"
          >
            Sign In
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate('/auth')}
            className="bg-[#4EA923] hover:bg-[#43951E] text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Main Hero & Animation Showcase */}
      <main className="max-w-6xl mx-auto w-full py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
        {/* Left Column: Heading & Value Cards */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAB814]/20 text-[#855300] border border-[#FAB814]/30">
              <Globe2 size={13} />
              <span>Built for Nigeria's Next-Gen Farmers</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Empowering Your Harvest in <span className="text-[#4EA923]">Your Language</span>.
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-medium">
              Join thousands of farmers making data-driven decisions with localized weather, real-time crop market pricing, and voice-assisted AI guidance.
            </p>
          </div>

          {/* Value Pillars Cards */}
          <div className="space-y-3">
            {featureHighlights.map((feat, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  activeStep === idx 
                    ? "bg-white border-[#4EA923]/40 shadow-md ring-1 ring-[#4EA923]/20" 
                    : "bg-white/60 border-slate-200/60 hover:bg-white"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shrink-0 shadow-xs`}>
                  <feat.icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{feat.title}</h4>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed mt-0.5">{feat.desc}</p>
                </div>
                <ChevronRight size={16} className={`shrink-0 text-slate-400 mt-1 transition-transform ${activeStep === idx ? "text-[#4EA923] translate-x-1" : ""}`} />
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto h-12 px-8 bg-[#4EA923] hover:bg-[#43951E] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <span>Start Free with MyFarmPal</span>
              <ArrowRight size={16} />
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem('agri_demo_user', JSON.stringify({ email: 'farmer@demo.myfarmpal.ng' }));
                navigate('/');
              }}
              className="w-full sm:w-auto h-12 px-6 border-slate-300 text-slate-800 hover:bg-emerald-50 rounded-2xl text-sm font-semibold"
            >
              Explore Demo Farm
            </Button>
          </div>
        </div>

        {/* Right Column: Hero Art & Animation Showcase */}
        <div className="lg:col-span-6 space-y-4">
          {/* Static Hero Image Art Banner from Dribbble */}
          <div className="rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-500/20 bg-white relative group">
            <img 
              src="/onboarding-hero.webp" 
              alt="MyFarmPal Onboarding Story" 
              className="w-full h-auto max-h-[300px] object-cover sm:object-contain group-hover:scale-102 transition-transform duration-500"
              onError={(e: any) => {
                e.currentTarget.src = "/onboarding-hero.png";
              }}
            />
            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
              Official Mascot Artwork
            </div>
          </div>

          {/* Interactive Live Character Walk & Handshake Animation */}
          <OnboardingAnimation onComplete={() => navigate('/auth')} />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto w-full py-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
        <p>© 2026 MyFarmPal. Your Farm Pal. Your Language.</p>
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
          <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-emerald-600" /> Agronomic Accuracy Guarantee</span>
          <span className="flex items-center gap-1"><Sprout size={13} className="text-amber-600" /> Made for Local Smallholder Farmers</span>
        </div>
      </footer>
    </div>
  );
}
