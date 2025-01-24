"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import LoadingState from './dashboard/LoadingState';

interface SessionProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function SessionProvider({ children, requireAuth = false }: SessionProviderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useSessionTimeout();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          if (session && !requireAuth) {
            router.replace('/dashboard');
          } else if (!session && requireAuth) {
            router.replace('/auth');
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        if (mounted && requireAuth) {
          router.replace('/auth');
        }
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (session && !requireAuth) {
          router.replace('/dashboard');
        } else if (!session && requireAuth) {
          router.replace('/auth');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router, requireAuth]);

  if (isLoading) {
    return <LoadingState />;
  }

  return <>{children}</>;
}