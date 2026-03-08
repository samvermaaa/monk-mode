import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Save, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUserStats } from '@/lib/store';
import { profileSchema } from '@/lib/validations';
import BottomNav from '@/components/BottomNav';

export default function Profile() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { stats } = useUserStats();
  const [username, setUsername] = useState('');
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, anonymous_mode')
        .eq('id', user.id)
        .maybeSingle();
      if (data) {
        setUsername(data.username || '');
        setAnonymousMode(data.anonymous_mode);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    const validation = profileSchema.safeParse({ username });
    if (!validation.success) {
      toast({ title: 'Validation Error', description: validation.error.errors[0].message, variant: 'destructive' });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ username, anonymous_mode: anonymousMode, updated_at: new Date().toISOString() })
      .eq('id', user!.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to save profile.', variant: 'destructive' });
    } else {
      toast({ title: 'Profile updated!' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark pb-24">
      <div className="container py-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* Avatar & Level */}
        <motion.div
          className="bg-gradient-card rounded-2xl border border-border p-6 mb-6 flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">{username || 'Warrior'}</h2>
            <p className="text-sm text-muted-foreground">Level {stats.level} • {stats.xp} XP</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </motion.div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Current Streak', value: stats.currentStreak, suffix: 'd' },
            { label: 'Longest Streak', value: stats.longestStreak, suffix: 'd' },
            { label: 'Tasks Done', value: stats.completedTasks.length, suffix: '' },
          ].map(s => (
            <div key={s.label} className="bg-gradient-card rounded-xl border border-border p-3 text-center">
              <div className="text-xl font-bold font-mono text-primary">{s.value}{s.suffix}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="profile-username">Username</Label>
            <Input
              id="profile-username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Your username"
              maxLength={30}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="anon-mode" className="text-sm font-medium">Anonymous Mode</Label>
              <p className="text-xs text-muted-foreground">Hide your identity on leaderboards</p>
            </div>
            <Switch
              id="anon-mode"
              checked={anonymousMode}
              onCheckedChange={setAnonymousMode}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-gradient-card rounded-2xl border border-destructive/20 p-6">
          <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Account
          </h3>
          <Button
            variant="outline"
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
            onClick={async () => { await signOut(); navigate('/'); }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
