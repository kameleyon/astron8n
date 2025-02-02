"use client";

import { useState, useEffect } from "react";
import { Shield, X, Mail, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import AcknowledgmentModal from "./AcknowledgmentModal";
import BirthChartModal from "./BirthChartModal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(defaultMode === 'login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [showBirthChart, setShowBirthChart] = useState(false);

  useEffect(() => {
    setIsLogin(defaultMode === 'login');
    setError("");
    setShowVerificationMessage(false);
  }, [defaultMode]);

  useEffect(() => {
    if (!isOpen) {
      setError("");
      setEmail("");
      setPassword("");
      setShowVerificationMessage(false);
      setShowAcknowledgment(false);
      setShowBirthChart(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShowVerificationMessage(false);

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          if (signInError.message.toLowerCase().includes('email not confirmed')) {
            const { error: resendError } = await supabase.auth.resend({
              type: 'signup',
              email,
            });
            
            if (resendError) throw resendError;
            setShowVerificationMessage(true);
          } else {
            throw signInError;
          }
          return;
        }

        if (data.user) {
          // Check if user has a profile
          const { data: profiles } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id);

          if (!profiles || profiles.length === 0) {
            setShowAcknowledgment(true);
          } else {
            router.push("/dashboard");
            onClose();
          }
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify`,
          },
        });

        if (signUpError) throw signUpError;
        setShowVerificationMessage(true);
      }
    } catch (err: any) {
      const message = err.message.toLowerCase();
      if (message.includes('invalid login credentials')) {
        setError("Invalid email or password. Please try again.");
      } else if (message.includes('password')) {
        setError("Password must be at least 12 characters long and include uppercase, lowercase, number, and special character.");
      } else if (message.includes('email')) {
        setError("Please enter a valid email address.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgmentAccept = () => {
    setShowAcknowledgment(false);
    setShowBirthChart(true);
  };

  const handleBirthChartSubmit = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          full_name: data.name,
          birth_date: data.birthDate,
          birth_time: data.birthTime,
          birth_location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          has_unknown_birth_time: data.hasUnknownBirthTime,
          has_accepted_terms: true
        });

      if (error) throw error;
      
      router.push("/dashboard");
      onClose();
    } catch (err) {
      console.error('Error saving birth chart data:', err);
      setError("Failed to save birth chart data. Please try again.");
    }
  };

  if (showBirthChart) {
    return (
      <BirthChartModal
        isOpen={true}
        onClose={onClose}
        onSubmit={handleBirthChartSubmit}
      />
    );
  }

  if (showAcknowledgment) {
    return (
      <AcknowledgmentModal
        isOpen={true}
        onClose={onClose}
        onAccept={handleAcknowledgmentAccept}
      />
    );
  }

  if (showVerificationMessage) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600">
              We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Next steps:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-2">
                <li>Check your email inbox</li>
                <li>Click the verification link</li>
                <li>Return here to sign in</li>
              </ol>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg text-sm text-amber-800">
              <p className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>If you don't see the email, please check your spam folder.</span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={() => setShowVerificationMessage(false)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              Back to {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Your Account"}
          </h2>
          <p className="text-sm text-gray-600">
            {isLogin ? "Sign in to continue your journey" : "Join us for personalized astrological insights"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Enter your password"
            />
            {!isLogin && (
              <div className="mt-2 text-xs text-gray-600">
                <p>Password requirements:</p>
                <ul className="list-disc pl-5">
                  <li>Minimum 12 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-primary hover:text-opacity-80 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
