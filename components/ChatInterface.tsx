"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, AlertCircle, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateAIResponse } from "@/lib/openrouter";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams, useRouter } from 'next/navigation';

const suggestedQuestions = [
  "Will I get the job at the dealership",
  "Should I invest in crypto",
  "Is it a good time to call Jessica?",
  "What are Jack's intentions about me?",
  "what period would be best to start a business?"
];

export default function ChatInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [userProfile, setUserProfile] = useState<any>(null);
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
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    const sessionParam = searchParams.get('session');
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
          role: msg.is_bot ? 'assistant' : 'user',
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
      const aiResponse = await generateAIResponse(
        messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        userProfile
      );

      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container bg-white/50 border border-white/80 shadow-md shadow-black mt-16 mb-8 h-[600px] w-full flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Chat with AstroGenie</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={startNewChat}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="New Chat"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 relative">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[80%] ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-[#FFF3E0] text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-white">
              <Loader2 className="h-4 w-4 text-white font-bold animate-spin" />
              <span>Thinking...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div ref={messagesEndRef} />

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded-full text-sm transition-colors shadow-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 md:p-6 pt-2 bg-white/1 rounded-lg border-t border-white/20">
        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300">
          <button 
            type="button" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <Mic className="text-primary" size={20} />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask me anything"
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-sm md:text-base"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !newMessage.trim()}
          >
            <Send className="text-primary" size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}