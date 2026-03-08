interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const xpForNext = level * 200;
  const currentLevelXp = xp % xpForNext;
  const progress = (currentLevelXp / xpForNext) * 100;

  return (
    <div className="bg-gradient-card rounded-2xl border border-border p-4 flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/30">
        <span className="text-sm font-bold font-mono text-primary">{level}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Level {level}</span>
          <span className="text-muted-foreground font-mono">{currentLevelXp}/{xpForNext} XP</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
