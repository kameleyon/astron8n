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
        <div className="fixed top-[4rem] left-0 right-0 bg-gradient-to-b from-primary to-primary/95 shadow-xl border-t border-white/10">
          <div className="backdrop-blur-md py-6 px-6 space-y-4 mobile-menu font-jost">
            <button 
              onClick={() => {
                router.push('/dashboard');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md group"
            >
              <MessageCircle size={20} className="mr-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              <span className="font-medium">Chat</span>
            </button>
            <button 
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md group"
            >
              <User size={20} className="mr-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              <span className="font-medium">Profile</span>
            </button>
            <button 
              onClick={() => {
                router.push('/chat-history');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md group"
            >
              <History size={20} className="mr-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              <span className="font-medium">History</span>
            </button>
            <button 
              onClick={() => {
                router.push('/reports');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md group"
            >
              <BookOpenText size={20} className="mr-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              <span className="font-medium">Reports</span>
            </button>
            <button 
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className="flex items-center w-full py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md group"
            >
              <Settings size={20} className="mr-4 text-white/70 group-hover:text-white transition-colors duration-300" />
              <span className="font-medium">Settings</span>
            </button>
            
            <div className="pt-4 mt-2 border-t border-white/10">
              <a href="/about" className="block py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md font-medium">About</a>
              <a href="/features" className="block py-3 px-5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md font-medium">Features</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
