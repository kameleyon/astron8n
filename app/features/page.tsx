"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Star, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  ChevronRight,
  Check,
  CreditCard
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
      <div className="absolute inset-0 dot-pattern"></div>
      
      <Header onAuth={() => {}} />
      
      <main className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Features Section */}
          <section className="mb-20">
            <h1 className="text-4xl font-bold text-white text-center mb-4">
              Features
            </h1>
            <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto">
              Discover the power of AI-driven astrological insights with our comprehensive feature set
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Star,
                  title: "Birth Chart Analysis",
                  description: "Get detailed insights into your natal chart with AI-powered interpretations"
                },
                {
                  icon: MessageSquare,
                  title: "AI Chat Assistant",
                  description: "Chat with our AI to get personalized astrological guidance anytime"
                },
                {
                  icon: FileText,
                  title: "Custom Reports",
                  description: "Generate in-depth reports for specific life areas or time periods"
                },
                {
                  icon: Sparkles,
                  title: "Transit Predictions",
                  description: "Understand how current planetary positions affect your chart"
                },
                {
                  icon: CreditCard,
                  title: "Flexible Credits",
                  description: "Use credits for readings, reports, and extended chat sessions"
                },
                {
                  icon: Star,
                  title: "Compatibility Analysis",
                  description: "Compare charts and understand relationship dynamics"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section>
            <h2 className="text-4xl font-bold text-white text-center mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-white/80 text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Monthly Subscription */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 border-primary">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Monthly Plan</h3>
                    <p className="text-gray-600">Perfect for regular insights</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">$7.99</div>
                    <div className="text-sm text-gray-600">per month</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "2,500 credits monthly",
                    "Full birth chart analysis",
                    "Unlimited chat sessions",
                    "Custom reports",
                    "API access",
                    "Priority support"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>

              {/* Credit Top-up */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-primary">Credit Top-up</h3>
                    <p className="text-gray-600">Need extra credits?</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">$4.99</div>
                    <div className="text-sm text-gray-600">per 1,000 credits</div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "1,000 additional credits",
                    "Never expires",
                    "Use anytime",
                    "Combine with monthly plan",
                    "Same features access",
                    "Flexible usage"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full">
                  Top Up Credits
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}