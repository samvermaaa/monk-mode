import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { loginSchema, signupSchema, forgotPasswordSchema } from '@/lib/validations';

export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    let validation;
    if (mode === 'forgot') {
      validation = forgotPasswordSchema.safeParse({ email });
    } else if (mode === 'signup') {
      validation = signupSchema.safeParse({ email, password, username });
    } else {
      validation = loginSchema.safeParse({ email, password });
    }

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'Password reset link sent.' });
        setMode('login');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username },
          },
        });
        if (error) throw error;
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account before signing in.',
        });
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md bg-card rounded-2xl border border-border p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">MonkMode</span>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">
          {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Start Your Journey' : 'Reset Password'}
        </h2>

        <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="pl-10"
                  maxLength={30}
                  aria-describedby={errors.username ? 'username-error' : undefined}
                />
              </div>
              {errors.username && <p id="username-error" className="text-xs text-destructive">{errors.username}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="pl-10"
                maxLength={255}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && <p id="email-error" className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  maxLength={128}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="text-xs text-destructive">{errors.password}</p>}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </Button>
        </form>

        {mode === 'login' && (
          <button
            onClick={() => { setMode('forgot'); setErrors({}); }}
            className="text-sm text-muted-foreground hover:text-primary mt-3 block text-center w-full"
          >
            Forgot password?
          </button>
        )}

        {mode !== 'forgot' && (
          <>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
          </>
        )}

        <p className="text-sm text-center text-muted-foreground mt-6">
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setErrors({}); }} className="text-primary hover:underline">Sign up</button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => { setMode('login'); setErrors({}); }} className="text-primary hover:underline">Sign in</button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
