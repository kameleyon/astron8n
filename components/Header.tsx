"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MessageCircle, Settings, History, BookOpenText, LogOut, User} from "lucide-react";
import MobileMenu from "./MobileMenu";
import AuthModal from "./AuthModal";

interface HeaderProps {
  onAuth: (mode: 'login' | 'signup') => void;
}

export default function Header({ onAuth }: HeaderProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setIsAuthenticated(!!session);
          setIsLoading(false);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            setIsAuthenticated(!!session);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-primary to-primary/90 text-white py-4 relative z-50 font-questrial shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('/subtle-pattern.png')] opacity-5"></div>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center relative">
          <MobileMenu />
          
          <div className="hidden md:flex space-x-8 items-center text-xl">
            <a href="/about" className="hover:text-white/80 transition-colors font-medium tracking-wide">About</a>
            <span className="text-white">|</span>
            <a href="/features" className="hover:text-white/80 transition-colors font-medium tracking-wide">Features</a>
          </div>

          

          {isLoading ? (
            <div className="w-24 h-10 bg-white/10 rounded-xl animate-pulse backdrop-blur-sm" />
          ) : isAuthenticated ? (
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-2">
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Chat with Astrogenie"
                >
                  <MessageCircle size={20} className="drop-shadow-sm" />
                </button>
                <button 
                  onClick={() => router.push('/profile')}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Profile"
                >
                  <User size={20} className="drop-shadow-sm" />
                </button>
                <button 
                  onClick={() => router.push('/chat-history')}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Chat History"
                >
                  <History size={20} className="drop-shadow-sm" />
                </button>
                <button 
                  onClick={() => router.push('/reports')}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Reports"
                >
                  <BookOpenText size={20} className="drop-shadow-sm" />
                </button>
                <button 
                  onClick={() => router.push('/settings')}
                  className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md"
                  title="Settings"
                >
                  <Settings size={20} className="drop-shadow-sm" />
                </button>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-all duration-300 hover:shadow-md ml-2"
                title="Logout"
              >
                <LogOut size={20} className="text-accent drop-shadow-sm" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-accent/50 backdrop-blur-sm text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
            >
              Sign in
            </button>
          )}
        </nav>
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultMode="login"
      />
    </>
  );
}
