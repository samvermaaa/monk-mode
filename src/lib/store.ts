import { useState, useCallback } from 'react';

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalRelapses: number;
  startDate: string;
  xp: number;
  level: number;
  dailyCheckIn: 'strong' | 'neutral' | 'struggling' | null;
  completedTasks: string[];
  relapseLog: Array<{ date: string; trigger: string; emotion: string }>;
  streakHistory: Array<{ date: string; streak: number }>;
}

const DEFAULT_STATS: UserStats = {
  currentStreak: 12,
  longestStreak: 34,
  totalRelapses: 5,
  startDate: '2026-02-24',
  xp: 1250,
  level: 7,
  dailyCheckIn: null,
  completedTasks: [],
  relapseLog: [
    { date: '2026-02-20', trigger: 'boredom', emotion: 'stressed' },
    { date: '2026-02-10', trigger: 'late night', emotion: 'lonely' },
    { date: '2026-01-28', trigger: 'social media', emotion: 'anxious' },
  ],
  streakHistory: [
    { date: '2026-01', streak: 5 },
    { date: '2026-02', streak: 14 },
    { date: '2026-03', streak: 12 },
  ],
};

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  const resetStreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      currentStreak: 0,
      totalRelapses: prev.totalRelapses + 1,
    }));
  }, []);

  const completeTask = useCallback((taskId: string) => {
    setStats(prev => ({
      ...prev,
      completedTasks: [...prev.completedTasks, taskId],
      xp: prev.xp + 25,
    }));
  }, []);

  const setDailyCheckIn = useCallback((mood: 'strong' | 'neutral' | 'struggling') => {
    setStats(prev => ({ ...prev, dailyCheckIn: mood }));
  }, []);

  return { stats, resetStreak, completeTask, setDailyCheckIn };
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
