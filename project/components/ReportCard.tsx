"use client";

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

interface ReportCardProps {
  report: Report;
  isActive: boolean;
}

export default function ReportCard({ report, isActive }: ReportCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ 
        scale: isActive ? 1 : 0.95, 
        opacity: isActive ? 1 : 0.5 
      }}
      transition={{ duration: 0.3 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{report.icon}</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
              <p className="text-2xl font-bold text-primary mt-1">
                ${report.price}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {report.description}
        </p>

        {/* Action Button */}
        <button className="w-full bg-primary text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors">
          <Sparkles className="w-5 h-5" />
          <span>Generate Report</span>
        </button>
      </div>
    </motion.div>
  );
}