"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SessionProvider from '@/components/SessionProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { createCheckoutSession } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

const reports = [
  {
    id: '30-days',
    title: 'Next 30-Days Focus & Action Plan Report',
    description: 'The 30-Day Focus & Action Plan is a personalized roadmap designed to help you navigate key areas of life—career, relationships, finances, personal growth, and well-being—over the next month. Using insights from astrology, I Ching, human design, numerology, life path, and cardology, this report provides a clear and actionable guide tailored to your unique energy. You\'ll receive key transits, focused action steps, power dates, and strategic insights to align with opportunities and overcome challenges. Whether you\'re seeking clarity, transformation, or success, this report equips you with the tools to make the most of the next 30 days.',
    price: 14.99,
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
      }, 8000);
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
      x: direction > 0 ? 200 : -200,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      position: "absolute" as const
    })
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent overflow-hidden">
        <div className="absolute inset-0 dot-pattern"></div>
        
        <Header onAuth={() => {}} />
        
        <main className="flex-grow relative z-10 py-2 md:py-8 px-2 md:px-4 mt-14 md:mt-20">
        <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-left mb-8 pl-24">
            Available Reports
            </h1>
            
            {/* Carousel Container with Navigation */}
            <div className="relative flex items-center justify-center gap-1 md:gap-2 w-full max-w-5xl ">
              {/* Left Navigation */}
              <button
                onClick={handlePrev}
                className="flex-none p-1.5 md:p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-110 z-20"
                aria-label="Previous report"
              >
                <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
              </button>

              {/* Slides Container */}
              <div className="relative w-full max-w-5xl h-[500px] md:h-[400px] overflow-hidden">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 150, damping: 30 },
                      opacity: { duration: 0.5 }
                    }}
                    className="absolute inset-0 px-1 md:px-0"
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

              {/* Right Navigation */}
              <button
                onClick={handleNext}
                className="flex-none p-1.5 md:p-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300 hover:scale-110 z-20"
                aria-label="Next report"
              >
                <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
              </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center w-full max-w-5xl  gap-1 md:gap-2 mt-3 md:mt-6">
              {reports.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1);
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-1 md:w-2 h-1 md:h-2 rounded-full transition-all duration-500 ${
                    index === activeIndex 
                      ? 'bg-white scale-150 w-2 md:w-4' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to report ${index + 1}`}
                />
              ))}
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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map report IDs to Stripe price IDs
  const PRICE_IDS: { [key: string]: string } = {
    '30-days': 'price_1QsxLAGTXKQOsgznyJHgk0W9',
    'annual-forecast': 'price_1QsxLBGTXKQOsgznKpL8j4Xt',
    'relationship': 'price_1QsxLCGTXKQOsgznM9qR5kWn',
    'career': 'price_1QsxLDGTXKQOsgznPwX2mJYt',
    'decision': 'price_1QsxLEGTXKQOsgznRtK9nMZt',
    'health': 'price_1QsxLFGTXKQOsgznTvN4pQZt'
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current session with retry
      let session;
      for (let i = 0; i < 3; i++) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          continue;
        }

        if (sessionData.session) {
          session = sessionData.session;
          break;
        }

        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!session) {
        router.push('/auth');
        setError('Please log in to generate a report.');
        return;
      }

      const priceId = PRICE_IDS[report.id];
      if (!priceId) {
        throw new Error('Invalid report type');
      }

      await createCheckoutSession(priceId, report.id, session.access_token);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl h-full p-8 md:py-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-2 md:gap-4 mb-2 md:mb-4">
            <div className="bg-primary/10 p-1.5 md:p-3 rounded-lg">
              {report.icon}
            </div>
            <div>
              <h3 className="text-base md:text-xl font-bold text-gray-900 line-clamp-2">{report.title}</h3>
              <p className="text-lg md:text-2xl font-bold text-primary mt-0.5 md:mt-2">
                ${report.price}
              </p>
            </div>
          </div>

          <div className="h-[280px] md:h-[200px] overflow-y-auto pr-2 scrollbar-thin">
            <p className="text-gray-600 text-sm md:text-base">
              {report.description}
            </p>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className={`w-full mt-4 bg-primary text-white py-2 md:py-3 px-3 md:px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 transform ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
          )}
          <span className="text-sm md:text-base">
            {loading ? 'Processing...' : 'Generate Report'}
          </span>
        </button>
      </div>
    </div>
  );
}
