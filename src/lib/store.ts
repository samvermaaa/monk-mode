import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalRelapses: number;
  startDate: string;
  xp: number;
  level: number;
  dailyCheckIn: 'strong' | 'neutral' | 'struggling' | null;
  completedTasks: string[];
}

const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  totalRelapses: 0,
  startDate: new Date().toISOString().split('T')[0],
  xp: 0,
  level: 1,
  dailyCheckIn: null,
  completedTasks: [],
};

export function useUserStats() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching streaks:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Check today's checkin
        const today = new Date().toISOString().split('T')[0];
        const { data: checkin } = await supabase
          .from('daily_checkins')
          .select('mood')
          .eq('user_id', user.id)
          .eq('checkin_date', today)
          .maybeSingle();

        setStats({
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          totalRelapses: data.total_relapses,
          startDate: data.start_date,
          xp: data.xp,
          level: data.level,
          dailyCheckIn: (checkin?.mood as UserStats['dailyCheckIn']) ?? (data.daily_check_in as UserStats['dailyCheckIn']),
          completedTasks: data.completed_tasks || [],
        });
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const updateDb = useCallback(async (updates: Record<string, any>) => {
    if (!user) return;
    const { error } = await supabase
      .from('streaks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    if (error) {
      console.error('Error updating streaks:', error);
      toast({ title: 'Error', description: 'Failed to save progress.', variant: 'destructive' });
    }
  }, [user, toast]);

  const resetStreak = useCallback(async () => {
    const newRelapses = stats.totalRelapses + 1;
    setStats(prev => ({ ...prev, currentStreak: 0, totalRelapses: newRelapses }));
    await updateDb({ current_streak: 0, total_relapses: newRelapses });

    if (user) {
      await supabase.from('relapse_logs').insert({
        user_id: user.id,
        trigger: 'manual_reset',
        emotion: 'unknown',
      });
    }
  }, [stats.totalRelapses, updateDb, user]);

  const completeTask = useCallback(async (taskId: string) => {
    const newTasks = [...stats.completedTasks, taskId];
    const newXp = stats.xp + 25;
    const newLevel = Math.floor(newXp / 200) + 1;
    setStats(prev => ({ ...prev, completedTasks: newTasks, xp: newXp, level: newLevel }));
    await updateDb({ completed_tasks: newTasks, xp: newXp, level: newLevel });
  }, [stats.completedTasks, stats.xp, updateDb]);

  const setDailyCheckIn = useCallback(async (mood: 'strong' | 'neutral' | 'struggling') => {
    if (!user) return;
    setStats(prev => ({ ...prev, dailyCheckIn: mood }));
    await updateDb({ daily_check_in: mood });

    // Also save to daily_checkins history
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('daily_checkins')
      .upsert(
        { user_id: user.id, mood, checkin_date: today },
        { onConflict: 'user_id,checkin_date' }
      );
  }, [updateDb, user]);

  return { stats, loading, resetStreak, completeTask, setDailyCheckIn };
}

export const MILESTONES = [
  { days: 3, label: '3 Day Start', icon: '🌱' },
  { days: 7, label: '7 Day Warrior', icon: '⚔️' },
  { days: 14, label: '14 Day Strong', icon: '💪' },
  { days: 30, label: '30 Day Monk', icon: '🧘' },
  { days: 60, label: '60 Day Master', icon: '🔥' },
  { days: 90, label: '90 Day Discipline', icon: '👑' },
  { days: 180, label: '180 Day Legend', icon: '⭐' },
  { days: 365, label: '1 Year King', icon: '🏆' },
];

export const DOPAMINE_TASKS = [
  { id: 'pushups', label: '10 Pushups', xp: 25, icon: '💪' },
  { id: 'meditation', label: '2 Min Meditation', xp: 30, icon: '🧘' },
  { id: 'water', label: 'Drink Water', xp: 10, icon: '💧' },
  { id: 'read', label: 'Read 1 Page', xp: 20, icon: '📖' },
  { id: 'walk', label: 'Go Outside', xp: 35, icon: '🚶' },
];
