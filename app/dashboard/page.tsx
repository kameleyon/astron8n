"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SessionProvider from "@/components/SessionProvider";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          router.push("/auth");
          return;
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error in dashboard:", err);
        router.push("/auth");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <SessionProvider requireAuth>
      <DashboardLayout>
        <div className="w-full">
          <ChatInterface />
        </div>
      </DashboardLayout>
    </SessionProvider>
  );
}
