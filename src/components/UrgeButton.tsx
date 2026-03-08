import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface UrgeButtonProps {
  onPress: () => void;
}

export default function UrgeButton({ onPress }: UrgeButtonProps) {
  return (
    <div className="relative flex items-center justify-center py-4">
      {/* Pulse rings */}
      <div className="absolute w-40 h-40 rounded-full border-2 border-primary/20 animate-pulse-ring" />
      <div className="absolute w-40 h-40 rounded-full border-2 border-primary/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
      
      <motion.button
        onClick={onPress}
        className="relative z-10 w-36 h-36 rounded-full bg-primary flex flex-col items-center justify-center gap-2 glow-primary-lg"
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
      >
        <ShieldAlert className="h-8 w-8 text-primary-foreground" />
        <span className="text-sm font-bold text-primary-foreground uppercase tracking-wider">I Have<br />An Urge</span>
      </motion.button>
    </div>
  );
}
