import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { toastSupabaseError } from '@/lib/utils';
import { Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLogo from '@/components/AppLogo';
import SplashScreen from '@/components/SplashScreen';

export default function Auth() {
  const [showSplash, setShowSplash] = React.useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('splash') === 'true') return true;
      if (params.get('skipSplash') === 'true') return false;
      return !sessionStorage.getItem('myfarmpal_splash_seen');
    } catch {
      return false;
    }
  });

  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('farmer@gmail.com');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSplashFinish = React.useCallback(() => {
    try {
      sessionStorage.setItem('myfarmpal_splash_seen', 'true');
    } catch {
      // ignore
    }
    setShowSplash(false);
  }, []);

  const isEmailValid = email.includes('@') && email.includes('.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    if (mode === 'signup') {
      if (!password || password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toastSupabaseError(error, 'Could not sign up. Please try again.');
      } else {
        toast.success('Account created! Check your email for confirmation link.');
      }
    } else {
      // Sign In mode
      if (!password) {
        setPassword('password123');
      }

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: password || 'password123',
        });

        if (error) {
          toastSupabaseError(error, 'Invalid credentials. You can continue as Demo Farmer.');
        } else {
          localStorage.removeItem('agri_demo_user');
          toast.success('Welcome back to MyFarmPal!');
          navigate('/');
        }
      } catch {
        toast.error('Auth error. You can continue as Demo Farmer.');
      }
    }

    setLoading(false);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-farmer-id',
      email: email || 'farmer@agri-smart.demo',
      user_metadata: { full_name: 'Demo Farmer' }
    };
    localStorage.setItem('agri_demo_user', JSON.stringify(demoUser));
    toast.success('Welcome! Exploring as Demo Farmer.');
    navigate('/');
  };

  const handleSocialClick = (provider: string) => {
    toast.info(`${provider} sign-in selected. Continuing as Demo Farmer...`);
    handleDemoLogin();
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-white"
          >
            <SplashScreen onFinish={handleSplashFinish} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-amber-50/30 flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
        {/* Subtle decorative background organic glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-200/25 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-[400px] flex flex-col items-center relative z-10">
          {/* Big Brand Logo with Mascot on Top and Name Under */}
          <div className="mb-6 flex flex-col items-center justify-center cursor-pointer group" onClick={() => navigate('/')}>
            <AppLogo size="xl" direction="col" showText={true} />
          </div>

          {/* Header Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1.5 mb-7 text-center">
            Welcome Back , Please enter Your details
          </p>

          {/* Tab Switcher (Pill Style with Brand Palette) */}
          <div className="w-full bg-emerald-50/80 border border-emerald-100/70 p-1.5 rounded-2xl flex items-center mb-6 shadow-2xs">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white text-emerald-950 shadow-sm border border-emerald-100/80'
                  : 'text-slate-500 hover:text-emerald-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white text-emerald-950 shadow-sm border border-emerald-100/80'
                  : 'text-slate-500 hover:text-emerald-800'
              }`}
            >
              Signup
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Address Input Container */}
            <div className="w-full border border-slate-200/90 rounded-2xl px-4 py-2.5 flex items-center gap-3.5 bg-white focus-within:border-[#4FA924] focus-within:ring-2 focus-within:ring-[#4FA924]/20 transition-all shadow-xs">
              <div className="text-slate-600 shrink-0">
                <Mail size={20} strokeWidth={2} />
              </div>

              <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-400 leading-tight">
                  Email Address
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@gmail.com"
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
                />
              </div>

              {/* Sprout Green Checkmark Badge */}
              {isEmailValid && (
                <div className="shrink-0 w-5 h-5 rounded-full bg-[#4FA924] flex items-center justify-center text-white shadow-xs">
                  <CheckCircle2 size={15} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Password Input Container */}
            <div className="w-full border border-slate-200/90 rounded-2xl px-4 py-2.5 flex items-center gap-3.5 bg-white focus-within:border-[#4FA924] focus-within:ring-2 focus-within:ring-[#4FA924]/20 transition-all shadow-xs">
              <div className="text-slate-600 shrink-0">
                <Lock size={20} strokeWidth={2} />
              </div>

              <div className="w-[1px] h-9 bg-slate-200 shrink-0" />

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-400 leading-tight">
                  {mode === 'signup' ? 'Create Password' : 'Password'}
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-300"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="shrink-0 text-slate-400 hover:text-emerald-700 p-0.5"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Continue Sprout Green Brand Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] mt-2 bg-gradient-to-r from-[#4FA924] to-[#43921E] hover:from-[#43921E] hover:to-[#387c19] text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
            >
              {loading ? 'Please wait...' : 'Continue'}
            </button>
          </form>

          {/* Divider: Or Continue With */}
          <div className="w-full flex items-center my-6">
            <div className="flex-1 h-[1px] bg-slate-200" />
            <span className="px-4 text-xs font-medium text-slate-400">
              Or Continue With
            </span>
            <div className="flex-1 h-[1px] bg-slate-200" />
          </div>

          {/* Social Login Circles: Google and Apple */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialClick('Google')}
              className="w-[52px] h-[52px] rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center hover:bg-emerald-50/50 hover:border-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              aria-label="Continue with Google"
              title="Continue with Google"
            >
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialClick('Apple')}
              className="w-[52px] h-[52px] rounded-full bg-slate-900 shadow-xs flex items-center justify-center hover:bg-black hover:scale-105 active:scale-95 transition-all cursor-pointer text-white"
              aria-label="Continue with Apple"
              title="Continue with Apple"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1 .08 2.02-.49 2.63-1.24" />
              </svg>
            </button>
          </div>

          {/* Demo Farmer Quick Access (Styled in Brand Green & Gold) */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-2xl bg-emerald-50/90 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/90 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs active:scale-[0.99]"
          >
            <span>🌾</span>
            <span>Explore Instant Demo (No Credentials Needed)</span>
          </button>
        </div>
      </div>
    </>
  );
}
