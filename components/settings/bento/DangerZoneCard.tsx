"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface DangerZoneCardProps {
  isLoading: boolean;
}

export function DangerZoneCard({ 
  isLoading 
}: DangerZoneCardProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteAccount = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setLoading(true);
    try {
      // First delete user data from the database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error: dbError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);
      
      if (dbError) throw dbError;

      // Then delete the auth user
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;
      
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });
      
      // Sign out and redirect to home
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to cancel subscription');
      }

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription has been cancelled. You will still have access until the end of your billing period.",
      });
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to cancel subscription',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <BentoGridItem>
        <div className="flex items-center justify-center h-64 text-white/90">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary text-white/90"></div>
        </div>
      </BentoGridItem>
    );
  }

  return (
    <BentoGridItem
      header={
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-white/90 mr-2" />
          <h3 className="font-semibold text-white tracking-tight">Danger Zone</h3>
        </div>
      }
      className="bg-primary border-white text-white/90"
    >
      <div className="mt-4 space-y-4 ">
        <div>
          <h3 className="text-base font-medium text-white mb-1">Cancel Subscription</h3>
          <p className="text-sm text-white/70 mb-3">
            You will lose access to premium features at the end of your billing period.
          </p>
          <button 
            onClick={handleCancelSubscription}
            disabled={loading}
            className="w-full py-2 px-4 bg-white/80 border border-white/30 text-primary rounded-lg hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : "Cancel Subscription"}
          </button>
        </div>
        
        <div className="pt-4 border-t border-white/20">
          <h3 className="text-base font-medium text-white mb-1">Delete Account</h3>
          <p className="text-sm text-white/80 mb-3">
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={loading}
            className={`w-full py-2 px-4 ${
              confirmDelete 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-white/80 border border-primary/30 text-primary hover:bg-white'
            } rounded-lg transition-colors disabled:opacity-50`}
          >
            {loading 
              ? "Processing..." 
              : confirmDelete 
                ? "Confirm Delete Account" 
                : "Delete Account"
            }
          </button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="w-full mt-2 py-2 px-4 bg-white/80 text-gray rounded-lg hover:bg-gray/10 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </BentoGridItem>
  );
}
