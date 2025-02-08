"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
      {/* Dot Pattern Overlay */}
      <div className="absolute inset-0 dot-pattern"></div>
      
      <Header onAuth={() => {}} />
      
      <main className="flex-grow relative z-10 py-12">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-left mb-4 pl-8">
              Hello there, 
            </h1>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}