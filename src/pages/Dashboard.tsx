import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, User } from 'lucide-react';
import StreakCard from '@/components/StreakCard';
import UrgeButton from '@/components/UrgeButton';
import DailyCheckIn from '@/components/DailyCheckIn';
import DopamineTasks from '@/components/DopamineTasks';
import XPBar from '@/components/XPBar';
import UrgeIntervention from '@/components/UrgeIntervention';
import BottomNav from '@/components/BottomNav';
import { useUserStats } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, loading, resetStreak, completeTask, setDailyCheckIn } = useUserStats();
  const { signOut } = useAuth();
  const [showUrge, setShowUrge] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showUrge) {
    return <UrgeIntervention onClose={() => setShowUrge(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-dark pb-24">
      <div className="container py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">MonkMode</span>
        </div>
        <button
          onClick={async () => { await signOut(); navigate('/'); }}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          Sign Out
        </button>
      </div>

      <div className="container space-y-6">
        <XPBar xp={stats.xp} level={stats.level} />
        <StreakCard
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          totalRelapses={stats.totalRelapses}
          startDate={stats.startDate}
          onReset={resetStreak}
        />
        <UrgeButton onPress={() => setShowUrge(true)} />
        <DailyCheckIn currentMood={stats.dailyCheckIn} onSelect={setDailyCheckIn} />
        <DopamineTasks completedTasks={stats.completedTasks} onComplete={completeTask} />
      </div>

      <BottomNav />
    </div>
  );
}
