"use client";

import BirthChartForm from "@/components/BirthChartForm";

export default function BirthChartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
      <div className="absolute inset-0 dot-pattern"></div>
      <BirthChartForm />
    </div>
  );
}