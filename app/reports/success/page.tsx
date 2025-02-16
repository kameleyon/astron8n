"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ReportSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateReport = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      try {
        const reportType = searchParams?.get('report_type') || '30-days';
        const userId = session.user.id;

        // Generate report
        const response = await fetch('/api/reports/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            userId,
            userName: session.user.email?.split('@')[0] || 'user',
            reportType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate report');
        }

        const data = await response.json();

        // Download the PDF
        const pdfBytes = atob(data.pdfBytes);
        const pdfBlob = new Blob([new Uint8Array(pdfBytes.split('').map(char => char.charCodeAt(0)))], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        setLoading(false);
      } catch (err) {
        console.error('Error generating report:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate report. Please contact support.');
        setLoading(false);
      }
    };

    generateReport();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Report</h1>
              <p className="text-gray-600">Please wait while we prepare your personalized report...</p>
            </>
          ) : error ? (
            <>
              <div className="text-red-500 mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
              <p className="text-gray-600">{error}</p>
            </>
          ) : (
            <>
              <div className="text-primary mb-4">
                <FileText className="h-12 w-12 mx-auto" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Generated!</h1>
              <p className="text-gray-600">Your report has been generated and downloaded. You can also find it in your profile under the Reports section.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-secondary to-accent p-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Please wait while we prepare your report status...</p>
          </div>
        </div>
      </div>
    }>
      <ReportSuccessContent />
    </Suspense>
  );
}
