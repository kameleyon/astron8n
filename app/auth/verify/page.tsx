"use client";

import VerificationCard from "@/components/VerificationCard";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
      <div className="absolute inset-0 dot-pattern"></div>
      <VerificationCard />
    </div>
  );
}