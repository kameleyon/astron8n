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
import { Card, CardContent } from "@/components/ui/card";
import { BirthChartWheel } from "@/components/BirthChartWheel";
import { Separator } from "@/components/ui/separator";
import { User, Settings, FileText, Activity, CreditCard, ChevronRight, Edit } from "lucide-react";
import { BirthChartData } from "@/lib/types/birth-chart";
import ProgressBar from "../../components/ui/ProgressBar";

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
  const [birthChartData, setBirthChartData] = useState<BirthChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [credits, setCredits] = useState(100); // Initial credits
  const [billingInfo, setBillingInfo] = useState({ nextPaymentDate: "", activities: [] });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    full_name: profile?.full_name || '',
    birth_date: profile?.birth_date || '',
    birth_time: profile?.birth_time || '',
    birth_location: profile?.birth_location || '',
    latitude: profile?.latitude || 0,
    longitude: profile?.longitude || 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(editData)
        .eq('id', profile?.id);

      if (error) throw error;

      setProfile({ 
        ...profile, 
        ...editData, 
        id: profile?.id || '', 
        latitude: profile?.latitude || 0, 
        longitude: profile?.longitude || 0 
      });
      setShowEditForm(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth");
          return;
        }

        setEmail(user.email || null);

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

        // Calculate birth chart data
        if (data) {
          try {
            const requestData = {
              name: data.full_name,
              date: data.birth_date,
              time: data.birth_time || '12:00',
              location: data.birth_location,
              latitude: data.latitude,
              longitude: data.longitude
            };
            
            console.log('Sending birth chart request:', requestData);

            const response = await fetch('/api/birth-chart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestData)
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.error('Birth chart API error:', errorData);
              throw new Error(errorData.error || 'Failed to fetch birth chart data');
            }

            const chartData = await response.json();
            console.log('Birth chart data received:', chartData);
            setBirthChartData(chartData);
          } catch (err) {
            console.error('Error calculating birth chart:', err);
            setError(err instanceof Error ? err.message : 'Failed to calculate birth chart');
          }
        }
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
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
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
<button
  className="mt-4 text-primary hover:underline flex items-center"
  onClick={() => setShowEditForm(true)}
>
  <Edit className="h-4 w-4 mr-1" />
  Edit
</button>

{showEditForm && (
  <form onSubmit={handleSubmit} className="mt-4">
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-600">Full Name</label>
        <input
          type="text"
          value={editData.full_name}
          onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Birth Date</label>
        <input
          type="date"
          value={editData.birth_date}
          onChange={(e) => setEditData({ ...editData, birth_date: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600">Birth Time</label>
        <input
          type="time"
          value={editData.birth_time || ''}
          onChange={(e) => setEditData({ ...editData, birth_time: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-600">Birth Location</label>
        <input
          type="text"
          value={editData.birth_location}
          onChange={(e) => setEditData({ ...editData, birth_location: e.target.value })}
          className="mt-1 block w-full"
        />
      </div>
    </div>
    <button type="submit" className="mt-4 bg-primary text-white py-2 px-4 rounded">
      Save
    </button>
  </form>
)}
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
                  </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="birthchart">
                <Card className="bg-white/70 backdrop-blur-sm rounded-3xl">
                  <CardContent className="p-6">
                  {birthChartData ? (
                    <div className="space-y-18">
                      {/*<div className=" rounded-xl wx-auto flex justify-center ">
                        <BirthChartWheel data={birthChartData} />
                      </div>*/}
                      
                      {profile.has_unknown_birth_time && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">
                                Birth time not provided. Using noon (12:00) as default. Some calculations may be less accurate.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8">
                        <h2 className="text-2xl font-semibold mb-8">Your Birth Chart</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          {/* Planetary Positions */}
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
                            <div className="space-y-3">
{birthChartData?.planets.map((planet) => (
  <div key={planet.name} className="flex justify-between items-center">
    <span className="font-medium text-gray-700">{planet.name}</span>
    <div className="text-right">
      <span className="text-gray-600">
        {planet.formatted}
        {planet.retrograde && <span className="text-red-500 ml-1">℞</span>}
      </span>
    </div>
  </div>
))}
                            </div>
                          </div>

                          {/* Houses */}
                          <div>
                            <h3 className="text-xl font-semibold mb-4">Houses</h3>
                            <div className="space-y-3">
{Object.entries(birthChartData?.houses || {}).map(([house, data]) => (
  <div key={house} className="flex justify-between items-center">
    <span className="font-medium text-gray-700">house {house.split('_')[1]}</span>
    <span className="text-gray-600">{data.formatted}</span>
  </div>
))}
                            </div>
                          </div>
                        </div>

                        {/* Important Points */}
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold mb-4">Important Points</h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Ascendant</span>
<span className="text-gray-600">{birthChartData?.ascendant.formatted}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-700">Midheaven</span>
<span className="text-gray-600">{birthChartData?.midheaven.formatted}</span>
                            </div>
                          </div>
                        </div>

                        {/* Major Aspects */}
                        {birthChartData.aspects.length > 0 && (
                          <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Major Aspects</h3>
                            <div className="space-y-2">
{birthChartData?.aspects.map((aspect, index) => (
  <div key={index} className="flex justify-between items-center">
    <span className="font-medium text-gray-700">
      {aspect.planet1} {aspect.aspect.toLowerCase()} {aspect.planet2}
    </span>
    <span className="text-gray-600">{aspect.orb}°</span>
  </div>
))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Loading birth chart data...</p>
                    </div>
                  )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Reports</h2>
                    <p className="text-gray-600">Here you can find all your downloaded reports.</p>
                    {/* Add logic to display reports */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="usage">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Usage</h2>
                    <p className="text-gray-600">You have {credits} credits remaining.</p>
                    <ProgressBar value={(100 - credits) / 100 * 100} />
                    {/* Add logic for credit management */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Billing</h2>
                    <p className="text-gray-600">Next payment date: {billingInfo.nextPaymentDate}</p>
                    <p className="text-gray-600">Billing activities:</p>
                    <ul className="list-disc list-inside">
                      {billingInfo.activities.map((activity, index) => (
                        <li key={index} className="text-gray-600">{activity}</li>
                      ))}
                    </ul>
                    {/* Add logic for billing activities */}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white/90 backdrop-blur-sm rounded-3xl mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Settings</h2>
                    <p className="text-gray-600">Manage your account settings here.</p>
                    {/* Add settings options */}
                  </CardContent>
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
