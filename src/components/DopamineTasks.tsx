import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { DOPAMINE_TASKS } from '@/lib/store';

interface DopamineTasksProps {
  completedTasks: string[];
  onComplete: (taskId: string) => void;
}

export default function DopamineTasks({ completedTasks, onComplete }: DopamineTasksProps) {
  return (
    <div className="bg-gradient-card rounded-2xl border border-border p-6">
      <h3 className="font-semibold mb-1">Dopamine Replacement</h3>
      <p className="text-sm text-muted-foreground mb-4">Complete tasks to earn XP</p>
      <div className="space-y-2">
        {DOPAMINE_TASKS.map(task => {
          const done = completedTasks.includes(task.id);
          return (
            <motion.button
              key={task.id}
              onClick={() => !done && onComplete(task.id)}
              disabled={done}
              className={`w-full flex items-center gap-3 rounded-xl p-3 transition-colors text-left ${
                done
                  ? 'bg-success/10 border border-success/20'
                  : 'bg-secondary/30 border border-border hover:bg-secondary/50'
              }`}
              whileTap={done ? {} : { scale: 0.98 }}
            >
              <span className="text-lg">{task.icon}</span>
              <span className={`flex-1 text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>
                {task.label}
              </span>
              <span className="text-xs text-primary font-mono">+{task.xp} XP</span>
              {done && <Check className="h-4 w-4 text-success" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
