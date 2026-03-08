import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Trophy, BarChart3, MessageCircle, Lock } from 'lucide-react';
import { MILESTONES } from '@/lib/store';

export default function Achievements() {
  const navigate = useNavigate();
  const currentStreak = 12; // mock

  return (
    <div className="min-h-screen bg-gradient-dark pb-24">
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Achievements</h1>

        <div className="grid grid-cols-2 gap-4">
          {MILESTONES.map((m, i) => {
            const unlocked = currentStreak >= m.days;
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

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border">
        <div className="container flex justify-around py-3">
          {[
            { icon: Flame, label: 'Dashboard', path: '/dashboard' },
            { icon: Trophy, label: 'Badges', path: '/achievements' },
            { icon: BarChart3, label: 'Analytics', path: '/analytics' },
            { icon: MessageCircle, label: 'AI Coach', path: '/coach' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 text-xs ${
                item.path === '/achievements' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
