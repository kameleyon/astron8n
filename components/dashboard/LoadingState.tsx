"use client";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
      <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white">
        Loading...
      </div>
    </div>
  );
}