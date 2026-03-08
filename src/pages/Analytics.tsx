import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import BottomNav from '@/components/BottomNav';

const COLORS = [
  'hsl(24, 95%, 53%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(0, 0%, 45%)',
];

export default function Analytics() {
  const { user } = useAuth();
  const [relapseData, setRelapseData] = useState<{ month: string; count: number }[]>([]);
  const [triggerData, setTriggerData] = useState<{ name: string; value: number }[]>([]);
  const [moodData, setMoodData] = useState<{ date: string; mood: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch relapse logs
      const { data: relapses } = await supabase
        .from('relapse_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('relapse_date', { ascending: true });

      if (relapses && relapses.length > 0) {
        // Group by month
        const monthMap: Record<string, number> = {};
        relapses.forEach(r => {
          const month = new Date(r.relapse_date).toLocaleString('default', { month: 'short' });
          monthMap[month] = (monthMap[month] || 0) + 1;
        });
        setRelapseData(Object.entries(monthMap).map(([month, count]) => ({ month, count })));

        // Group triggers
        const triggerMap: Record<string, number> = {};
        relapses.forEach(r => {
          const trigger = r.trigger || 'Unknown';
          triggerMap[trigger] = (triggerMap[trigger] || 0) + 1;
        });
        const total = relapses.length;
        setTriggerData(
          Object.entries(triggerMap)
            .map(([name, count]) => ({ name, value: Math.round((count / total) * 100) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 4)
        );
      }

      // Fetch daily checkins
      const { data: checkins } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('checkin_date', { ascending: true })
        .limit(30);

      if (checkins && checkins.length > 0) {
        const moodValues: Record<string, number> = { strong: 3, neutral: 2, struggling: 1 };
        setMoodData(checkins.map(c => ({
          date: new Date(c.checkin_date).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          mood: c.mood,
          value: moodValues[c.mood] || 2,
        })));
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark pb-24">
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>

        {/* Relapse History */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Relapse History</h3>
          {relapseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={relapseData}>
                <XAxis dataKey="month" tick={{ fill: 'hsl(0,0%,55%)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' }}
                />
                <Bar dataKey="count" fill="hsl(0, 72%, 51%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No relapse data yet. Keep going! 💪</p>
          )}
        </div>

        {/* Mood Trends */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Mood Trends</h3>
          {moodData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={moodData}>
                <XAxis dataKey="date" tick={{ fill: 'hsl(0,0%,55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 4]} />
                <Tooltip
                  contentStyle={{ background: 'hsl(0 0% 7%)', border: '1px solid hsl(0 0% 14%)', borderRadius: '8px', color: 'hsl(0 0% 95%)' }}
                  formatter={(value: number) => {
                    const labels: Record<number, string> = { 3: '💪 Strong', 2: '😐 Neutral', 1: '😓 Struggling' };
                    return [labels[value] || value, 'Mood'];
                  }}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(24, 95%, 53%)" strokeWidth={2} dot={{ fill: 'hsl(24, 95%, 53%)', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Complete daily check-ins to see trends.</p>
          )}
        </div>

        {/* Triggers */}
        <div className="bg-gradient-card rounded-2xl border border-border p-6">
          <h3 className="font-semibold mb-4">Top Triggers</h3>
          {triggerData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={triggerData} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {triggerData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {triggerData.map((t, i) => (
                  <div key={t.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-muted-foreground">{t.name}</span>
                    <span className="font-mono text-xs">{t.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No trigger data yet.</p>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
