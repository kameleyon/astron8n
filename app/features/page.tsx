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
                  description: "Get detailed insights into your natal chart with AI-powered interpretations",
                  features: [
                    "Interactive birth chart wheel",
                    "Detailed planetary positions",
                    "House system interpretations",
                    "Dynamic aspect analysis",
                    "Pattern detection",
                    "Special features identification"
                  ]
                },
                {
                  icon: MessageSquare,
                  title: "AI Chat Assistant",
                  description: "Chat with our AI to get personalized astrological guidance anytime",
                  features: [
                    "Natural language understanding",
                    "Context-aware responses",
                    "Birth chart integration",
                    "Multi-model AI system",
                    "Chat history tracking",
                    "Real-time transit integration"
                  ]
                },
                {
                  icon: FileText,
                  title: "Custom Reports",
                  description: "Generate in-depth reports for specific life areas or time periods",
                  features: [
                    "30-day personalized forecasts",
                    "Transit analysis",
                    "Aspect interpretations",
                    "PDF generation",
                    "Secure storage",
                    "Report history"
                  ]
                },
                {
                  icon: Sparkles,
                  title: "Transit Predictions",
                  description: "Understand how current planetary positions affect your chart",
                  features: [
                    "Real-time planetary tracking",
                    "Aspect calculations",
                    "House position monitoring",
                    "Retrograde periods",
                    "Eclipse predictions",
                    "Daily transit updates"
                  ]
                },
                {
                  icon: Star,
                  title: "Compatibility Analysis",
                  description: "Compare charts and understand relationship dynamics",
                  features: [
                    "Synastry analysis",
                    "Composite chart creation",
                    "Relationship patterns",
                    "Compatibility scores",
                    "Aspect interpretations",
                    "Dynamic compatibility updates"
                  ]
                },
                {
                  icon: CreditCard,
                  title: "Flexible Credits",
                  description: "Use credits for readings, reports, and extended chat sessions",
                  features: [
                    "Multiple token packages",
                    "Real-time balance tracking",
                    "Usage monitoring",
                    "Transaction history",
                    "Credit alerts",
                    "Activity logs"
                  ]
                }
              ].map((feature, index) => (
              <Card key={index} className="p-6 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
                <div className="flex justify-between items-start mb-2">
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

                
              </Card>

              {/* Token Packages */}
              <div className="space-y-4">
                {[
                  {
                    title: "Basic Package",
                    price: "$2.99",
                    tokens: "5,000",
                    description: "Perfect for casual users"
                  },
                  {
                    title: "Pro Package",
                    price: "$3.99",
                    tokens: "9,000",
                    description: "Best value for regular users",
                    popular: true
                  },
                  {
                    title: "Premium Package",
                    price: "$5.99",
                    tokens: "17,000",
                    description: "Ideal for power users"
                  }
                ].map((pkg, index) => (
                  <Card key={index} className={`p-6 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 ${pkg.popular ? 'border-2 border-primary relative' : ''}`}>
                    {pkg.popular && (
                      <div className="absolute -top-3 right-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-primary">{pkg.title}</h3>
                        <p className="text-gray-600">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{pkg.price}</div>
                        <div className="text-sm text-gray-600">{pkg.tokens} tokens</div>
                      </div>
                    </div>
                   
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
