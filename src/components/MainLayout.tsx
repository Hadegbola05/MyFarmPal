import * as React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  CloudSun, 
  TrendingUp, 
  BookOpen, 
  Sprout, 
  Calendar, 
  Bug, 
  FlaskConical, 
  Calculator, 
  Store, 
  FileText, 
  Mic, 
  Landmark, 
  MapPin,
  Menu,
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from './AppLogo';
import FloatingVoiceAssistant from './FloatingVoiceAssistant';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const navigation = [
  { name: 'Weather', href: '/', icon: CloudSun },
  { name: 'Market Intelligence', href: '/market', icon: TrendingUp },
  { name: 'Crop Learning', href: '/crops', icon: BookOpen },
  { name: 'Recommendations', href: '/recommendations', icon: Sprout },
  { name: 'Planting Calendar', href: '/calendar', icon: Calendar },
  { name: 'Pests & Diseases', href: '/pests', icon: Bug },
  { name: 'Fertilizer', href: '/fertilizer', icon: FlaskConical },
  { name: 'Cost Analysis', href: '/cost', icon: Calculator },
  { name: 'Selling Guide', href: '/sell', icon: Store },
  { name: 'Farm Records', href: '/records', icon: FileText },
  { name: 'Grants & Info', href: '/grants', icon: Landmark },
  { name: 'Input Finder', href: '/finder', icon: MapPin },
  { name: 'Voice Assistant', href: '/voice', icon: Mic },
  { name: 'Onboarding Story', href: '/onboarding', icon: Sparkles },
];

const leftBottomNav = [
  { name: 'Home', href: '/', icon: CloudSun },
  { name: 'Market', href: '/market', icon: TrendingUp },
];

const rightBottomNav = [
  { name: 'Records', href: '/records', icon: FileText },
  { name: 'Tools', href: '/recommendations', icon: Sprout },
];

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const demoUser = localStorage.getItem('agri_demo_user');
    if (demoUser) {
      try {
        setUser(JSON.parse(demoUser));
      } catch {
        // ignore
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    }).catch(() => {
      // ignore
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        const demo = localStorage.getItem('agri_demo_user');
        setUser(demo ? JSON.parse(demo) : null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('agri_demo_user');
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex flex-col pb-20 lg:pb-0 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="cursor-pointer py-1 flex items-center" onClick={() => navigate('/')}>
            <AppLogo size="sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          {/* Voice Assistant Header Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVoiceAssistantOpen(true)}
            className="flex items-center gap-1.5 rounded-full border-emerald-500/30 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 font-bold text-xs shadow-2xs cursor-pointer py-1 px-3"
            title="Open Floating Voice Assistant"
          >
            <span className="w-2 h-2 rounded-full bg-[#4EA923] animate-pulse" />
            <Mic size={15} className="text-[#4EA923]" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </Button>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFC814] to-[#FAB814] flex items-center justify-center text-[#3A2202] font-bold shadow-sm border border-amber-300">
            <span className="text-xs">{user?.email?.[0].toUpperCase() ?? 'F'}</span>
          </div>
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
              title="Sign Out"
            >
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-border/80 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          {/* Sidebar Brand Header */}
          <div 
            className="p-4 border-b border-border/60 bg-[#FCFBF7] cursor-pointer"
            onClick={() => navigate('/')}
          >
            <AppLogo size="md" />
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={(e) => {
                  setIsSidebarOpen(false);
                  if (item.name === 'Voice Assistant') {
                    e.preventDefault();
                    setIsVoiceAssistantOpen(true);
                  }
                }}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-[#4EA923] text-white shadow-sm shadow-[#4EA923]/30 font-semibold" 
                    : "text-slate-600 hover:bg-[#F2F8EC] hover:text-[#3B821A]"
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#4EA923]'} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-3 border-t border-border/60 bg-[#FAF8F0]/60">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-amber-200/50 shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-[#FAB814]/20 flex items-center justify-center text-[#996300] font-bold text-xs">
                🌾
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">Smart Farm Hub</p>
                <p className="text-[10px] text-muted-foreground truncate">Active Harvest Season</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile with Elevated Floating Voice Assistant */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-border/50 px-3 py-1.5 flex items-center justify-around z-40 backdrop-blur-lg shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        {leftBottomNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-0.5 transition-colors px-2 py-1",
              isActive ? "text-[#4EA923] font-bold" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className="transition-transform active:scale-90" />
            <span className="text-[10px]">{item.name}</span>
          </NavLink>
        ))}

        {/* Elevated Floating Voice Assistant Center Button */}
        <button
          type="button"
          onClick={() => setIsVoiceAssistantOpen(true)}
          className="relative -top-5 flex flex-col items-center justify-center group cursor-pointer focus:outline-none"
          aria-label="Open Floating Voice Assistant"
        >
          <div className="relative w-13 h-13 rounded-full bg-gradient-to-tr from-[#3D8F19] to-[#4EA923] text-white shadow-xl flex items-center justify-center border-3 border-white group-hover:scale-105 active:scale-95 transition-all">
            <div className="absolute inset-0 rounded-full bg-[#4EA923] animate-ping opacity-25 pointer-events-none" />
            <Mic size={22} className="text-[#FAB814] drop-shadow-xs" />
          </div>
          <span className="text-[10px] font-bold text-[#3D8F19] mt-0.5">Voice</span>
        </button>

        {rightBottomNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-0.5 transition-colors px-2 py-1",
              isActive ? "text-[#4EA923] font-bold" : "text-muted-foreground"
            )}
          >
            <item.icon size={20} className="transition-transform active:scale-90" />
            <span className="text-[10px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Floating Voice Assistant Modal Window */}
      <FloatingVoiceAssistant 
        isOpen={isVoiceAssistantOpen} 
        onClose={() => setIsVoiceAssistantOpen(false)} 
      />
    </div>
  );
}
