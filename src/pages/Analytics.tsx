import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, BarChart3, MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const streakData = [
  { month: 'Jan', streak: 5 },
  { month: 'Feb', streak: 14 },
  { month: 'Mar', streak: 12 },
];

const triggerData = [
  { name: 'Boredom', value: 35 },
  { name: 'Stress', value: 25 },
  { name: 'Late Night', value: 25 },
  { name: 'Social Media', value: 15 },
];

const COLORS = [
  'hsl(24, 95%, 53%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(0, 0%, 45%)',
];

const timeData = [
  { time: '6am', urges: 1 },
  { time: '9am', urges: 2 },
  { time: '12pm', urges: 3 },
  { time: '3pm', urges: 2 },
  { time: '6pm', urges: 4 },
  { time: '9pm', urges: 7 },
  { time: '12am', urges: 8 },
];

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark pb-24">
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        {/* Streak History */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Streak History</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={streakData}>
              <XAxis dataKey="month" tick={{ fill: 'hsl(0,0%,55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="streak" fill="hsl(24, 95%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Triggers */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Top Triggers</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={triggerData} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                  {triggerData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {triggerData.map((t, i) => (
                <div key={t.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-muted-foreground">{t.name}</span>
                  <span className="font-mono text-xs">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Dangerous Times */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Most Dangerous Times</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={timeData}>
              <XAxis dataKey="time" tick={{ fill: 'hsl(0,0%,55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="urges" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
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
                item.path === '/analytics' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
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
