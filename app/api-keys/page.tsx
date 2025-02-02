"use client";

import { useState } from "react";
import { Shield, Copy, Key } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface ApiKey {
  key: string;
  created_at: string;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const generateApiKey = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions first");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Generate a unique API key with ag_ prefix
      const apiKey = 'ag_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);

      // Store the API key in Supabase
      const { error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key: apiKey,
        });

      if (error) throw error;

      setApiKeys(prev => [...prev, { key: apiKey, created_at: new Date().toISOString() }]);
      toast.success("API key generated successfully");
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        
        <Header onAuth={() => {}} />
        
        <main className="relative z-10 py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
              </div>

              <div className="space-y-6">
                <div className="prose prose-sm">
                  <h2 className="text-lg font-semibold mb-2">Generate API Key</h2>
                  <p className="text-gray-600">
                    Use your API key to access the AstroGenie Birth Chart API. Each key has a rate limit of 1000 requests per month.
                  </p>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600"
                  >
                    I agree to the <a href="#" className="text-primary hover:underline">terms and conditions</a> and understand the API usage limits
                  </label>
                </div>

                <Button
                  onClick={generateApiKey}
                  disabled={!agreedToTerms || loading}
                  className="w-full sm:w-auto bg-white"
                >
                  {loading ? "Generating..." : "Generate API Key"}
                </Button>

                {apiKeys.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Your API Keys</h3>
                    <div className="space-y-3">
                      {apiKeys.map((apiKey, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Shield className="w-4 h-4 text-primary" />
                            <code className="text-sm font-mono">{apiKey.key}</code>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyApiKey(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 prose prose-sm">
                  <h3 className="text-lg font-semibold mb-2">API Documentation</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-4">
                      Make POST requests to the birth chart endpoint with your API key in the headers:
                    </p>
                    <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`curl -X POST https://api.astrogenie.ai/v1/birth-chart \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{
  "name": "John Doe",
  "date": "1990-01-01",
  "time": "12:00",
  "location": "New York, NY",
  "latitude": 40.7128,
  "longitude": -74.0060
}'`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </SessionProvider>
  );
}