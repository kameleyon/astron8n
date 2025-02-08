"use client";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the token and type from URL
        if (!searchParams) {
          setMessage("Invalid verification URL.");
          return;
        }

        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setMessage("Please check your email for the verification link.");
          return;
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });

        if (error) {
          throw error;
        }

        setMessage("Email verified successfully! You can now sign in.");
        // Wait a moment before redirecting
        setTimeout(() => {
          router.push('/auth?mode=login');
        }, 2000);

      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || "Failed to verify email");
        setMessage("");
      }
    };

    handleEmailVerification();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      {message && (
        <p className="text-gray-700 text-center max-w-md mb-6">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 text-center max-w-md mb-6">
          {error}
        </p>
      )}
      <button
        onClick={() => router.push("/auth?mode=login")}
        className="px-6 py-2 rounded-md bg-primary text-white hover:bg-opacity-90 transition"
      >
        Go to Login
      </button>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
          <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
          <p className="text-gray-700 text-center max-w-md mb-6">
            Loading verification...
          </p>
        </div>
      }
    >
      <VerifyPageInner />
    </Suspense>
  );
}
