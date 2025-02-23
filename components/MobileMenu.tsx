"use client";

import { Menu, X, MessageCircle, Settings, History, BookOpenText, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="md:hidden relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="fixed top-[3.5rem] left-0 right-0 bg-primary shadow-lg border-t border-white/10">
          <div className="bg-[#0d0630] backdrop-blur-sm py-4 px-6 space-y-4 mobile-menu">
            <button 
              onClick={() => {
                router.push('/dashboard');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            >
              <MessageCircle size={20} className="mr-3" />
              Chat
            </button>
            <button 
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            >
              <User size={20} className="mr-3" />
              Profile
            </button>
            <button 
              onClick={() => {
                router.push('/chat-history');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            >
              <History size={20} className="mr-3" />
              History
            </button>
            <button 
              onClick={() => {
                router.push('/reports');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            >
              <BookOpenText size={20} className="mr-3" />
              Reports
            </button>
            <button 
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings size={20} className="mr-3" />
              Settings
            </button>
            <div className="pt-2 border-t border-white/10">
              <a href="/about" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">About</a>
              <a href="/features" className="block py-2 px-4 hover:bg-white/10 rounded-lg transition-colors">Features</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
