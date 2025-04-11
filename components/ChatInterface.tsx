"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// TypeScript declarations for Web Speech API
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}
import { Mic, MicOff, Send, AlertCircle, Loader2, Plus, Coins } from "lucide-react";
import { supabase } from "../lib/supabase";
import { generateAIResponse } from "../lib/openrouter";
import { Message } from "../types/chat";
import { TypingAnimation } from "./ui/TypingAnimation";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams, useRouter } from 'next/navigation';
import { checkUserCredits } from "../lib/utils/credits";
import ReactMarkdown from 'react-markdown';

const suggestedQuestions = [
  "Will I get the job at the dealership",
  "Should I invest in crypto",
  "Is it a good time to call Jessica?",
  "What are Jack's intentions about me?",
  //"what period would be best to start a business?"
];

export default function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<(Message & { isTyping?: boolean })[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserProfile(profile);
          }

          // Check user credits
          const creditInfo = await checkUserCredits(user.id);
          setRemainingCredits(creditInfo.remainingCredits || 0);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const sessionParam = searchParams?.get('session');
    if (sessionParam) {
      setSessionId(sessionParam);
      loadSessionMessages(sessionParam);
    }
  }, [searchParams]);

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          content: msg.content,
          role: msg.is_bot ? 'assistant' as const : 'user' as const,
          createdAt: new Date(msg.created_at),
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
      setError('Failed to load previous messages');
    }
  };

  const startNewChat = () => {
    setSessionId(uuidv4());
    setMessages([]);
    router.push('/dashboard');
  };

  const handleSuggestedQuestion = (question: string) => {
    setNewMessage(question);
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map(result => (result[0] as SpeechRecognitionAlternative).transcript)
          .join('');
        setNewMessage(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setError('Microphone access was denied. Please check your browser permissions.');
        } else if (event.error === 'no-speech') {
          setError('No speech was detected. Please try again.');
        } else {
          setError(`Speech recognition error: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser. Please try using a modern browser like Chrome.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleSpeechRecognition = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Clear any previous errors
      setError(null);

      try {
        // Request microphone permission
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            recognitionRef.current?.start();
            setIsListening(true);
          })
          .catch((err) => {
            console.error('Microphone permission error:', err);
            setError('Please allow microphone access to use voice input.');
          });
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError("Failed to start speech recognition. Please try again.");
      }
    }
  }, [isListening]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Please sign in to send messages.');
      }

      // Check credits before proceeding
      const creditInfo = await checkUserCredits(user.id);
      if (!creditInfo.hasCredits) {
        throw new Error(creditInfo.error || 'Insufficient credits');
      }

      const userMessage: Message = {
        id: uuidv4(),
        content: newMessage,
        role: 'user',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // Store user message
      await supabase.from('messages').insert({
        user_id: user.id,
        session_id: sessionId,
        content: userMessage.content,
        is_bot: false,
        created_at: userMessage.createdAt.toISOString(),
      });

      // Generate AI response with user profile data
      const response = await generateAIResponse(
        messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        user.id,
        userProfile
      );

      const assistantMessage: Message = {
        id: uuidv4(),
        content: response.content,
        role: 'assistant',
        createdAt: new Date(),
      };

      const typingMessage = { ...assistantMessage, isTyping: true };
      setMessages(prev => [...prev, typingMessage]);
      setRemainingCredits(response.remainingCredits ?? null);

      // Store AI response
      await supabase.from('messages').insert({
        user_id: user.id,
        session_id: sessionId,
        content: assistantMessage.content,
        is_bot: true,
        created_at: assistantMessage.createdAt.toISOString(),
      });

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
      
      // Refresh credit info after error
      if (userId) {
        const creditInfo = await checkUserCredits(userId);
        setRemainingCredits(creditInfo.remainingCredits || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-white rounded-3xl border border-white/80 shadow-md mt-8 mb-8 h-[600px] w-full flex flex-col transition-all duration-300 font-questrial">
      {/* Header with gradient */}
      <div className="p-4 border-b border-white/20 bg-gradient-to-r from-primary/90 to-secondary/90 rounded-t-3xl flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Chat with AstroGenie</h2>
        <button
          onClick={startNewChat}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          title="New Chat"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 relative bg-white/95 dot-pattern">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[80%] shadow-md ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-primary to-primary/90 text-white'
                    : 'bg-gradient-to-r from-[#FFF3E0] to-cream text-gray-800'
                }`}
              >
              {message.role === 'assistant' ? (
                message.isTyping ? (
                  <TypingAnimation
                    content={message.content}
                    onComplete={() => {
                      setMessages(prev =>
                        prev.map(msg =>
                          msg.id === message.id ? { ...msg, isTyping: false } : msg
                        )
                      );
                    }}
                  />
                ) : (
                  <ReactMarkdown
                    className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )
              ) : (
                message.content
              )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-4 w-4 text-secondary animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
              {error.includes('credits') && (
                <a href="/billing" className="ml-2 text-primary hover:underline">
                  Get more credits
                </a>
              )}
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="absolute inset-x-0 bottom-0 px-4 py-0">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="bg-[#bcb7af]/20 hover:bg-primary/80 text-primary/90 hover:text-white px-4 py-2 rounded-full text-sm transition-colors shadow-sm border border-white/10 hover:shadow-md"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      
      
      <form onSubmit={handleSubmit} className="p-4 md:p-6 pt-2 bg-white/90 rounded-b-3xl border-t border-white/20">
        <div className="flex items-center gap-3 p-2 rounded-full  border-primary/40 shadow-sm bg-transparent hover:shadow-lg transition-shadow duration-300 border border-gray-100">
          <button 
            type="button" 
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isListening ? 'bg-primary/10' : ''}`}
            disabled={isLoading}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="text-primary animate-pulse" size={20} />
            ) : (
              <Mic className="text-primary" size={20} />
            )}
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me anything"
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-sm md:text-base  placeholder-primary/50"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !newMessage.trim() || remainingCredits === 0}
          >
            <Send className="text-primary" size={20} />
          </button>
        </div>
      </form>
      {/* Credits display at the bottom 
      {remainingCredits !== null && (
        <div className="px-4 py-3 border-t-2 border-[#bcb7af]/50  bg-primary/40 mt-4 text-primary/50">
          <div className="flex justify-center items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">{remainingCredits}</span>
              <span className="text-xs text-white/70">Credits left</span>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="flex flex-col items-center">
              <a href="/billing" className="text-lg font-bold hover:text-secondary transition-colors">5000</a>
              <span className="text-xs text-white/70">Topup Credits</span>
            </div>
          </div>
        </div>*/}
      )}
    </div>
  );
}
