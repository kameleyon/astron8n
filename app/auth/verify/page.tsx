"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  useEffect(() => {
    // Immediately sign the user out to end their session
    supabase.auth.signOut().then(() => {
      // Optionally navigate to a message or standard page
      // after sign-out; for example, we can remain here or display a message
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p className="text-gray-700 text-center max-w-md mb-6">
        We have ended your current session to allow you to verify your email address.
        Once your email is verified, please sign in again to continue.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 rounded-md bg-primary text-white hover:bg-opacity-90 transition"
      >
        Return Home
      </button>
    </div>
  );
}
