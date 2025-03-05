"use client";

import { useState, useEffect } from "react";
import { Shield, Copy, Key, CreditCard, Check, AlertCircle, Zap, Code } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";
import SessionProvider from "@/components/SessionProvider";

interface ApiKey {
  id: string;
  api_key: string;
  name: string;
  enabled: boolean;
  usage_count: number;
  rate_limit: number;
  created_at: string;
  last_used?: string;
  expires_at?: string;
}

export default function ApiGeneratorPage() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyName, setKeyName] = useState("My API Key");
  const [loadingKeys, setLoadingKeys] = useState(true);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoadingKeys(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error("Failed to load API keys");
    } finally {
      setLoadingKeys(false);
    }
  };

  const generateApiKey = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions first");
      return;
    }

    if (!keyName.trim()) {
      toast.error("Please provide a name for your API key");
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
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          api_key: apiKey,
          name: keyName,
          enabled: true,
          usage_count: 0,
          rate_limit: 1000, // Default rate limit
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        
        // Try a raw SQL insert as a fallback
        const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', { 
          sql: `INSERT INTO public.api_keys (user_id, api_key, name, enabled, usage_count, rate_limit, created_at) 
                VALUES ('${user.id}', '${apiKey}', '${keyName}', true, 0, 1000, '${new Date().toISOString()}')
                RETURNING *` 
        });
        
        if (sqlError) {
          throw sqlError;
        }
        
        toast.success("API key generated successfully");
        
        // Refresh the API keys list
        fetchApiKeys();
      } else {
        setApiKeys(prev => [data, ...prev]);
        setKeyName("My API Key");
        setAgreedToTerms(false);
        toast.success("API key generated successfully");
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error("Failed to generate API key: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const toggleApiKey = async (id: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ enabled: !enabled })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => 
        prev.map(key => 
          key.id === id ? { ...key, enabled: !enabled } : key
        )
      );

      toast.success(`API key ${enabled ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      console.error('Error toggling API key:', error);
      toast.error("Failed to update API key");
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== id));
      toast.success("API key deleted successfully");
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error("Failed to delete API key");
    }
  };

  return (
    <SessionProvider requireAuth>
      <div className="min-h-screen bg-gradient-to-r from-secondary to-accent">
        <div className="absolute inset-0 dot-pattern"></div>
        
        <Header onAuth={() => {}} />
        
        <main className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <Card className="p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Key className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-normal font-league-spartan text-gray-900">AstroGenie API</h1>
              </div>

              <p className="text-gray-600 mb-8">
                Integrate accurate astrological calculations into your applications with our powerful API. 
                Generate birth charts, analyze planetary positions, and access astrological insights programmatically.
              </p>

              <Tabs defaultValue="keys" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="keys">Your API Keys</TabsTrigger>
                  <TabsTrigger value="docs">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="keys" className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-normal font-league-spartan mb-4">Generate New API Key</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                          Key Name
                        </label>
                        <input
                          type="text"
                          id="keyName"
                          value={keyName}
                          onChange={(e) => setKeyName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="My API Key"
                        />
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
                          I agree to the <Link href="/terms" className="text-primary hover:underline">terms and conditions</Link> and understand the API usage limits
                        </label>
                      </div>

                      <Button
                        onClick={generateApiKey}
                        disabled={!agreedToTerms || loading}
                        className="w-full sm:w-auto"
                      >
                        {loading ? "Generating..." : "Generate API Key"}
                      </Button>
                    </div>
                  </div>

                  {loadingKeys ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading your API keys...</p>
                    </div>
                  ) : apiKeys.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-normal font-league-spartan">Your API Keys</h3>
                      <div className="space-y-3">
                        {apiKeys.map((apiKey) => (
                          <div
                            key={apiKey.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="mb-3 sm:mb-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="font-medium">{apiKey.name}</span>
                                {apiKey.enabled ? (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                                ) : (
                                  <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Disabled</span>
                                )}
                              </div>
                              <code className="text-sm font-mono text-gray-600">{apiKey.api_key}</code>
                              <div className="text-xs text-gray-500 mt-1">
                                Created: {new Date(apiKey.created_at).toLocaleDateString()}
                                {apiKey.last_used && ` • Last used: ${new Date(apiKey.last_used).toLocaleDateString()}`}
                                {` • Usage: ${apiKey.usage_count}/${apiKey.rate_limit}`}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyApiKey(apiKey.api_key)}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                              <Button
                                variant={apiKey.enabled ? "destructive" : "outline"}
                                size="sm"
                                onClick={() => toggleApiKey(apiKey.id, apiKey.enabled)}
                              >
                                {apiKey.enabled ? "Disable" : "Enable"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteApiKey(apiKey.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-700 mb-1">No API Keys Found</h3>
                      <p className="text-gray-600 mb-4">You haven't generated any API keys yet.</p>
                      <Button
                        onClick={() => document.getElementById('keyName')?.focus()}
                        variant="outline"
                      >
                        Generate Your First Key
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="docs" className="space-y-6">
                  <h2 className="text-xl font-normal font-league-spartan mb-4">API Documentation</h2>
                  
                  <div className="space-y-8">
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">Authentication</h3>
                      <p className="text-gray-600 mb-4">
                        All API requests require authentication using your API key in the Authorization header.
                      </p>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`// Example: Including your API key in requests
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};`}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">Birth Chart Endpoint</h3>
                      <p className="text-gray-600 mb-4">
                        Generate a complete birth chart with planetary positions, houses, aspects, and patterns.
                      </p>
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono">POST</div>
                          <code className="text-sm font-mono">/api/v1/birth-chart</code>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Request Body</h4>
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "name": "John Doe",
  "date": "1990-01-01",     // Format: YYYY-MM-DD
  "time": "12:00",          // Format: HH:MM (24-hour)
  "location": "New York, NY",
  "latitude": 40.7128,      // Decimal degrees
  "longitude": -74.0060     // Decimal degrees
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </SessionProvider>
  );
}
