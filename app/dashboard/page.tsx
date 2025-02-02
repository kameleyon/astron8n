"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import ChatInterface from "@/components/ChatInterface";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionProvider from "@/components/SessionProvider";
import AcknowledgmentModal from "@/components/AcknowledgmentModal";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAckModal, setShowAckModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        // If not logged in, redirect to /auth
        if (authError || !user) {
          router.push("/auth");
          return;
        }

        // Check user metadata to see if they've acknowledged
        // You can also store 'hasAck' or similar inside user_metadata
        // Here we assume 'acceptedAck' is the metadata key
        const hasAccepted = (user.user_metadata as any)?.acceptedAck;

        // If user hasn't acknowledged, show the modal
        if (!hasAccepted) {
          setShowAckModal(true);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error in dashboard:", err);
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  async function handleAccept() {
    // Mark user as having acknowledged in user_metadata
    const { data, error: updateError } = await supabase.auth.updateUser({
      data: {
        acceptedAck: true,
      },
    });
    if (updateError) {
      console.error(updateError);
      setError(updateError.message);
      return;
    }
    setShowAckModal(false);
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <SessionProvider requireAuth>
      <DashboardLayout>
        <div className="w-full">
          {/* Show AcknowledgmentModal if user hasn't accepted */}
          <AcknowledgmentModal
            isOpen={showAckModal}
            onClose={() => setShowAckModal(false)}
            onAccept={handleAccept}
          />
          {/* Main Dashboard Content */}
          <ChatInterface />
        </div>
      </DashboardLayout>
    </SessionProvider>
  );
}
