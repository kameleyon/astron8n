"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, Zap, Globe, ChevronLeft } from "lucide-react";
import LegalAccordion from "@/components/LegalAccordion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
      <div className="absolute inset-0 dot-pattern"></div>
      
      <Header onAuth={() => {}} />
      
      <main className="relative z-10 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-white hover:text-primary/80 transition-colors mb-8 group"
          >
            <ChevronLeft className="w-5 h-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          
          <div className="space-y-16">
          {/* About Section */}
          <section className="bg-white/70 border border-white shadow-md shadow-black/40 backdrop-blur-sm rounded-3xl p-6 ">
            <h1 className="text-3xl font-bold text-primary mb-6">About AstroGenie</h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              AstroGenie is a proud women-owned venture revolutionizing the world of astrology through cutting-edge AI technology. Our mission is to make accurate astrological insights accessible to everyone, combining ancient wisdom with modern innovation to deliver precise predictions and personalized guidance at unprecedented speed. As pioneers in AI-powered astrology, we're committed to breaking down barriers and making professional-grade astrological insights available to historically underserved communities, with a special focus on supporting and empowering Black-owned businesses and women entrepreneurs.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Inclusive Platform</h3>
                <p className="text-gray-600 text-sm">
                  Built with diversity and inclusion at its core, ensuring accurate predictions for all communities.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                <p className="text-gray-600 text-sm">
                  Lightning-fast calculations and instant insights powered by advanced AI technology.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Cultural Wisdom</h3>
                <p className="text-gray-600 text-sm">
                  Culturally-informed guidance combining multiple astrological traditions.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Sections */}
          <LegalAccordion title="Terms of Service">
            <div className="space-y-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">Effective Date: August 25, 2024</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">1. Introduction</h3>
                <p className="mt-2">
                  Welcome to AstroGenie, an AI-powered personalized astrology companion designed to provide you with astrological insights, predictions, and tools tailored to your unique birth chart. By accessing or using the AstroGenie app, website, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use our Service.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">2. Definitions</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Service: Refers to the AstroGenie app, website, and any associated products, features, content, and applications.</li>
                  <li>User: Any individual who uses the Service.</li>
                  <li>Content: Includes all information, text, images, data, audio, video, and other materials available through the Service.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">3. Service Description</h3>
                <p className="mt-2">
                  AstroGenie leverages Swiss Ephemeris calculations and AstroAPI Token, recognized for delivering high-standard and accurate astrological information. Our Services include:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Birth Chart and Personal Insights: Detailed analysis, personality summaries, and life aspect insights</li>
                  <li>Predictive Features: Daily, weekly, and monthly predictions with important dates</li>
                  <li>Relationship Compatibility: Analysis, synastry charts, and forecasting</li>
                  <li>AI-Powered Guidance: Personalized insights and predictions</li>
                  <li>Custom Features: Avatar-driven narratives and preference-based customization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">4. Subscription Plans</h3>
                <p className="mt-2">We offer various subscription options:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Basic (Free): Limited daily predictions and features</li>
                  <li>Premium (Monthly/Yearly): Full access to all features and predictions</li>
                  <li>Add-On Features: Specialized tools available for additional purchase</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">5. Intellectual Property</h3>
                <p className="mt-2">
                  All content, including predictions, interpretations, and features, is protected by copyright and other intellectual property laws. Users are granted a limited license for personal use only.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">6. Disclaimer and Liability</h3>
                <p className="mt-2">
                  While we use industry-standard tools like Swiss Ephemeris and AstroAPI, predictions are interpretive by nature. The Service is provided "as is" without warranties. AstroGenie is not liable for decisions made based on our predictions.
                </p>
              </div>
            </div>
          </LegalAccordion>

          <LegalAccordion title="Privacy Policy">
            <div className="space-y-6">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-4">Effective Date: August 25, 2024</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">1. Data Collection and Usage</h3>
                <p className="mt-2">We collect and process:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Personal Information: Birth details, location, preferences</li>
                  <li>Account Data: Email, profile information</li>
                  <li>Usage Information: App interaction, features used</li>
                  <li>Technical Data: Device info, IP address</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">2. Data Processing and Security</h3>
                <p className="mt-2">
                  We utilize Swiss Ephemeris and AstroAPI Token for calculations, ensuring accurate astrological data. Your information is:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Encrypted during transmission and storage</li>
                  <li>Processed securely for predictions</li>
                  <li>Protected by industry-standard measures</li>
                  <li>Regularly audited for security compliance</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">3. Data Sharing and Third Parties</h3>
                <p className="mt-2">We share data only with:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Essential service providers (payment processors, cloud services)</li>
                  <li>Analytics partners (anonymized data only)</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">4. Your Privacy Rights</h3>
                <p className="mt-2">You have the right to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-2">
                  <li>Access your personal data</li>
                  <li>Request data correction or deletion</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Export your data</li>
                  <li>File a complaint with supervisory authorities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">5. Data Retention</h3>
                <p className="mt-2">
                  We retain your data for as long as necessary to provide our services or as required by law. You can request deletion of your account and associated data at any time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">6. Children's Privacy</h3>
                <p className="mt-2">
                  Our services are not intended for users under 18 years of age. We do not knowingly collect data from children.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900">7. Contact Us</h3>
                <p className="mt-2">
                  For privacy inquiries or to exercise your rights, contact our Data Protection Officer at privacy@astrogenie.ai
                </p>
              </div>
            </div>
          </LegalAccordion>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
