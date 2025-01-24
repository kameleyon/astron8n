"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SessionProvider from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

const reports = [
  {
    id: 'life-path',
    title: 'Life Path & Personality Report',
    description: 'A detailed analysis of your unique life path, strengths, and challenges based on your date of birth.',
    price: 19.99,
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'annual-forecast',
    title: 'Annual Forecast Report',
    description: 'A comprehensive report outlining major opportunities and challenges for the upcoming year, broken down by month.',
    price: 29.99,
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'relationship',
    title: 'Relationship Compatibility Report',
    description: 'A personalized report comparing two individuals to assess compatibility and potential dynamics.',
    price: 24.99,
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'career',
    title: 'Career & Finance Insight Report',
    description: 'Tailored career and financial advice, including the best periods for growth, new opportunities, and financial stability.',
    price: 19.99,
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'decision',
    title: 'Decision-Making Window Report',
    description: 'Identifies the most favorable periods for important decisions.',
    price: 14.99,
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'health',
    title: 'Health & Well-Being Report',
    description: 'Provides personalized insights into your energy patterns, stress points, and suggestions for maintaining well-being.',
    price: 14.99,
    icon: <FileText className="h-6 w-6" />
  }
];

export default function ReportsPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setDirection(1);
        setActiveIndex((current) => (current + 1) % reports.length);
      }, 5000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setActiveIndex((current) => (current + 1) % reports.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setActiveIndex((current) => (current - 1 + reports.length) % reports.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        
        <Header onAuth={() => {}} />
        
        <main className="flex-grow relative z-10 py-8">
          <div className="w-full max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Reports Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-4 mb-6">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-white" />
                  </button>
                  <h1 className="text-2xl font-bold text-white">
                    Available Reports
                  </h1>
                </div>

                <div className="relative h-[500px] overflow-hidden bg-white/5 rounded-3xl px-16">
                  {/* Navigation Controls - Always visible */}
                  <div className="absolute inset-y-0 left-4 flex items-center z-20">
                    <button
                      onClick={handlePrev}
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="absolute inset-y-0 right-4 flex items-center z-20">
                    <button
                      onClick={handleNext}
                      className="p-2 rounded-full bg-primary text-white hover:bg-primary/80 transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Slides */}
                  <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                      key={activeIndex}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="absolute inset-0 px-4"
                      onMouseEnter={() => setIsAutoPlaying(false)}
                      onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                      <ReportCard 
                        report={reports[activeIndex]}
                        isActive={true}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {reports.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > activeIndex ? 1 : -1);
                        setActiveIndex(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex 
                          ? 'bg-white scale-110 w-4' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to report ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Downloaded Reports Section */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 h-min mb-8 md:mb-0">
                <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Downloaded Reports
                </h2>
                
                <div className="space-y-4">
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No reports downloaded yet</p>
                    <p className="text-xs text-gray-400">Purchase a report to see it here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SessionProvider>
  );
}

interface Report {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: JSX.Element;
}

interface ReportCardProps {
  report: Report;
  isActive: boolean;
}

function ReportCard({ report, isActive }: ReportCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden h-full">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            {report.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{report.title}</h3>
            <p className="text-xl font-bold text-primary mt-1">
              ${report.price}
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6">
          {report.description}
        </p>

        <button className="w-full bg-primary text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors text-sm">
          <FileText className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>
    </div>
  );
}