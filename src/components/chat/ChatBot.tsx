import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, FileText, Target, Lightbulb, TrendingUp, Users, Zap, Send, MessageCircle } from 'lucide-react';
import { sendChatMessage } from '../../api/chat';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  paperTitle: string;
  paperSummary: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ paperTitle, paperSummary }) => {
  const [customQuestion, setCustomQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isInChatMode, setIsInChatMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isLoading]);

  const onClose = () => {
    setIsOpen(false);
    setCustomQuestion('');
    setChatHistory([]);
    setIsInChatMode(false);
  };

  const suggestions = [
    {
      id: 'summary',
      title: 'Research Summary',
      description: 'Get a clear overview of the study',
      prompt: 'Can you provide a comprehensive summary of this research paper?',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'objectives',
      title: 'Research Objectives',
      description: 'What were the main goals?',
      prompt: 'What were the main research objectives and goals of this study?',
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: 'methods',
      title: 'Methodology',
      description: 'How was the research conducted?',
      prompt: 'Can you explain the methodology and research approach used in this study?',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: 'findings',
      title: 'Key Findings',
      description: 'What were the main results?',
      prompt: 'What are the key findings and results of this research?',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      id: 'implications',
      title: 'Implications',
      description: 'Why does this matter?',
      prompt: 'What are the implications and significance of these findings?',
      icon: <Lightbulb className="w-5 h-5" />,
    },
    {
      id: 'applications',
      title: 'Applications',
      description: 'How can this be used?',
      prompt: 'What are the potential applications and future directions for this research?',
      icon: <Users className="w-5 h-5" />,
    }
  ];


  const handleCustomQuestion = async () => {
    if (!customQuestion.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = customQuestion.trim();
    setCustomQuestion('');
    
    // Add user message to chat history
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    setIsInChatMode(true);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        paperTitle,
        paperSummary
      });

      // Add AI response to chat history
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomQuestion();
    }
  };

  return (
    <>
      {/* Floating Chatbot Button - Always Visible */}
      <motion.button
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ 
          type: 'spring', 
          damping: 30, 
          stiffness: 300,
          mass: 0.8
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-2xl shadow-cyan-500/30 z-50 flex items-center justify-center hover:scale-105 transition-transform duration-200 group"
        title="Ask AI Assistant"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            
            {/* Chatbot Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ 
                type: 'spring', 
                damping: 25, 
                stiffness: 400,
                mass: 0.5
              }}
              className="fixed bottom-0 right-0 h-[600px] w-96 bg-slate-900 border-t border-l border-cyan-400/20 shadow-2xl shadow-cyan-500/10 z-50 flex flex-col rounded-t-lg max-h-[80vh]"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-400/20 bg-slate-800/50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-cyan-300">Research Assistant</h3>
                  <p className="text-xs text-slate-400">Click to explore this paper</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors group"
                title="Close chatbot"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {!isInChatMode ? (
                <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
                  {/* Main Prompt Window */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageCircle className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-semibold text-lg text-emerald-300">Start a Conversation</h4>
                      </div>
                      
                      <div>
                        <textarea
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask anything about this research paper..."
                          className="w-full px-3 py-3 bg-slate-700/50 border border-emerald-400/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/20 resize-none"
                          rows={3}
                          disabled={isLoading}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={handleCustomQuestion}
                          disabled={!customQuestion.trim() || isLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Start Chat
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Collapsible Suggestions */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
                    className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-sm text-slate-300">Quick Start Questions</h5>
                      <span className="text-xs text-slate-500">Click to begin chat</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {suggestions.map((suggestion) => (
                        <motion.button
                          key={suggestion.id}
                          onClick={async () => {
                            setCustomQuestion(suggestion.prompt);
                            setIsLoading(true);
                            const userMessage = suggestion.prompt;
                            
                            // Add user message to chat history
                            const newUserMessage: ChatMessage = {
                              id: Date.now().toString(),
                              type: 'user',
                              content: userMessage,
                              timestamp: new Date()
                            };
                            
                            setChatHistory(prev => [...prev, newUserMessage]);
                            setIsInChatMode(true);

                            try {
                              const response = await sendChatMessage({
                                message: userMessage,
                                paperTitle,
                                paperSummary
                              });

                              // Add AI response to chat history
                              const aiMessage: ChatMessage = {
                                id: (Date.now() + 1).toString(),
                                type: 'ai',
                                content: response.response,
                                timestamp: new Date()
                              };
                              
                              setChatHistory(prev => [...prev, aiMessage]);
                            } catch (error) {
                              console.error('Chat API Error:', error);
                              const errorMessage: ChatMessage = {
                                id: (Date.now() + 1).toString(),
                                type: 'ai',
                                content: 'Sorry, I encountered an error while processing your question. Please try again.',
                                timestamp: new Date()
                              };
                              setChatHistory(prev => [...prev, errorMessage]);
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="p-2 bg-slate-700/50 border border-cyan-400/20 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-400/40 transition-all duration-200 text-left group"
                          disabled={isLoading}
                        >
                          <div className="flex items-center gap-2">
                            <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                              {suggestion.icon}
                            </div>
                            <div>
                              <h6 className="font-medium text-xs text-slate-200 group-hover:text-cyan-100 transition-colors">
                                {suggestion.title}
                              </h6>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar min-h-0">
                    <div className="space-y-4 min-h-full">
                      {chatHistory.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-100' 
                              : 'bg-slate-800/50 border border-slate-700/50 text-slate-200'
                          }`}>
                            <div className="prose prose-invert max-w-none text-sm">
                              <div className="whitespace-pre-line">{message.content}</div>
                            </div>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-slate-800/50 border border-slate-700/50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-slate-400">
                              <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Auto-scroll anchor */}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                  
                  {/* Chat Input - Fixed at bottom */}
                  <div className="flex-shrink-0 p-4 border-t border-cyan-400/20 bg-slate-800/50">
                    <div className="flex gap-2">
                      <textarea
                        value={customQuestion}
                        onChange={(e) => setCustomQuestion(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Continue the conversation..."
                        className="flex-1 px-3 py-2 bg-slate-700/50 border border-cyan-400/20 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/20 resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleCustomQuestion}
                        disabled={!customQuestion.trim() || isLoading}
                        className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;