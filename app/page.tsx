"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ChatInterfaceindex from "@/components/ChatInterfaceindex";
import AuthModal from "@/components/AuthModal";
import SessionProvider from "@/components/SessionProvider";
import LoadingState from "@/components/dashboard/LoadingState";

export default function Home() {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure smooth animations
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAuth = (mode: 'login' | 'signup') => {
    if (mode === 'login') {
      router.push('/features');
      return;
    }
    setAuthMode('signup');
    setShowAuthModal(true);
  };
  
  return (
    <SessionProvider>
      <div className={`min-h-screen flex flex-col relative transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <Suspense fallback={<LoadingState />}>
          <Header onAuth={handleAuth} />
        </Suspense>
        
        <main
          className="flex-grow relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #ef8535 0%, #ffcb65 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 dot-pattern" style={{ opacity: 0.15 }}></div>
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent"></div>
          
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-float-delayed"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <Suspense fallback={<LoadingState />}>
                <Hero onAuth={handleAuth} />
              </Suspense>
              <div className="flex items-center justify-center mt-4 md:mt-8 mb-20 md:mb-0">
                <Suspense fallback={<LoadingState />}>
                  <ChatInterfaceindex />
                </Suspense>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          
          @keyframes float-delayed {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(20px) scale(1.05); }
          }
          
          .animate-float {
            animation: float 15s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 18s ease-in-out infinite;
          }
        `}</style>
      </div>
    </SessionProvider>
  );
}
