"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ReportSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkPaymentAndGenerateReport = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/auth');
        return;
      }

      try {
        const sessionId = searchParams?.get('session_id');
        const reportType = searchParams?.get('report_type');

        if (!sessionId || !reportType) {
          throw new Error('Missing required parameters');
        }

        // Get user ID from session
        const userId = session.user.id;

        // Wait for payment to be processed (retry up to 30 seconds)
        const startTime = Date.now();
        const maxWaitTime = 30000; // 30 seconds
        const retryInterval = 2000; // 2 seconds

        while (Date.now() - startTime < maxWaitTime) {
          const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .select('status')
            .eq('stripe_session_id', sessionId)
            .eq('user_id', userId)
            .single();

          if (paymentError) {
            console.error('Error checking payment status:', paymentError);
          } else if (payment?.status === 'succeeded') {
            // Payment confirmed, generate report
            const response = await fetch('/api/reports/generate', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                userId,
                userName: session.user.email?.split('@')[0] || 'user',
                sessionId,
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
            return;
          }

          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryInterval));
        }

        throw new Error('Payment processing is taking longer than expected. Please check your profile in a few minutes to access your report.');
      } catch (err) {
        console.error('Error generating report:', err);
        setError('Failed to generate report. Please contact support.');
        setLoading(false);
      }
    };

    checkPaymentAndGenerateReport();
  }, [searchParams]);

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
