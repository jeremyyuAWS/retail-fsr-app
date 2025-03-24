import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Trophy, Target } from 'lucide-react';
import Confetti from 'react-confetti';

interface AchievementBadgeProps {
  type: 'milestone' | 'skill' | 'mastery' | 'challenge';
  title: string;
  description: string;
  level: number;
  isNew?: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  title,
  description,
  level,
  isNew = false
}) => {
  const [showConfetti, setShowConfetti] = React.useState(isNew);

  React.useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getBadgeIcon = () => {
    switch (type) {
      case 'milestone':
        return Trophy;
      case 'skill':
        return Star;
      case 'mastery':
        return Award;
      case 'challenge':
        return Target;
      default:
        return Award;
    }
  };

  const getBadgeColor = () => {
    switch (level) {
      case 3:
        return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 2:
        return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      default:
        return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  const Icon = getBadgeIcon();

  return (
    <motion.div
      initial={isNew ? { scale: 0.8, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative p-4 rounded-lg border ${getBadgeColor()}`}
    >
      {showConfetti && (
        <Confetti
          width={200}
          height={200}
          recycle={false}
          numberOfPieces={50}
          gravity={0.2}
        />
      )}
      
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${getBadgeColor()}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      </div>

      {isNew && (
        <span className="absolute -top-2 -right-2 px-2 py-1 text-xs rounded-full bg-green-500 text-white">
          New!
        </span>
      )}
    </motion.div>
  );
};