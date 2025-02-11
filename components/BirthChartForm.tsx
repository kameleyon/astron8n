"use client";


import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Calendar, Clock, AlertCircle } from "lucide-react";

import { LocationSearch } from "./LocationSearch";



interface Location {

  name: string;

  lat: number;

  lng: number;

}



export default function BirthChartForm() {

  const router = useRouter();

  const [formData, setFormData] = useState({

    name: "",

    date: "",

    time: "",

    unknownTime: false,

  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);

    setError("");



    if (!selectedLocation) {

      setError("Please select a valid location");

      setLoading(false);

      return;

    }



    try {

      const { data: { user } } = await supabase.auth.getUser();

      

      if (!user) {

        throw new Error("Not authenticated");

      }



      const { error: upsertError } = await supabase

        .from("user_profiles")

        .upsert({

          id: user.id,

          full_name: formData.name,

          birth_date: formData.date,

          birth_time: formData.unknownTime ? null : formData.time,

          birth_location: selectedLocation.name,

          latitude: selectedLocation.lat,

          longitude: selectedLocation.lng,

          has_unknown_birth_time: formData.unknownTime,

          has_accepted_terms: true

        });



      if (upsertError) throw upsertError;

      

      router.push("/dashboard");

    } catch (err: any) {

      console.error("Error:", err);

      setError(err.message);

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in slide-in-from-bottom duration-300">

        <div className="text-center mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-2">

            Birth Chart Information

          </h2>

          <p className="text-sm text-gray-600">

            Please provide your birth details for accurate readings

          </p>

        </div>



        {error && (

          <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-lg text-sm flex items-center gap-2">

            <AlertCircle size={16} />

            {error}

          </div>

        )}



        <form onSubmit={handleSubmit} className="space-y-6">

          <div>

            <label className="block text-sm font-medium text-gray-700">

              Full Name

            </label>

            <input

              type="text"

              required

              value={formData.name}

              onChange={(e) =>

                setFormData({ ...formData, name: e.target.value })

              }

              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"

              placeholder="Enter your full name"

            />

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700">

              Date of Birth

            </label>

            <div className="mt-1 relative">

              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              <input

                type="date"

                required

                value={formData.date}

                onChange={(e) =>

                  setFormData({ ...formData, date: e.target.value })

                }

                className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"

              />

            </div>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700">

              Time of Birth

            </label>

            <div className="mt-1 space-y-2">

              <div className="relative">

                <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                <input

                  type="time"

                  value={formData.time}

                  onChange={(e) =>

                    setFormData({ ...formData, time: e.target.value })

                  }

                  disabled={formData.unknownTime}

                  className="block w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:cursor-not-allowed"

                />

              </div>

              <label className="flex items-center">

                <input

                  type="checkbox"

                  checked={formData.unknownTime}

                  onChange={(e) =>

                    setFormData({ ...formData, unknownTime: e.target.checked })

                  }

                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"

                />

                <span className="ml-2 text-sm text-gray-600">

                  I don't know my birth time

                </span>

              </label>

            </div>

          </div>



          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">

              Place of Birth

            </label>

            <LocationSearch

              value={selectedLocation?.name}

              onSelect={setSelectedLocation}

              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"

            />

          </div>



          <button

            type="submit"

            disabled={loading || !selectedLocation}

            className="w-full py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"

          >

            {loading ? "Processing..." : "Continue"}

          </button>

        </form>

      </div>

    </div>

  );

}