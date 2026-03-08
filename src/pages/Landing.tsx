import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Brain, Flame, Target, BarChart3, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Flame, title: 'Streak Tracking', desc: 'Track your discipline journey with precision and earn milestone badges.' },
  { icon: Shield, title: 'Urge Intervention', desc: 'Instant breathing exercises and challenges to break the impulse loop.' },
  { icon: Brain, title: 'AI Coach', desc: 'An always-available accountability coach that understands your battle.' },
  { icon: Target, title: 'Dopamine Tasks', desc: 'Replace harmful dopamine hits with productive quick activities.' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'Understand your triggers, patterns, and progress over time.' },
  { icon: Trophy, title: 'Gamification', desc: 'Level up, earn XP, and unlock achievements on your journey.' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Nav */}
      <nav className="container flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">MonkMode</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate('/auth')}>
            Sign Up
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-24 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Take Back Control<br />
            <span className="text-gradient-primary">Of Your Mind.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            MonkMode combines streak tracking, AI coaching, and behavioral science 
            to help you break free from compulsive habits and reclaim your discipline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 glow-primary" onClick={() => navigate('/dashboard')}>
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/dashboard')}>
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {[
            { value: '50K+', label: 'Warriors' },
            { value: '2.1M', label: 'Days Tracked' },
            { value: '89%', label: 'Success Rate' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold font-mono text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Built for Discipline</h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Every feature is designed around behavioral psychology to help you win the war within.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-gradient-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
            >
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <div className="bg-gradient-card rounded-2xl p-12 md:p-16 border border-border glow-primary-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Become Disciplined?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join thousands of men who have taken control of their minds and lives.
          </p>
          <Button size="lg" className="text-lg px-10 py-6" onClick={() => navigate('/dashboard')}>
            Start Your Discipline Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-8 border-t border-border text-center text-sm text-muted-foreground">
        © 2026 MonkMode. Take control.
      </footer>
    </div>
  );
}
