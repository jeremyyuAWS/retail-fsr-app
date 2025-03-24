import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Target, Award } from 'lucide-react';

export const CoachingDashboard: React.FC = () => {
  const learningModules = [
    {
      title: "Customer Engagement Mastery",
      progress: 75,
      duration: "2 hours",
      category: "Sales Skills"
    },
    {
      title: "Product Knowledge Excellence",
      progress: 45,
      duration: "1.5 hours",
      category: "Product Training"
    },
    {
      title: "Handling Objections",
      progress: 90,
      duration: "1 hour",
      category: "Sales Skills"
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
      >
        <div className="flex items-center space-x-4 mb-6">
          <GraduationCap className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">AI Sales Coach</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, label: "Learning Modules", value: "12 Available" },
            { icon: Target, label: "Sales Target", value: "85% Achieved" },
            { icon: Award, label: "Certifications", value: "3 Completed" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-center space-x-3">
                <stat.icon className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-gray-400">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <div className="space-y-6">
            {learningModules.map((module, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{module.title}</h3>
                  <span className="text-sm text-gray-400">{module.duration}</span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{module.category}</span>
                  <span className="text-blue-400">{module.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
          <div className="space-y-4">
            {[
              "Focus on upselling techniques in electronics department",
              "Review new product features for upcoming launch",
              "Practice handling price objections with AI simulator"
            ].map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <Target className="w-5 h-5 text-blue-400 mt-0.5" />
                <p className="text-gray-300">{recommendation}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};