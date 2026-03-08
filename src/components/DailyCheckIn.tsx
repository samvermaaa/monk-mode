import { forwardRef } from 'react';
import { motion } from 'framer-motion';

interface DailyCheckInProps {
  currentMood: 'strong' | 'neutral' | 'struggling' | null;
  onSelect: (mood: 'strong' | 'neutral' | 'struggling') => void;
}

const moods = [
  { key: 'strong' as const, emoji: '💪', label: 'Strong' },
  { key: 'neutral' as const, emoji: '😐', label: 'Neutral' },
  { key: 'struggling' as const, emoji: '😓', label: 'Struggling' },
];

const DailyCheckIn = forwardRef<HTMLDivElement, DailyCheckInProps>(({ currentMood, onSelect }, ref) => {
  return (
    <div ref={ref} className="bg-gradient-card rounded-2xl border border-border p-6">
      <h3 className="font-semibold mb-1">Daily Check-In</h3>
      <p className="text-sm text-muted-foreground mb-4">How are you feeling today?</p>
      <div className="grid grid-cols-3 gap-3">
        {moods.map(m => (
          <motion.button
            key={m.key}
            onClick={() => onSelect(m.key)}
            className={`rounded-xl p-3 text-center transition-colors border ${
              currentMood === m.key
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary/30 hover:bg-secondary/50'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-2xl mb-1">{m.emoji}</div>
            <div className="text-xs font-medium">{m.label}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
});

DailyCheckIn.displayName = 'DailyCheckIn';
export default DailyCheckIn;
