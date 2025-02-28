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
    icon: <FileText className="h-6 w-6" />,
    available: true
  },
  {
    id: 'Birth-Chart-Analysis',
    title: 'Birth Chart Analysis',
    description: 'Unlock the secrets of your cosmic blueprint with our comprehensive Birth Chart Analysis. This in-depth report examines your unique astrological makeup at the moment of your birth, revealing your core personality traits, inherent talents, life challenges, and destined path. We analyze the positions of all planets, houses, and aspects to provide profound insights into your life purpose, relationships, career inclinations, and personal growth opportunities. Perfect for those seeking deep self-understanding and guidance for life\'s major decisions.',
    price: 29.99,
    icon: <FileText className="h-6 w-6" />,
    available: false
  },
  {
    id: 'relationship',
    title: 'Relationship Compatibility Report',
    description: 'Discover the true potential of your relationships with our detailed Compatibility Analysis. This report goes beyond surface-level matching to examine the deep astrological synergy between two individuals. We analyze the interaction between both birth charts to reveal areas of harmony, growth opportunities, potential challenges, and karmic connections. Understand communication patterns, emotional bonds, shared values, and long-term compatibility. Essential for couples, business partners, or anyone seeking to improve significant relationships in their life.',
    price: 24.99,
    icon: <FileText className="h-6 w-6" />,
    available: false
  },
  {
    id: 'career',
    title: 'The Career that fits you best',
    description: 'Find your true professional calling with our Career Path Analysis. This comprehensive report examines your birth chart\'s career indicators to reveal your natural talents, ideal work environment, leadership style, and potential paths to success. We analyze your 10th house of career, 2nd house of income, and key planetary aspects to identify periods of professional growth and opportunity. Includes insights about work relationships, money management patterns, and timing for career moves. Perfect for career changes, business decisions, or long-term professional planning.',
    price: 19.99,
    icon: <FileText className="h-6 w-6" />,
    available: false
  },
  {
    id: 'Partnership',
    title: 'Who is my soulmate',
    description: 'Uncover the qualities of your ideal life partner with our Soulmate Connection Report. This unique analysis examines your birth chart\'s relationship indicators to reveal the characteristics of your most compatible partner. We analyze your 7th house of partnerships, Venus and Mars positions, and significant aspects to describe your ideal match\'s personality, values, and life approach. Learn about timing for meaningful connections, relationship patterns to embrace or avoid, and how to recognize your true soulmate when they appear in your life.',
    price: 14.99,
    icon: <FileText className="h-6 w-6" />,
    available: false
  },
  {
    id: 'health',
    title: 'Health & Well-Being Report',
    description: 'Transform your approach to health with our Wellness Alignment Report. This holistic analysis examines your birth chart\'s health and vitality indicators to create a personalized wellness strategy. We analyze your 1st house of physical body, 6th house of health routines, and key planetary aspects to understand your energy patterns, stress responses, and natural healing abilities. Receive insights about diet preferences, exercise recommendations, stress management techniques, and optimal rest cycles. Includes timing for health initiatives and preventive measures. Essential for anyone seeking to enhance their physical and emotional well-being through cosmic wisdom.',
    price: 14.99,
    icon: <FileText className="h-6 w-6" />,
    available: false
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
  available: boolean;
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
    //'30-days': 'price_1QsxLAGTXKQOsgznyJHgk0W9', //test
    '30-days': 'price_1QtJfsGTXKQOsgzngGNk8ibg',
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

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
        setError('Please log in to generate a report.');
        return;
      }

      const response = await fetch('/api/reports/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          reportId: report.id,
          priceId: PRICE_IDS[report.id]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
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
          onClick={report.available ? handleGenerateReport : undefined}
          disabled={loading || !report.available}
          className={`w-full mt-4 py-2 md:py-3 px-3 md:px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
            report.available
              ? `bg-primary text-white hover:scale-105 transform ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : report.available ? (
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <FileText className="w-4 h-4 md:w-5 md:h-5 opacity-50" />
          )}
          <span className="text-sm md:text-base">
            {loading ? 'Processing...' : report.available ? 'Generate Report' : 'Coming Soon'}
          </span>
        </button>
      </div>
    </div>
  );
}
