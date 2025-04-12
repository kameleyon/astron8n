"use client";

import { FileText, Download } from "lucide-react";
import { BentoGridItem } from "./BentoGrid";

interface Report {
  id: string;
  user_id: string;
  report_type: string;
  file_name: string;
  content: string;
  created_at: string;
}

interface ReportsCardProps {
  reports: Report[];
  onDownload: (fileName: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ReportsCard({
  reports,
  onDownload,
  currentPage,
  totalPages,
  onPageChange,
}: ReportsCardProps) {
  return (
    <BentoGridItem className="h-auto">
      {/* Header with gradient - matching profile card */}
      <div className="p-3 sm:p-4 border-b border-secondary/90 bg-gradient-to-r from-primary/80 to-secondary/80 backdrop-blur-md rounded-t-2xl flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-bold text-white">
          Reports
        </h2>
        
      </div>
      
      {/* Content with yellow background - matching profile card */}
      <div className="p-3 sm:p-4 max-h-full bg-accent/70 rounded-b-2xl">
        
        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={report.id} className="space-y-2">
                {/* Date */}
                <div className="text-gray-600 text-xs sm:text-sm">
                  {new Date(report.created_at).toLocaleDateString()} at{" "}
                  {new Date(report.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                
                {/* Report Type and Download Button */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-primary">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="font-medium text-sm sm:text-base">
                      {report.report_type === '30-day' ? '30 days Forecast' : report.report_type}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onDownload(report.file_name)}
                    className="text-primary hover:text-primary/80 flex items-center"
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                
                {/* Divider */}
                {index < reports.length - 1 && (
                  <div className="border-t border-gray-200 my-2"></div>
                )}
              </div>
            ))}
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="text-gray-500 disabled:opacity-50"
                >
                  ◀
                </button>
                
                <div className="h-1 bg-white/40 flex-grow mx-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  ></div>
                </div>
                
                <button
                  onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="text-gray-500 disabled:opacity-50"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm sm:text-base">No reports available yet.</p>
          </div>
        )}
      </div>
    </BentoGridItem>
  );
}
