import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind } from 'lucide-react';

const CHALLENGES = [
  '💪 Do 20 pushups right now',
  '💧 Drink a full glass of water',
  '🚶 Walk for 2 minutes',
  '🧊 Splash cold water on your face',
  '📖 Read one page of a book',
  '🧘 Focus on your breathing',
];

const QUOTES = [
  "The urge is temporary. Your discipline is permanent.",
  "You're not starting from zero — you're starting from experience.",
  "Every second you resist, you grow stronger.",
  "The pain of discipline is nothing like the pain of regret.",
];

interface Props {
  onClose: () => void;
}

export default function UrgeIntervention({ onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [phase, setPhase] = useState<'breathing' | 'done'>('breathing');
  const challenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  useEffect(() => {
    if (timeLeft <= 0) {
      setPhase('done');
      return;
    }
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground hover:text-foreground">
        <X className="h-6 w-6" />
      </button>

      <AnimatePresence mode="wait">
        {phase === 'breathing' ? (
          <motion.div key="breathe" className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Breathing circle */}
            <div className="relative flex items-center justify-center mb-10">
              <div className="w-48 h-48 rounded-full border-2 border-primary/30 animate-breathe flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 border border-primary/20 animate-breathe flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
                  <Wind className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mb-2">Urges pass within minutes. Stay strong.</p>
            <div className="text-5xl font-bold font-mono text-primary mb-8">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>

            <div className="bg-card rounded-xl border border-border p-4 max-w-sm mb-6">
              <p className="text-sm italic text-muted-foreground">"{quote}"</p>
            </div>

            <div className="bg-primary/10 rounded-xl border border-primary/20 p-4 max-w-sm">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Quick Challenge</p>
              <p className="text-sm font-medium">{challenge}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" className="text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold mb-3">Great Job!</h2>
            <p className="text-muted-foreground mb-8">The urge passed. You stayed in control.</p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
