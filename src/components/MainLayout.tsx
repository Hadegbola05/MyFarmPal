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
  MessageSquare, 
  Mic, 
  GraduationCap, 
  Landmark, 
  MapPin,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistant from './AIAssistant';
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
  { name: 'Learning Academy', href: '/academy', icon: GraduationCap },
  { name: 'Grants & Info', href: '/grants', icon: Landmark },
  { name: 'Input Finder', href: '/finder', icon: MapPin },
  { name: 'Voice Assistant', href: '/voice', icon: Mic },
];

const bottomNav = [
  { name: 'Home', href: '/', icon: CloudSun },
  { name: 'Market', href: '/market', icon: TrendingUp },
  { name: 'Records', href: '/records', icon: FileText },
  { name: 'Tools', href: '/recommendations', icon: Sprout },
  { name: 'Assistant', href: '/voice', icon: Mic },
];

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">A</div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-primary leading-tight">AgriSmart AI</h1>
              <p className="text-[9px] text-muted-foreground hidden sm:block font-medium uppercase tracking-tighter">AI-Powered Agricultural Intelligence</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="hidden sm:flex gap-2 border-primary/20 hover:bg-secondary/20"
            onClick={() => navigate('/voice')}
          >
            <Mic size={16} className="text-secondary-foreground" />
            <span className="hidden md:inline">Voice Assistant</span>
          </Button>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shadow-sm">
            <span className="text-xs font-bold">{user?.email?.[0].toUpperCase() ?? 'F'}</span>
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
            "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <nav className="h-full overflow-y-auto py-6 px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                )}
              >
                <item.icon size={18} />
                <span>{item.name}</span>
                {item.name === 'Recommendations' && (
                  <span className="ml-auto bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">AI</span>
                )}
              </NavLink>
            ))}
          </nav>
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

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-border/50 px-4 py-2 flex items-center justify-between z-40 backdrop-blur-lg shadow-[0_-4px_15px_rgba(0,0,0,0.08)]">
        {bottomNav.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 transition-colors px-2 py-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <item.icon size={22} className={cn("transition-transform", "active:scale-90")} />
            <span className="text-[9px] font-bold">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <AIAssistant />
    </div>
  );
}
