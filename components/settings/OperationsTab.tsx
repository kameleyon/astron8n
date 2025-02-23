"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
export function OperationsTab() {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  
  // Form states
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
  return (
    <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">
          Settings
        </h2>
        <div className="space-y-6">
          {/* Account Security */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
            
            {/* Password Change Form */}
            <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[#0d0630] text-white rounded-lg hover:bg-[#0d0630]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
            
            {/* Email Change Form */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4">Change Email</h4>
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Email Address
                  </label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-[#0d0630] text-white rounded-lg hover:bg-[#0d0630]/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Update Email"}
                </button>
              </form>
          </div>

          {/* Danger Zone */}
          <div className="mt-12">
            <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
              <h3 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h3>
              <div>
                <p className="font-medium text-red-900 mb-2">Delete Account</p>
                <p className="text-sm text-red-700 mb-4">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</p>
                <button 
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      try {
                        setLoading(true);
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
                      } finally {
                        setLoading(false);
                      }
                    }
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </CardContent>
    </Card>
  );
}
