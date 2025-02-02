"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Lock, FileText } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
      <div className="absolute inset-0 dot-pattern"></div>
      
      <Header onAuth={() => {}} />
      
      <main className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* About Section */}
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h1 className="text-3xl font-bold text-primary mb-6">About AstroGenie</h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              AstroGenie is your personal AI-powered astrological companion, combining ancient wisdom with cutting-edge technology. Our platform provides detailed birth chart analysis, personalized readings, and ongoing astrological guidance to help you navigate life's journey with greater awareness and understanding.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Trusted Platform</h3>
                <p className="text-gray-600 text-sm">
                  Built with security and privacy at its core, ensuring your personal data is always protected.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Privacy First</h3>
                <p className="text-gray-600 text-sm">
                  Your data is encrypted and never shared with third parties.
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Detailed Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive astrological insights powered by AI.
                </p>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-6">Terms of Service</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h3>
              <p>By accessing and using AstroGenie, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">2. Use License</h3>
              <p>Permission is granted to temporarily access AstroGenie for personal, non-commercial use only.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">3. Disclaimer</h3>
              <p>The information provided by AstroGenie is for entertainment and personal growth purposes only. We do not guarantee the accuracy of astrological interpretations.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">4. Limitations</h3>
              <p>You may not use AstroGenie for any illegal purpose or in any way that could damage, disable, or impair the service.</p>
            </div>
          </section>

          {/* Privacy Policy */}
          <section className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-primary mb-6">Privacy Policy</h2>
            <div className="prose prose-sm max-w-none text-gray-600">
              <h3 className="text-lg font-semibold text-gray-900">Data Collection</h3>
              <p>We collect only the information necessary to provide you with accurate astrological readings, including birth date, time, and location.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Data Usage</h3>
              <p>Your personal information is used solely for generating astrological readings and improving our services. We never share your data with third parties.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Data Security</h3>
              <p>We employ industry-standard security measures to protect your personal information from unauthorized access or disclosure.</p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6">Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal information at any time through your account settings.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}