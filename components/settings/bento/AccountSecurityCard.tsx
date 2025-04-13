"use client";

import { BentoGridItem } from "@/components/profile/bento/BentoGrid";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock } from "lucide-react";

interface AccountSecurityCardProps {
  isLoading: boolean;
}

export function AccountSecurityCard({ 
  isLoading 
}: AccountSecurityCardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'password' | 'email'>('password');
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      // First verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Then update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      toast({
        title: "Error",
        description: "Please enter a new email address",
        variant: "destructive",
      });
      return;
    }

    const currentEmail = (await supabase.auth.getUser()).data.user?.email;
    if (newEmail === currentEmail) {
      toast({
        title: "Error",
        description: "New email is the same as current email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: "Verification email sent to new address. Please check your inbox.",
      });
      // Clear form
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <BentoGridItem>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </BentoGridItem>
    );
  }

  return (
    <BentoGridItem
      title="Account Security"
      icon={<Shield className="h-5 w-5 text-primary" />}
    >
      <div className="mt-4">
        <div className="flex border-b mb-4">
          <button
            className={`pb-2 px-4 ${
              activeTab === 'password'
                ? 'border-b-2 border-secondary text-secondary font-medium'
                : 'text-gray'
            }`}
            onClick={() => setActiveTab('password')}
          >
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-1" />
              Password
            </div>
          </button>
          <button
            className={`pb-2 px-4 ${
              activeTab === 'email'
                ? 'border-b-2 border-secondary text-secondary font-medium'
                : 'text-gray'
            }`}
            onClick={() => setActiveTab('email')}
          >
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </div>
          </button>
        </div>

        {activeTab === 'password' ? (
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brown mb-1">
                Current Password
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown mb-1">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailChange} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brown mb-1">
                New Email Address
              </label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Update Email"}
            </button>
          </form>
        )}
      </div>
    </BentoGridItem>
  );
}
