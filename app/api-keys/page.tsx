"use client";

import { useState, useEffect } from "react";
import { Shield, Copy, Key, CreditCard, Check, AlertCircle, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Link from "next/link";

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

interface ApiPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  requestLimit: number;
  features: string[];
  popular?: boolean;
  priceId: string;
}

export default function ApiKeysPage() {
  const router = useRouter();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyName, setKeyName] = useState("My API Key");
  const [loadingKeys, setLoadingKeys] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const apiPlans: ApiPlan[] = [
    {
      id: "basic",
      name: "Basic",
      description: "For developers just getting started",
      price: "$9.99/month",
      requestLimit: 1000,
      features: [
        "1,000 requests per month",
        "Basic birth chart data",
        "Standard rate limiting",
        "Community support"
      ],
      priceId: "price_1QtJfoGTXKQOsgznJ56CUks0" // Replace with actual Stripe price ID
    },
    {
      id: "pro",
      name: "Professional",
      description: "For growing applications",
      price: "$29.99/month",
      requestLimit: 10000,
      features: [
        "10,000 requests per month",
        "Complete birth chart data",
        "Advanced pattern detection",
        "Email support",
        "Detailed documentation"
      ],
      popular: true,
      priceId: "price_1QtJfoGTXKQOsgznJ56CUks0" // Replace with actual Stripe price ID
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For high-volume applications",
      price: "$99.99/month",
      requestLimit: 100000,
      features: [
        "100,000 requests per month",
        "Complete birth chart data",
        "Advanced pattern detection",
        "Special features analysis",
        "Priority support",
        "Dedicated account manager",
        "Custom integration support"
      ],
      priceId: "price_1QtJfoGTXKQOsgznJ56CUks0" // Replace with actual Stripe price ID
    }
  ];

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
    console.log("Generate API key button clicked");
    if (!agreedToTerms) {
      console.log("Terms not agreed to");
      toast.error("Please agree to the terms and conditions first");
      return;
    }

    if (!keyName.trim()) {
      console.log("Key name is empty");
      toast.error("Please provide a name for your API key");
      return;
    }

    setLoading(true);
    try {
      console.log("Generating API key...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        toast.error("Authentication error: " + userError.message);
        setLoading(false);
        return;
      }
      
      if (!user) {
        console.log("No user found, redirecting to auth page");
        router.push('/auth');
        return;
      }
      console.log("User found:", user.id);

      // Generate a unique API key with ag_ prefix
      const apiKey = 'ag_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);
      console.log("Generated API key:", apiKey);

      // For debugging, let's check if the api_keys table exists and its structure
      console.log("Checking api_keys table...");
      try {
        // First, check if we can count records
        const { count, error: countError } = await supabase
          .from('api_keys')
          .select('*', { count: 'exact', head: true });
        
        console.log("Table exists, count:", count);
        if (countError) {
          console.error("Count error:", countError);
        }
        
        // Then, check the table structure
        const { data: tableInfo, error: tableError } = await supabase.rpc('exec_sql', { 
          sql: "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'api_keys'" 
        });
        
        if (tableError) {
          console.error("Error getting table structure:", tableError);
        } else {
          console.log("Table structure:", tableInfo);
        }
      } catch (tableError) {
        console.error("Error checking table:", tableError);
      }

      // Store the API key in Supabase
      console.log("Inserting API key into database...");
      const insertData = {
        user_id: user.id,
        api_key: apiKey,
        name: keyName,
        enabled: true,
        usage_count: 0,
        rate_limit: 1000,
        created_at: new Date().toISOString()
      };
      console.log("Insert data:", insertData);

      // Try inserting with debug information
      try {
        const { data, error } = await supabase
          .from('api_keys')
          .insert(insertData)
          .select()
          .single();

        if (error) {
          console.error("Database error:", error);
          
          // Try a raw SQL insert as a fallback
          console.log("Trying raw SQL insert...");
          const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', { 
            sql: `INSERT INTO public.api_keys (user_id, api_key, name, enabled, usage_count, rate_limit, created_at) 
                  VALUES ('${user.id}', '${apiKey}', '${keyName}', true, 0, 1000, '${new Date().toISOString()}')
                  RETURNING *` 
          });
          
          if (sqlError) {
            console.error("SQL insert error:", sqlError);
            throw sqlError;
          }
          
          console.log("SQL insert result:", sqlData);
          toast.success("API key generated successfully (via SQL)");
          
          // Refresh the API keys list
          fetchApiKeys();
        } else {
          console.log("API key inserted successfully:", data);
          setApiKeys(prev => [data, ...prev]);
          setKeyName("My API Key");
          setAgreedToTerms(false);
          toast.success("API key generated successfully");
        }
      } catch (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
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

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan first");
      return;
    }

    setCheckoutLoading(true);
    try {
      const plan = apiPlans.find(p => p.id === selectedPlan);
      if (!plan) {
        throw new Error("Selected plan not found");
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          reportType: 'api_subscription'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Failed to start checkout process");
    } finally {
      setCheckoutLoading(false);
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
                  <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
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

                <TabsContent value="plans" className="space-y-6">
                  <h2 className="text-xl font-normal font-league-spartan mb-4">Choose Your API Plan</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {apiPlans.map((plan) => (
                      <Card 
                        key={plan.id}
                        className={`p-6 relative overflow-hidden transition-all ${
                          selectedPlan === plan.id 
                            ? 'ring-2 ring-primary border-transparent' 
                            : 'hover:shadow-md border-gray-200'
                        } ${plan.popular ? 'border-primary' : ''}`}
                      >
                        {plan.popular && (
                          <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 font-medium">
                            MOST POPULAR
                          </div>
                        )}
                        
                        <div className="mb-4">
                          <h3 className="text-lg font-normal font-league-spartan">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        
                        <div className="mb-6">
                          <span className="text-2xl font-bold">{plan.price}</span>
                        </div>
                        
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <Button
                          variant={selectedPlan === plan.id ? "default" : "outline"}
                          className="w-full"
                          onClick={() => handlePlanSelection(plan.id)}
                        >
                          {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                        </Button>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={handleCheckout}
                      disabled={!selectedPlan || checkoutLoading}
                      className="px-8"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  </div>
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
                      <div>
                        <h4 className="font-medium mb-2">Example Request</h4>
                        <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
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
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">Rate Limits</h3>
                      <p className="text-gray-600 mb-4">
                        API requests are rate-limited based on your subscription plan. The rate limits reset monthly.
                      </p>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Limit</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overage Charges</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">Basic</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">1,000 requests</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">$0.01 per request</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">Professional</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">10,000 requests</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">$0.005 per request</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">Enterprise</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">100,000 requests</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">$0.001 per request</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">Response Format</h3>
                      <p className="text-gray-600 mb-4">
                        The API returns a comprehensive birth chart with planetary positions, houses, aspects, and patterns.
                      </p>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "name": "John Doe",
  "location": "New York, NY",
  "date": "1990-01-01",
  "time": "12:00",
  "planets": [
    {
      "name": "Sun",
      "longitude": 280.5,
      "latitude": 0.0,
      "sign": "Capricorn",
      "house": 5,
      "retrograde": false
    },
    // Other planets...
  ],
  "houses": {
    "1": { "cusp": 125.5, "sign": "Leo" },
    // Other houses...
  },
  "aspects": [
    {
      "planet1": "Sun",
      "planet2": "Moon",
      "type": "Trine",
      "orb": 2.3,
      "applying": true
    },
    // Other aspects...
  ],
  "patterns": [
    {
      "name": "Grand Trine",
      "planets": ["Sun", "Moon", "Jupiter"],
      "description": "..."
    },
    // Other patterns...
  ],
  "features": [
    {
      "name": "Stellium",
      "planets": ["Venus", "Mars", "Mercury"],
      "sign": "Aquarius",
      "house": 6,
      "description": "..."
    },
    // Other special features...
  ]
}`}
                      </pre>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">Error Handling</h3>
                      <p className="text-gray-600 mb-4">
                        The API returns standard HTTP status codes and detailed error messages.
                      </p>
                      <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`{
  "error": "Invalid request",
  "details": "The field 'latitude' is required",
  "code": "VALIDATION_ERROR"
}`}
                      </pre>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Common Error Codes</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 font-mono">401</span>
                            <span className="text-sm">Authentication error (invalid or missing API key)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 font-mono">403</span>
                            <span className="text-sm">Authorization error (rate limit exceeded or disabled key)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 font-mono">400</span>
                            <span className="text-sm">Validation error (missing or invalid parameters)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2 font-mono">500</span>
                            <span className="text-sm">Server error (calculation failure or internal error)</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-normal font-league-spartan mb-3">SDK & Code Examples</h3>
                      <p className="text-gray-600 mb-4">
                        We provide client libraries for popular programming languages to make integration easier.
                      </p>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-2">JavaScript/TypeScript</h4>
                          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`import { AstrogenieClient } from '@astrogenie/sdk';

const client = new AstrogenieClient('YOUR_API_KEY');

async function getBirthChart() {
  try {
    const birthChart = await client.calculateBirthChart({
      name: 'John Doe',
      date: '1990-01-01',
      time: '12:00',
      location: 'New York, NY',
      latitude: 40.7128,
      longitude: -74.0060
    });
    
    console.log(birthChart);
  } catch (error) {
    console.error('Error calculating birth chart:', error);
  }
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Python</h4>
                          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
{`from astrogenie import AstrogenieClient

client = AstrogenieClient('YOUR_API_KEY')

try:
    birth_chart = client.calculate_birth_chart(
        name='John Doe',
        date='1990-01-01',
        time='12:00',
        location='New York, NY',
        latitude=40.7128,
        longitude=-74.0060
    )
    
    print(birth_chart)
except Exception as e:
    print(f"Error calculating birth chart: {e}")`}
                          </pre>
                        </div>
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
