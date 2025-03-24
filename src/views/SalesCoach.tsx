import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessagesSquare, Book, Award, Play, CheckCircle, Mic, MicOff, Brain, AlertCircle, Video, Camera, Volume2, VolumeX } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Webcam from 'react-webcam';
import * as Tone from 'tone';
import 'regenerator-runtime/runtime';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  units: {
    id: string;
    title: string;
    type: 'video' | 'document' | 'quiz' | 'roleplay';
    completed: boolean;
    content?: string;
    scenario?: {
      setup: string;
      customerProfile: string;
      objectives: string[];
    };
    questions?: {
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }[];
  }[];
  performance: {
    quizScore: number;
    roleplayScore: number;
    practiceTime: number;
  };
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'quiz' | 'assessment' | 'roleplay';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  feedback?: {
    tone?: string;
    pace?: string;
    keywords?: string[];
    improvement?: string[];
  };
}

export const SalesCoach: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your AI Sales Coach. I'll help you improve your sales skills through personalized training, role-play scenarios, and real-time feedback. What would you like to work on today?" 
    }
  ]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<number | null>(null);
  const [isRoleplaying, setIsRoleplaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    confidence: 85,
    clarity: 78,
    engagement: 92,
    productKnowledge: 88
  });
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const synth = useRef<Tone.Synth | null>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const trainingModules: TrainingModule[] = [
    {
      id: '1',
      title: 'Sales Fundamentals',
      description: 'Master the basics of effective selling',
      progress: 75,
      completed: false,
      performance: {
        quizScore: 85,
        roleplayScore: 78,
        practiceTime: 120
      },
      units: [
        {
          id: '1-1',
          title: 'Introduction to Sales',
          type: 'video',
          completed: true,
          content: 'Learn the fundamental principles of successful selling.'
        },
        {
          id: '1-2',
          title: 'Building Rapport',
          type: 'roleplay',
          completed: false,
          scenario: {
            setup: "You're meeting a first-time customer interested in a high-end smartphone.",
            customerProfile: "Tech-savvy professional, budget-conscious, values quality",
            objectives: [
              "Establish rapport within first 30 seconds",
              "Identify key needs and preferences",
              "Present relevant features and benefits"
            ]
          }
        },
        {
          id: '1-3',
          title: 'Understanding Customer Needs',
          type: 'quiz',
          completed: false,
          questions: [
            {
              question: 'What is the most effective way to identify customer needs?',
              options: [
                'Assume what they want',
                'Ask open-ended questions',
                'Tell them what they need',
                'Skip the discovery phase'
              ],
              correctAnswer: 'Ask open-ended questions',
              explanation: 'Open-ended questions encourage customers to share detailed information about their needs and preferences, helping you provide better solutions.'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Advanced Techniques',
      description: 'Learn advanced sales strategies and negotiations',
      progress: 30,
      completed: false,
      performance: {
        quizScore: 92,
        roleplayScore: 85,
        practiceTime: 90
      },
      units: [
        {
          id: '2-1',
          title: 'Negotiation Skills',
          type: 'video',
          completed: true,
          content: 'Advanced negotiation techniques for closing deals.'
        },
        {
          id: '2-2',
          title: 'Handling Objections',
          type: 'roleplay',
          completed: false,
          scenario: {
            setup: "Customer is concerned about the price of a premium laptop.",
            customerProfile: "Small business owner, price-sensitive, needs reliability",
            objectives: [
              "Acknowledge the concern professionally",
              "Demonstrate value proposition",
              "Present financing options if appropriate"
            ]
          }
        },
        {
          id: '2-3',
          title: 'Closing Techniques',
          type: 'quiz',
          completed: false,
          questions: [
            {
              question: 'What is the assumptive close technique?',
              options: [
                'Assuming the sale is lost',
                'Proceeding as if the customer has already decided to buy',
                'Closing without asking',
                'Avoiding the close'
              ],
              correctAnswer: 'Proceeding as if the customer has already decided to buy',
              explanation: 'The assumptive close is a technique where you proceed with the sale as if the customer has already made the decision to buy, helping to move the process forward naturally.'
            }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    // Initialize Tone.js
    synth.current = new Tone.Synth().toDestination();
    Tone.start();

    return () => {
      if (synth.current) {
        synth.current.dispose();
      }
    };
  }, []);

  const startRoleplay = (moduleId: string, unitId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    const unit = module?.units.find(u => u.id === unitId);
    
    if (unit?.type === 'roleplay' && unit.scenario) {
      setIsRoleplaying(true);
      setChatHistory(prev => [...prev,
        {
          role: 'system',
          type: 'roleplay',
          content: 'Starting role-play scenario...'
        },
        {
          role: 'assistant',
          type: 'roleplay',
          content: `Scenario: ${unit.scenario.setup}\n\nCustomer Profile: ${unit.scenario.customerProfile}\n\nObjectives:\n${unit.scenario.objectives.map(obj => `- ${obj}`).join('\n')}`
        }
      ]);
    }
  };

  const startQuiz = (moduleId: string, unitId: string) => {
    const module = trainingModules.find(m => m.id === moduleId);
    const unit = module?.units.find(u => u.id === unitId);
    
    if (unit?.type === 'quiz' && unit.questions) {
      setCurrentQuiz(0);
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        type: 'quiz',
        content: unit.questions[0].question,
        options: unit.questions[0].options,
        correctAnswer: unit.questions[0].correctAnswer,
        explanation: unit.questions[0].explanation
      }]);
    }
  };

  const handleQuizAnswer = (answer: string, correctAnswer: string, explanation: string) => {
    const isCorrect = answer === correctAnswer;
    
    if (audioFeedback) {
      // Play feedback tone
      const note = isCorrect ? 'C4' : 'A3';
      if (synth.current) {
        synth.current.triggerAttackRelease(note, '0.3');
      }
    }

    setChatHistory(prev => [...prev,
      { role: 'user', content: answer },
      {
        role: 'assistant',
        content: `${isCorrect ? "✓ That's correct!" : "✗ Not quite."}\n\n${explanation}\n\n${isCorrect ? "Great job understanding this concept!" : "Let's review this topic to ensure full understanding."}`,
        feedback: {
          improvement: isCorrect ? [] : ['Review the related training materials', 'Practice with more scenarios']
        }
      }
    ]);

    setCurrentQuiz(null);
    setIsAssessing(false);
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { role: 'user' as const, content: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    resetTranscript();

    // Simulate AI response with training integration
    setTimeout(() => {
      const lowerMessage = message.toLowerCase();
      let response: ChatMessage;

      if (isRoleplaying) {
        response = {
          role: 'assistant',
          type: 'roleplay',
          content: "That's a good approach! Here's some feedback on your response:",
          feedback: {
            tone: "Professional and confident",
            pace: "Good rhythm, clear enunciation",
            keywords: ["value proposition", "customer needs", "solution"],
            improvement: [
              "Try incorporating more specific product features",
              "Consider addressing potential objections proactively"
            ]
          }
        };
      } else if (lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
        setIsAssessing(true);
        response = {
          role: 'assistant',
          content: "I'll help you review your knowledge. Let's start with a question about building rapport:",
          type: 'assessment'
        };
      } else if (lowerMessage.includes('progress') || lowerMessage.includes('training')) {
        response = {
          role: 'assistant',
          content: "Based on your current progress and performance metrics:\n\n" +
                  "✓ Strong areas:\n" +
                  "- Customer engagement (92%)\n" +
                  "- Product knowledge (88%)\n\n" +
                  "Areas for improvement:\n" +
                  "- Clarity in communication (78%)\n\n" +
                  "I recommend focusing on the 'Handling Objections' unit next. Would you like to start a role-play scenario or take a quiz to test your knowledge?"
        };
      } else {
        response = {
          role: 'assistant',
          content: "I understand you're asking about sales techniques. Let me provide some guidance based on your training progress and recent performance metrics..."
        };
      }

      setChatHistory(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Book className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Training Progress</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Audio Feedback:</span>
                <button
                  onClick={() => setAudioFeedback(!audioFeedback)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    audioFeedback
                      ? 'text-blue-400 bg-blue-500/20'
                      : 'text-gray-400 bg-gray-900/50'
                  }`}
                >
                  {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-sm text-gray-400">
                Overall Progress: <span className="text-blue-400 font-medium">52%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {Object.entries(performanceMetrics).map(([metric, value]) => (
              <div
                key={metric}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-blue-400 font-medium">{value}%</span>
                </div>
                <div className="relative h-2 bg-gray-700 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {trainingModules.map(module => (
              <div
                key={module.id}
                className="bg-gray-900/50 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-400">{module.progress}%</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Quiz Score: {module.performance.quizScore}%
                    </div>
                  </div>
                </div>

                <div className="relative h-2 bg-gray-700 rounded-full mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {module.units.map(unit => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => {
                        if (unit.type === 'quiz') startQuiz(module.id, unit.id);
                        if (unit.type === 'roleplay') startRoleplay(module.id, unit.id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        {unit.type === 'video' && <Play className="w-4 h-4 text-blue-400" />}
                        {unit.type === 'document' && <Book className="w-4 h-4 text-purple-400" />}
                        {unit.type === 'quiz' && <Brain className="w-4 h-4 text-yellow-400" />}
                        {unit.type === 'roleplay' && <Video className="w-4 h-4 text-green-400" />}
                        <span className="text-sm">{unit.title}</span>
                      </div>
                      {unit.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <div className="flex items-center space-x-2">
                          {unit.type === 'roleplay' && (
                            <span className="text-xs text-gray-400">Practice Now</span>
                          )}
                          {unit.type === 'quiz' && (
                            <span className="text-xs text-gray-400">Take Quiz</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gray-800/50 rounded-xl border border-gray-700 flex flex-col h-[calc(100vh-8rem)]"
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessagesSquare className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold">AI Sales Coach</h2>
            </div>
            <div className="flex items-center space-x-2">
              {browserSupportsSpeechRecognition && (
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    listening
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-900/50 text-gray-400 hover:text-blue-400'
                  }`}
                >
                  {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              {isRoleplaying && (
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-2 rounded-lg transition-colors ${
                    isRecording
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-900/50 text-gray-400 hover:text-blue-400'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isRecording && (
            <div className="mb-4">
              <Webcam
                ref={webcamRef}
                audio={false}
                className="rounded-lg w-full"
              />
            </div>
          )}

          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-blue-100'
                    : msg.role === 'system'
                    ? 'bg-purple-500/20 text-purple-100'
                    : 'bg-gray-900/50 text-gray-200'
                }`}
              >
                {msg.type === 'quiz' ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-yellow-400" />
                      <span className="font-medium">Quiz Question</span>
                    </div>
                    <p>{msg.content}</p>
                    {msg.options && (
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {msg.options.map((option, i) => (
                          <button
                            key={i}
                            onClick={() => msg.correctAnswer && msg.explanation && 
                              handleQuizAnswer(option, msg.correctAnswer, msg.explanation)}
                            className="text-left px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : msg.type === 'roleplay' ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-green-400" />
                      <span className="font-medium">Role-play Scenario</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.feedback && (
                      <div className="mt-4 space-y-2">
                        {msg.feedback.tone && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Tone:</span>
                            <span>{msg.feedback.tone}</span>
                          </div>
                        )}
                        {msg.feedback.pace && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400">Pace:</span>
                            <span>{msg.feedback.pace}</span>
                          </div>
                        )}
                        {msg.feedback.keywords && (
                          <div>
                            <span className="text-gray-400">Key phrases used:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {msg.feedback.keywords.map((keyword, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {msg.feedback.improvement && (
                          <div>
                            <span className="text-gray-400">Areas for improvement:</span>
                            <ul className="mt-1 space-y-1">
                              {msg.feedback.improvement.map((item, i) => (
                                <li key={i} className="flex items-center space-x-2">
                                  <span className="text-yellow-400">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : msg.type === 'assessment' ? (
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <p>{msg.content}</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={listening ? 'Listening...' : 'Ask your AI coach...'}
              className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <MessagesSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};