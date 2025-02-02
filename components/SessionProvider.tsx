"use client";

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoadingState from './dashboard/LoadingState';

interface SessionContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  isAuthenticated: false,
  isLoading: true
});

export function useSession() {
  return useContext(SessionContext);
}

interface SessionProviderProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export default function SessionProvider({ children, requireAuth = false }: SessionProviderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            setIsAuthenticated(false);
            if (requireAuth) {
              router.replace('/auth');
            }
          }
          return;
        }

        if (!mounted) return;

        const hasSession = !!session;
        setIsAuthenticated(hasSession);

        // Handle routing based on auth state
        if (hasSession && !requireAuth) {
          router.replace('/dashboard');
        } else if (!hasSession && requireAuth) {
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted && requireAuth) {
          router.replace('/auth');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        if (!requireAuth) {
          router.replace('/dashboard');
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        if (requireAuth) {
          router.replace('/auth');
        }
      } else if (event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(true);
      }
    });

    // Initial session check
    checkSession();

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, requireAuth]);

  // Handle loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Provide auth context to children
  return (
    <SessionContext.Provider value={{ isAuthenticated, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}