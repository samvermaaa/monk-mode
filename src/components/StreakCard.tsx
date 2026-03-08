import { motion } from 'framer-motion';
import { Flame, Trophy, RotateCcw, Calendar } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalRelapses: number;
  startDate: string;
  onReset: () => void;
}

export default function StreakCard({ currentStreak, longestStreak, totalRelapses, startDate, onReset }: StreakCardProps) {
  const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000);

  return (
    <div className="bg-gradient-card rounded-2xl border border-border p-6 md:p-8">
      {/* Main streak */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary glow-primary mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div>
            <div className="text-4xl font-bold font-mono text-primary">{currentStreak}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Days</div>
          </div>
        </motion.div>
        <h2 className="text-xl font-semibold">Current Streak</h2>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <Trophy className="h-4 w-4 text-primary mx-auto mb-1" />
          <div className="text-lg font-bold font-mono">{longestStreak}</div>
          <div className="text-xs text-muted-foreground">Longest</div>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <RotateCcw className="h-4 w-4 text-destructive mx-auto mb-1" />
          <div className="text-lg font-bold font-mono">{totalRelapses}</div>
          <div className="text-xs text-muted-foreground">Relapses</div>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 text-center">
          <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
          <div className="text-lg font-bold font-mono">{daysSinceStart}</div>
          <div className="text-xs text-muted-foreground">Total Days</div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
      >
        Reset Streak
      </button>
    </div>
  );
}
