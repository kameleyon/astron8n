"use client";

import { useState, useEffect } from "react";

interface Message {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
}

export default function ChatInterfaceindex() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const conversation: Message[] = [
    { text: "Hi AstroGenie! I need some advice...", isUser: true },
    { text: "Of course! I'm here to help. What's on your mind?", isUser: false },
    { text: "Well... there's this person at work I really like. We've been flirting a bit and I think they might ask me out.", isUser: true },
    { text: "I see! And you're wondering if you should pursue this?", isUser: false },
    { text: "Yeah... They're really sweet and we have great chemistry, but I'm worried about dating someone from work.", isUser: true },
    { text: "That's a valid concern! Let me check your astrological aspects regarding relationships and career...", isUser: false },
    { text: "What's interesting is that Venus is currently in your 10th house of career, creating both opportunities and challenges in workplace relationships.", isUser: false },
    { text: "What do you mean by challenges?", isUser: true },
    { text: "Well, while there's potential for a meaningful connection, you'll need to navigate professional boundaries carefully. Are they in your direct team?", isUser: false },
    { text: "Actually... they're going to be my new project lead next month 😅", isUser: true },
    { text: "Oh! That adds another layer of complexity. Your chart shows strong leadership qualities, but Saturn's position suggests potential conflicts between personal and professional life.", isUser: false },
    { text: "So you think I should say no if they ask?", isUser: true },
    { text: "Not necessarily. Your chart actually shows good compatibility for balancing relationships. Just make sure to:", isUser: false },
    { text: "1. Check your company's policies on workplace relationships\n2. Establish clear boundaries between work and personal life\n3. Discuss how you'll handle professional interactions\n4. Have a plan for if things don't work out", isUser: false },
    { text: "Those are really good points... I hadn't thought about all of that!", isUser: true },
    { text: "Remember, Mars enters your 7th house next week - a powerful time for new relationships. Just proceed with awareness and clear communication!", isUser: false },
  ];

  useEffect(() => {
    const messageContainer = document.querySelector('.message-container');

    if (currentIndex < conversation.length) {
      // Calculate natural delay based on context
      const baseDelay = conversation[currentIndex].text.length * 25;
      const contextDelay = currentIndex > 0 && !conversation[currentIndex].isUser && 
        conversation[currentIndex - 1].isUser ? 600 : 200;
      const randomVariance = Math.random() * 300;
      
      const messageDelay = Math.min(
        baseDelay + contextDelay + randomVariance,
        conversation[currentIndex].isUser ? 800 : 1500
      );

      const timer = setTimeout(() => {
        setMessages(prev => [...prev, conversation[currentIndex]]);

        // Scroll to bottom smoothly
        if (messageContainer) {
          setTimeout(() => {
            messageContainer.scrollTo({
              top: messageContainer.scrollHeight,
              behavior: 'smooth'
            });
          }, 100);
        }

        setCurrentIndex(prev => prev + 1);
      }, messageDelay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  return (
    <div className="chat-container bg-white/50 border border-white/80 shadow-md shadow-black mt-16 mb-8 h-[600px] w-full flex flex-col transition-all duration-300">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-lg font-semibold text-gray-800">Chat with AstroGenie</h2>
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 relative message-container">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`p-3 rounded-2xl max-w-[80%] animate-fade-in ${
                  message.isUser 
                    ? 'bg-[#E3F2FD] text-gray-800 hover:bg-[#BBDEFB] transition-colors' 
                    : 'bg-[#FFF3E0] text-gray-800 hover:bg-[#FFE0B2] transition-colors'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 pt-2 bg-white/1 rounded-lg border-t border-white/20">
        <div className="flex items-center gap-3 bg-white p-2 rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Sign in to start chatting..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 text-sm md:text-base"
            disabled
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes message-in {
          0% {
            opacity: 0;
            transform: translateY(15px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: message-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
