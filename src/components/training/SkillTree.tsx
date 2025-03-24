import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Star, Lock, Check } from 'lucide-react';

interface Skill {
  id: string;
  title: string;
  description: string;
  level: number;
  unlocked: boolean;
  completed: boolean;
  requires: string[];
  children: string[];
}

interface SkillTreeProps {
  skills: Skill[];
  onSkillSelect: (skillId: string) => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({ skills, onSkillSelect }) => {
  const [selectedSkill, setSelectedSkill] = React.useState<string | null>(null);

  const handleSkillClick = (skill: Skill) => {
    if (skill.unlocked) {
      setSelectedSkill(skill.id);
      onSkillSelect(skill.id);
    }
  };

  const getSkillColor = (skill: Skill) => {
    if (!skill.unlocked) return 'text-gray-500 border-gray-700 bg-gray-800/50';
    if (skill.completed) return 'text-green-400 border-green-500/30 bg-green-500/10';
    return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  };

  return (
    <div className="relative p-4">
      <div className="grid gap-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.id}
            initial={false}
            animate={{
              scale: selectedSkill === skill.id ? 1.02 : 1,
              opacity: skill.unlocked ? 1 : 0.6
            }}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${getSkillColor(skill)}`}
            onClick={() => handleSkillClick(skill)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {skill.unlocked ? (
                  skill.completed ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Star className="w-5 h-5 text-blue-400" />
                  )
                ) : (
                  <Lock className="w-5 h-5 text-gray-500" />
                )}
                <div>
                  <h3 className="font-medium">{skill.title}</h3>
                  <p className="text-sm opacity-80">{skill.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {Array.from({ length: skill.level }).map((_, i) => (
                  <Brain
                    key={i}
                    className={`w-4 h-4 ${
                      skill.unlocked ? 'text-blue-400' : 'text-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};