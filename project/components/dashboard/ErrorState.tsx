"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-bold">Error</h2>
        </div>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => router.push("/auth")}
          className="w-full py-3 px-4 bg-primary text-white rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}