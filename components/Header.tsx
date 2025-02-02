"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Settings, History, FileText, LogOut, User, Key } from "lucide-react";
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
      <header className="bg-[#0d0630] text-white py-3 relative z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <MobileMenu />
          
          <div className="hidden md:flex space-x-8 items-center text-sm">
            <a href="/about" className="hover:text-white/80 transition-colors">About</a>
            <span className="text-gray-500">|</span>
            <a href="/features" className="hover:text-white/80 transition-colors">Features</a>
            
            
          </div>

          {isLoading ? (
            <div className="w-24 h-8 bg-gray-600/40 rounded-xl animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push('/profile')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Profile"
              >
                <User size={20} />
              </button>
              <button 
                onClick={() => router.push('/chat-history')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Chat History"
              >
                <History size={20} />
              </button>
              <button 
                onClick={() => router.push('/reports')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Reports"
              >
                <FileText size={20} />
              </button>
              <button 
                onClick={() => router.push('/api-keys')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="API Keys"
              >
                <Key size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#ffa600] hover:text-[#ffa600]"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-gray-600/40 text-white px-4 md:px-6 py-1.5 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-600/50 transition-all duration-300 hover:scale-105"
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