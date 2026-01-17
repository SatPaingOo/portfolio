import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini, initializeChat, isApiAvailable } from '../services/geminiService';
import { ChatMessage } from '../types';

// Typing animation component
const TypingText: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return <>{displayedText}</>;
};

interface ChatInterfaceProps {
  onViewChange: (view: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onViewChange }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const hasInitialized = useRef(false); // Prevent double execution in React StrictMode
  const completedTypingMessages = useRef<Set<string>>(new Set()); // Track messages that finished typing

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;
    
    // Check API availability first
    const apiAvailable = isApiAvailable();
    
    // Only initialize if API is available
    if (apiAvailable) {
      initializeChat();
      // Wait a bit to ensure initialization completes, then check again
      setTimeout(() => {
        if (isApiAvailable()) {
          handleSendMessage("Show me everything and explain how your data is structured.", true);
        } else {
          // If API became unavailable, use offline greeting
          console.log('Aura: API unavailable after initialization - using offline mode');
          handleSendMessage("Show me everything", true);
        }
      }, 100);
    } else {
      // If no API key or quota exceeded, show offline greeting without initializing
      console.log('Aura: Starting in offline mode - no API calls will be made');
      handleSendMessage("Show me everything", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string, isInitial = false) => {
    if (!text.trim()) return;

    if (!isInitial) {
        const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
    }

    setIsLoading(true);

    // Heuristic view switching based on user input for better UX
    const lowerText = text.toLowerCase();
    if (lowerText.includes('project')) onViewChange('PROJECTS');
    else if (lowerText.includes('skill')) onViewChange('SKILLS');
    else if (lowerText.includes('history') || lowerText.includes('experience') || lowerText.includes('education')) onViewChange('HISTORY');
    else if (lowerText.includes('gallery') || lowerText.includes('photo') || lowerText.includes('image') || lowerText.includes('picture')) onViewChange('GALLERY');
    else if (lowerText.includes('home') || lowerText.includes('intro')) onViewChange('HOME');

    try {
      const responseText = await sendMessageToGemini(text);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
        skipTyping: isInitial // Skip typing for initial message
      };
      
      // If skipping typing, mark as completed immediately
      if (isInitial) {
        completedTypingMessages.current.add(modelMsg.id);
      }
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Typing animation component
  const TypingText: React.FC<{ text: string; messageId: string }> = ({ text, messageId }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      // If this message already completed typing, show full text immediately
      if (completedTypingMessages.current.has(messageId)) {
        setDisplayedText(text);
        setIsComplete(true);
        return;
      }

      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(text.slice(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, 15); // Typing speed (lower = faster, 15ms = smooth)
        
        return () => clearTimeout(timeout);
      } else if (currentIndex >= text.length && !isComplete) {
        // Mark as complete when typing finishes
        completedTypingMessages.current.add(messageId);
        setIsComplete(true);
      }
    }, [currentIndex, text, messageId, isComplete]);

    // Only reset if this is a completely new message (not in completed set)
    useEffect(() => {
      if (!completedTypingMessages.current.has(messageId)) {
        setDisplayedText('');
        setCurrentIndex(0);
        setIsComplete(false);
      }
    }, [messageId]);

    return formatText(displayedText);
  };

  const formatText = (text: string) => {
    // Split by lines first to preserve line breaks
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Special handling for Aura's "materializes" stage-direction line:
      // Render it as a subtle, italicized system cue instead of a long, noisy bracketed sentence.
      if (line.trim() === '[Aura materializes as a semi-transparent cyan wireframe projection, casting a soft glow over the screen.]') {
        return (
          <div
            key={`line-${lineIndex}`}
            className="mb-2 text-xs italic text-holo-400"
          >
            Aura appears as a holographic guide.
          </div>
        );
      }
      
      // Skip empty lines but preserve spacing
      if (line.trim() === '') {
        return <br key={`line-${lineIndex}`} />;
      }
      
      // Parse **bold** markdown within each line
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={`${lineIndex}-${partIndex}`} className="text-holo-300 font-bold drop-shadow-[0_0_5px_rgba(56,223,255,0.8)]">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
      });
      
      return (
        <div key={`line-${lineIndex}`} className="mb-1">
          {formattedParts}
        </div>
      );
    });
  };

  return (
    <div className={`fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 transition-all duration-500 ease-in-out ${isOpen ? 'w-[calc(100vw-24px)] sm:w-[90vw] md:w-[450px] max-w-[450px] h-[calc(100vh-120px)] sm:h-[500px] md:h-[600px] max-h-[600px]' : 'w-14 h-14 sm:w-16 sm:h-16'}`}>
      {isOpen ? (
        <div className="flex flex-col h-full glass-panel rounded-lg overflow-hidden border border-holo-500/50 shadow-[0_0_30px_rgba(0,171,209,0.3)]">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-holo-500/30 bg-black/40 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-holo-400 flex items-center justify-center relative bg-black flex-shrink-0">
                 {/* Simple Geometric Representation of Aura */}
                 <div className="w-5 h-5 sm:w-6 sm:h-6 border border-holo-300 rotate-45 animate-spin-slow"></div>
                 <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-holo-400/60 blur-sm rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-base sm:text-lg text-holo-100 tracking-wider truncate">AURA</h3>
                <span className="text-[10px] sm:text-xs text-holo-400 uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-holo-400 rounded-full animate-pulse flex-shrink-0"></span> <span className="truncate">Local Mode</span>
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-holo-400 hover:text-white transition-colors flex-shrink-0 p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 font-mono text-xs sm:text-sm min-h-0">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-holo-900/50 border border-holo-700 text-holo-50' : 'bg-black/40 border border-holo-500/30 text-holo-100'}`}>
                  {msg.role === 'model' && (
                      <div className="text-xs text-holo-500 mb-1 font-display uppercase tracking-widest opacity-70">
                        Aura Response
                      </div>
                  )}
                  <div className="leading-relaxed">
                    {msg.role === 'model' && !msg.skipTyping && !completedTypingMessages.current.has(msg.id) ? (
                      <TypingText text={msg.text} messageId={msg.id} />
                    ) : (
                      formatText(msg.text)
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
               <div className="flex justify-start">
                   <div className="max-w-[85%] p-3 rounded-lg bg-black/40 border border-holo-500/30">
                       <div className="flex gap-1 items-center h-5">
                           <div className="w-1.5 h-1.5 bg-holo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-holo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                           <div className="w-1.5 h-1.5 bg-holo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                       </div>
                   </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 sm:p-3 bg-black/40 border-t border-holo-500/30 flex-shrink-0">
            <div className="flex gap-1.5 sm:gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                placeholder="Ask AURA..."
                className="flex-1 bg-holo-950/50 border border-holo-700 rounded p-1.5 sm:p-2 text-holo-100 focus:outline-none focus:border-holo-400 placeholder-holo-700 font-mono text-xs sm:text-sm min-w-0"
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="px-2 sm:px-4 bg-holo-800 hover:bg-holo-600 text-white rounded border border-holo-500 transition-colors disabled:opacity-50 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-full rounded-full glass-panel border border-holo-400 flex items-center justify-center hover:scale-110 transition-transform group cursor-pointer"
        >
             {/* Simple Geometric Representation of Aura (Minimised) */}
             <div className="w-8 h-8 border border-holo-300 rotate-45 animate-spin-slow group-hover:border-white transition-colors"></div>
             <div className="absolute w-5 h-5 bg-holo-400/50 blur-sm rounded-full animate-pulse"></div>
        </button>
      )}
    </div>
  );
};

export default ChatInterface;