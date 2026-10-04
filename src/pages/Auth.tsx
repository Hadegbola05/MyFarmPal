import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { toastSupabaseError } from '@/lib/utils';
import { Sprout, Leaf, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      toastSupabaseError(error, 'Could not sign up. Please try again.');
    } else {
      toast.success('Check your email for the confirmation link!');
    }
    setLoading(false);
  };

  const handleDemoLogin = () => {
    const demoUser = {
      id: 'demo-farmer-id',
      email: 'farmer@agri-smart.demo',
      user_metadata: { full_name: 'Demo Farmer' }
    };
    localStorage.setItem('agri_demo_user', JSON.stringify(demoUser));
    toast.success('Welcome, Farmer! Exploring in demo mode.');
    navigate('/');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toastSupabaseError(error, 'Invalid login credentials.');
      } else {
        localStorage.removeItem('agri_demo_user');
        toast.success('Welcome back to AgriSmart!');
        navigate('/');
      }
    } catch {
      toast.error('Unable to connect to auth server. You can continue as Demo Farmer.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF6] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
              <Sprout size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">AgriSmart AI</h1>
          <p className="text-muted-foreground">Your intelligent companion for modern farming</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100/50 p-1">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your farm intelligence.</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="farmer@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full h-11 bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </Button>
                  <div className="relative w-full my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 px-2 text-muted-foreground">Or</span></div>
                  </div>
                  <Button type="button" variant="outline" className="w-full h-10 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50" onClick={handleDemoLogin}>
                    Continue as Demo Farmer
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" type="button">
                    Forgot your password?
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Join the Future of Farming</CardTitle>
                <CardDescription>Create your account and start optimizing your yield today.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="farmer@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 mt-2">
                  <Button className="w-full h-11 bg-secondary text-secondary-foreground hover:bg-secondary/90" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Get Started'}
                  </Button>
                  <div className="relative w-full my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white/80 px-2 text-muted-foreground">Or</span></div>
                  </div>
                  <Button type="button" variant="outline" className="w-full h-10 border-emerald-600/30 text-emerald-800 hover:bg-emerald-50" onClick={handleDemoLogin}>
                    Explore in Demo Mode
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Leaf size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Smart Crop Recommendations</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <ArrowRight size={16} />
            </div>
            <span className="text-[10px] font-medium text-slate-600">Real-time Market Prices</span>
          </div>
        </div>
      </div>
    </div>
  );
}
