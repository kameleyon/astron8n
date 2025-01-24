"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateAIResponse } from "@/lib/openrouter";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from 'uuid';

export default function ChatInterfaceindex() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Only scroll when new messages are added
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Only scroll when messages change and there are messages
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

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

      // Add user message
      const userMessage: Message = {
        id: uuidv4(),
        content: newMessage,
        role: 'user',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // Generate AI response
      const aiResponse = await generateAIResponse(
        messages.concat(userMessage).map(msg => ({
          role: msg.role,
          content: msg.content,
        }))
      );

      // Add AI response
      const assistantMessage: Message = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Store messages in Supabase
      const { error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            content: userMessage.content,
            is_bot: false
          },
          {
            user_id: user.id,
            content: assistantMessage.content,
            is_bot: true
          }
        ]);

      if (insertError) throw insertError;

    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container bg-white/50 border border-white/80 shadow-lg shadow-black min-h-[500px] md:min-h-[600px] w-full flex flex-col transform hover:scale-[1.02] transition-all duration-300">
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {messages.length === 0 && (
          <div className="bg-[#FFF3E0] text-gray-800 p-4 rounded-2xl inline-block max-w-[80%]">
            Hello! I'm your astrological AI assistant. How can I help you today?
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user'
                ? 'flex justify-end'
                : 'flex justify-start'
            }`}
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
          <div className="flex items-center space-x-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 md:p-6 pt-2">
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
            placeholder="Ask me anything about astrology..."
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