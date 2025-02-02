"use client";

import { Suspense, useState } from "react";
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
      <div className="min-h-screen flex flex-col relative">
        <Suspense fallback={<LoadingState />}>
          <Header onAuth={handleAuth} />
        </Suspense>
        
        <div className="bg-gradient-to-r from-secondary to-accent flex-grow relative">
          <div className="absolute inset-0 dot-pattern"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              <Suspense fallback={<LoadingState />}>
                <Hero onAuth={handleAuth} />
              </Suspense>
              <div className="flex items-center justify-center mt-8 md:mt-16 mb-20 md:mb-0">
                <Suspense fallback={<LoadingState />}>
                  <ChatInterfaceindex />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        <Footer />

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode={authMode}
        />
      </div>
    </SessionProvider>
  );
}
