"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ChatHistoryLayoutProps {
  children: React.ReactNode;
}

export default function ChatHistoryLayout({ children }: ChatHistoryLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern"></div>
      
      <Header onAuth={() => {}} />
      
      <main className="flex-grow relative z-10 py-8 flex justify-center">
        <div className="w-full max-w-5xl px-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}