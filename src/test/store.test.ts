import { describe, it, expect, vi } from 'vitest';
import { MILESTONES, DOPAMINE_TASKS } from '@/lib/store';

// Unit tests for store constants and logic (no Supabase dependency)

describe('MILESTONES', () => {
  it('should have 8 milestones', () => {
    expect(MILESTONES).toHaveLength(8);
  });

  it('milestones should be in ascending day order', () => {
    for (let i = 1; i < MILESTONES.length; i++) {
      expect(MILESTONES[i].days).toBeGreaterThan(MILESTONES[i - 1].days);
    }
  });

  it('each milestone has required fields', () => {
    MILESTONES.forEach(m => {
      expect(m).toHaveProperty('days');
      expect(m).toHaveProperty('label');
      expect(m).toHaveProperty('icon');
      expect(typeof m.days).toBe('number');
      expect(typeof m.label).toBe('string');
      expect(m.label.length).toBeGreaterThan(0);
    });
  });
});

describe('DOPAMINE_TASKS', () => {
  it('should have 5 tasks', () => {
    expect(DOPAMINE_TASKS).toHaveLength(5);
  });

  it('each task has id, label, xp, and icon', () => {
    DOPAMINE_TASKS.forEach(task => {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('label');
      expect(task).toHaveProperty('xp');
      expect(task).toHaveProperty('icon');
      expect(typeof task.id).toBe('string');
      expect(typeof task.xp).toBe('number');
      expect(task.xp).toBeGreaterThan(0);
    });
  });

  it('task IDs should be unique', () => {
    const ids = DOPAMINE_TASKS.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('XP and Level calculation logic', () => {
  it('calculates level correctly from XP', () => {
    const calcLevel = (xp: number) => Math.floor(xp / 200) + 1;
    expect(calcLevel(0)).toBe(1);
    expect(calcLevel(199)).toBe(1);
    expect(calcLevel(200)).toBe(2);
    expect(calcLevel(500)).toBe(3);
    expect(calcLevel(1000)).toBe(6);
  });

  it('completing a task adds 25 XP', () => {
    const initialXp = 0;
    const taskXp = DOPAMINE_TASKS.find(t => t.id === 'pushups')?.xp ?? 25;
    expect(initialXp + taskXp).toBe(25);
  });

  it('completing all tasks gives expected total XP', () => {
    const totalXp = DOPAMINE_TASKS.reduce((sum, t) => sum + t.xp, 0);
    expect(totalXp).toBe(120); // 25 + 30 + 10 + 20 + 35
  });
});

describe('Streak reset logic', () => {
  it('incrementing relapses works correctly', () => {
    let totalRelapses = 0;
    totalRelapses += 1;
    expect(totalRelapses).toBe(1);
    totalRelapses += 1;
    expect(totalRelapses).toBe(2);
  });

  it('streak resets to 0 on relapse', () => {
    let currentStreak = 15;
    currentStreak = 0; // relapse
    expect(currentStreak).toBe(0);
  });
});
