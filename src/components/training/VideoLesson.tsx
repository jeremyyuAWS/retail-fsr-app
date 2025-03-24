import React from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, CheckCircle } from 'lucide-react';

interface Checkpoint {
  time: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface VideoLessonProps {
  url: string;
  title: string;
  checkpoints: Checkpoint[];
  onComplete: () => void;
}

export const VideoLesson: React.FC<VideoLessonProps> = ({
  url,
  title,
  checkpoints,
  onComplete
}) => {
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [currentCheckpoint, setCurrentCheckpoint] = React.useState<Checkpoint | null>(null);
  const [completedCheckpoints, setCompletedCheckpoints] = React.useState<number[]>([]);
  
  const playerRef = React.useRef<ReactPlayer>(null);

  const handleProgress = ({ played }: { played: number }) => {
    setProgress(played * 100);
    
    const nextCheckpoint = checkpoints.find(
      cp => cp.time <= played * 100 && !completedCheckpoints.includes(cp.time)
    );

    if (nextCheckpoint) {
      setPlaying(false);
      setCurrentCheckpoint(nextCheckpoint);
    }
  };

  const handleCheckpointAnswer = (answer: string) => {
    if (currentCheckpoint) {
      const isCorrect = answer === currentCheckpoint.correctAnswer;
      
      if (isCorrect) {
        setCompletedCheckpoints(prev => [...prev, currentCheckpoint.time]);
        setCurrentCheckpoint(null);
        setPlaying(true);
      }
    }
  };

  const handleVideoEnd = () => {
    if (completedCheckpoints.length === checkpoints.length) {
      onComplete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="auto"
          playing={playing}
          onProgress={handleProgress}
          onEnded={handleVideoEnd}
          controls={false}
        />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPlaying(!playing)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {playing ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white">
                {completedCheckpoints.length} / {checkpoints.length} checkpoints
              </span>
              <SkipForward className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div className="mt-2 relative h-1 bg-gray-700 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
            {checkpoints.map((cp, index) => (
              <div
                key={index}
                className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 ${
                  completedCheckpoints.includes(cp.time)
                    ? 'bg-green-400'
                    : 'bg-yellow-400'
                }`}
                style={{ left: `${cp.time}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {currentCheckpoint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gray-800/50 rounded-lg border border-gray-700"
        >
          <h3 className="font-medium mb-3">{currentCheckpoint.question}</h3>
          <div className="grid gap-2">
            {currentCheckpoint.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleCheckpointAnswer(option)}
                className="p-3 text-left rounded-lg bg-gray-900/50 hover:bg-gray-900 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};