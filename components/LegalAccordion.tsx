"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const LegalAccordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-white/80 border border-white shadow-md shadow-black/40 backdrop-blur-sm rounded-3xl p-2  overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left"
      >
        <h2 className="text-2xl font-bold text-primary">{title}</h2>
        <ChevronDown
          className={`w-6 h-6 text-primary transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-8 pb-8">
          <div className="prose prose-sm max-w-none text-gray-800 max-h-[400px] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalAccordion;
