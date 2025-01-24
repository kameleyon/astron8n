"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import LoadingState from "@/components/dashboard/LoadingState";
import ErrorState from "@/components/dashboard/ErrorState";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Settings, FileText, Activity, CreditCard, ChevronRight } from "lucide-react";
import { calculateLifePathNumber, calculateBirthCard, calculateHumanDesign } from "@/lib/calculations";
import BirthChart from "@/components/BirthChart";

interface UserProfile {
  id: string;
  full_name: string;
  birth_date: string;
  birth_time: string | null;
  birth_location: string;
  latitude: number;
  longitude: number;
  has_unknown_birth_time: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        setEmail(user.email);

        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          router.push("/birth-chart");
          return;
        }

        setProfile(data);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!profile) return <LoadingState />;

  const lifePath = calculateLifePathNumber(profile.birth_date);
  const birthCard = calculateBirthCard(profile.birth_date);
  const humanDesign = calculateHumanDesign(profile.birth_date, profile.birth_time);

  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return `${month}/${day}/${year}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateStr;
    }
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen flex flex-col bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        
        <Header onAuth={() => {}} />
        
        <main className="flex-grow relative z-10 py-12">
          <div className="w-full max-w-5xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-white text-center mb-8">
              Your Profile
            </h1>

            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-white/20 backdrop-blur-sm rounded-xl p-1 mb-8">
                <TabsTrigger value="personal" className="text-white data-[state=active]:bg-white/50 data-[state=active]:text-primary">
                  <User className="h-4 w-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="birthchart" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Birth Chart
                </TabsTrigger>
                <TabsTrigger value="reports" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  Reports
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                  <Activity className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
                <TabsTrigger value="billing" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl mb-6">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-primary mb-4">Personal Information</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Full Name</label>
                          <p className="mt-1 text-gray-900">{profile.full_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Email</label>
                          <p className="mt-1 text-gray-900">{email}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">Birth Information</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Birth Date</label>
                          <p className="mt-1 text-gray-900">{formatDate(profile.birth_date)}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Birth Time</label>
                          <p className="mt-1 text-gray-900">
                            {profile.has_unknown_birth_time ? "Not provided" : profile.birth_time}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-600">Birth Location</label>
                          <p className="mt-1 text-gray-900">{profile.birth_location}</p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6 bg-[#0d0630]/50 text-[#0d0630]/50" />

                    <div>
                      <h3 className="text-lg font-semibold text-primary mb-4">Additional Information</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-600 mb-1">Human Design</h4>
                          <p className="text-xl font-bold text-primary">{humanDesign.type}</p>
                          <p className="text-xs text-gray-500 mt-1">Profile {humanDesign.profile} - {humanDesign.meaning}</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-600 mb-1">Life Path Number</h4>
                          <p className="text-xl font-bold text-primary">{lifePath.number}</p>
                          <p className="text-xs text-gray-500 mt-1">{lifePath.meaning}</p>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <h4 className="text-sm font-medium text-gray-600 mb-1">Birth Card</h4>
                          <p className="text-xl font-bold text-primary">{birthCard.card}</p>
                          <p className="text-xs text-gray-500 mt-1">{birthCard.meaning}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="birthchart">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl">
                  <BirthChart
                    birthDate={profile.birth_date}
                    birthTime={profile.birth_time}
                    birthLocation={profile.birth_location}
                    latitude={profile.latitude}
                    longitude={profile.longitude}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary mb-4">My Reports</h2>
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No reports generated yet</p>
                      <button 
                        onClick={() => router.push('/reports')}
                        className="mt-4 inline-flex items-center text-primary hover:text-primary/80"
                      >
                        Browse available reports
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="usage">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary mb-4">Usage Statistics</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-white/50 p-4 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-600">Chat Messages</h4>
                        <p className="text-2xl font-bold text-primary mt-1">0</p>
                      </div>
                      <div className="bg-white/50 p-4 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-600">Reports Generated</h4>
                        <p className="text-2xl font-bold text-primary mt-1">0</p>
                      </div>
                      <div className="bg-white/50 p-4 rounded-xl">
                        <h4 className="text-sm font-medium text-gray-600">Birth Chart Readings</h4>
                        <p className="text-2xl font-bold text-primary mt-1">0</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl">
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-primary mb-4">Billing & Subscription</h2>
                    <div className="bg-white/50 p-6 rounded-xl">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Free Plan</h3>
                      <p className="text-gray-600 mb-4">You're currently on the free plan</p>
                      <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl">
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Account Settings</h2>
                    
                    <div className="space-y-4">
                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Email Notifications</h3>
                        <p className="text-gray-600 text-sm mb-3">Manage your email preferences and alerts</p>
                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                          Configure
                        </button>
                      </div>

                      <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Settings</h3>
                        <p className="text-gray-600 text-sm mb-3">Control your data and privacy preferences</p>
                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                          Manage
                        </button>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
                        <p className="text-gray-600 text-sm mb-3">Update your password and security settings</p>
                        <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </SessionProvider>
  );
}