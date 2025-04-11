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
    <div className="chat-container backdrop-blur-md bg-white/20 border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] mt-16 mb-8 h-[600px] w-full flex flex-col transition-all duration-300 rounded-3xl overflow-hidden">
      {/* Header with gradient */}
      <div className="p-5 border-b border-white/20 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md">
        <h2 className="text-xl font-comfortaa font-bold text-white">
          Chat with AstroGenie
        </h2>
      </div>

      {/* Message container with subtle pattern */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0 relative message-container bg-gradient-to-b from-white/10 to-white/5">
        <div className="space-y-6">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`p-4 rounded-2xl max-w-[80%] animate-fade-in shadow-lg ${
                  message.isUser 
                    ? 'bg-gradient-to-br from-lightgray to-palegray/70 text-gray-800 backdrop-blur-sm border border-white/40' 
                    : 'bg-gradient-to-br from-lightorange/90 to-cream/90 text-gray-800 backdrop-blur-sm border border-white/40'
                }`}
              >
                <p className="font-questrial">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested questions */}
      <div className="px-6 py-4 flex flex-wrap gap-2 justify-center bg-gradient-to-r from-white/10 to-white/5 border-t border-white/10">
        <button className="px-4 py-2 bg-white/5 hover:bg-white/30 text-[#cd6301]/90 rounded-full text-sm backdrop-blur-md  transition-all duration-300 shadow-sm hover:shadow-md">
          Will I get the job at the dealership?
        </button>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/30 text-[#cd6301]/90  rounded-full text-sm backdrop-blur-md  transition-all duration-300 shadow-sm hover:shadow-md">
          Should I invest in crypto?
        </button>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/30 text-[#cd6301]/90  rounded-full text-sm backdrop-blur-md  transition-all duration-300 shadow-sm hover:shadow-md">
          What period would be best to start a business?
        </button>
      </div>

      {/* Input area with modern styling */}
      <div className="p-5 bg-gradient-to-r from-white/10 to-white/5 border-t border-white/10">
        <div className="flex items-center gap-3 bg-white/20 p-3 rounded-full shadow-md backdrop-blur-md border border-white/30">
          <div className="w-6 h-6 flex items-center justify-center text-primary/40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Sign in to start chatting..."
            className="flex-1 bg-transparent border-none focus:outline-none text-primary placeholder-primary/50 text-sm md:text-base font-questrial"
            disabled
          />
          <button className="w-8 h-8 flex items-center justify-center bg-primary/80 hover:bg-primary text-white rounded-full transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
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
        
        .message-container {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
