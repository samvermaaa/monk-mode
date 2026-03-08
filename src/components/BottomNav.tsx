import { useNavigate, useLocation } from 'react-router-dom';
import { Flame, Trophy, BarChart3, MessageCircle } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Flame, label: 'Dashboard', path: '/dashboard' },
  { icon: Trophy, label: 'Badges', path: '/achievements' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: MessageCircle, label: 'AI Coach', path: '/coach' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-lg border-t border-border z-40">
      <div className="container flex justify-around py-3">
        {NAV_ITEMS.map(item => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 text-xs transition-colors ${
              location.pathname === item.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={item.label}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
