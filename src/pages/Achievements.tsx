import { motion } from 'framer-motion';
import { MILESTONES } from '@/lib/store';
import { useUserStats } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

export default function Achievements() {
  const { stats, loading } = useUserStats();

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
        <h1 className="text-2xl font-bold mb-2">Achievements</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {MILESTONES.filter(m => stats.currentStreak >= m.days).length} / {MILESTONES.length} unlocked
        </p>

        <div className="grid grid-cols-2 gap-4">
          {MILESTONES.map((m, i) => {
            const unlocked = stats.currentStreak >= m.days;
            return (
              <motion.div
                key={m.days}
                className={`rounded-2xl border p-5 text-center ${
                  unlocked
                    ? 'bg-gradient-card border-primary/30 glow-primary'
                    : 'bg-card/50 border-border opacity-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: unlocked ? 1 : 0.5, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-3xl mb-2">{unlocked ? m.icon : '🔒'}</div>
                <div className="text-sm font-semibold">{m.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{m.days} days</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
