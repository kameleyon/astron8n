import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// Dynamic import for the worker
let astroWorker: any = null;

// Initialize the worker
const initWorker = async () => {
  if (typeof window === 'undefined') return null;
  
  if (!astroWorker) {
    try {
      // Create a worker instance manually
      const worker = new Worker(new URL('../lib/astro/astro.worker.js', import.meta.url));
      
      // Create a promise-based interface for the worker
      astroWorker = {
        calculateBirthChart: (data: any) => {
          return new Promise((resolve, reject) => {
            const messageId = Date.now().toString();
            
            const handleMessage = (e: MessageEvent) => {
              if (e.data.id === messageId) {
                worker.removeEventListener('message', handleMessage);
                if (e.data.error) {
                  reject(new Error(e.data.error));
                } else {
                  resolve(e.data.result);
                }
              }
            };
            
            worker.addEventListener('message', handleMessage);
            worker.postMessage({
              type: 'calculateBirthChart',
              data,
              id: messageId
            });
          });
        },
        calculateTransits: (birthData: any, transitDate: Date) => {
          return new Promise((resolve, reject) => {
            const messageId = Date.now().toString();
            
            const handleMessage = (e: MessageEvent) => {
              if (e.data.id === messageId) {
                worker.removeEventListener('message', handleMessage);
                if (e.data.error) {
                  reject(new Error(e.data.error));
                } else {
                  resolve(e.data.result);
                }
              }
            };
            
            worker.addEventListener('message', handleMessage);
            worker.postMessage({
              type: 'calculateTransits',
              birthData,
              transitDate: transitDate.toISOString(),
              id: messageId
            });
          });
        },
        calculateCompatibility: (person1: any, person2: any) => {
          return new Promise((resolve, reject) => {
            const messageId = Date.now().toString();
            
            const handleMessage = (e: MessageEvent) => {
              if (e.data.id === messageId) {
                worker.removeEventListener('message', handleMessage);
                if (e.data.error) {
                  reject(new Error(e.data.error));
                } else {
                  resolve(e.data.result);
                }
              }
            };
            
            worker.addEventListener('message', handleMessage);
            worker.postMessage({
              type: 'calculateCompatibility',
              person1,
              person2,
              id: messageId
            });
          });
        }
      };
    } catch (error) {
      console.error('Failed to initialize astrology worker:', error);
      return null;
    }
  }
  
  return astroWorker;
};

/**
 * Hook to calculate birth chart using Web Worker
 */
export function useBirthChart(birthData: any, enabled = true) {
  const [worker, setWorker] = useState<any>(null);
  
  // Initialize worker on mount
  useEffect(() => {
    let mounted = true;
    
    const loadWorker = async () => {
      const workerInstance = await initWorker();
      if (mounted) {
        setWorker(workerInstance);
      }
    };
    
    loadWorker();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Use React Query to handle the calculation and caching
  return useQuery({
    queryKey: ['birthChart', birthData],
    queryFn: async () => {
      if (!worker) {
        throw new Error('Worker not initialized');
      }
      
      return worker.calculateBirthChart(birthData);
    },
    enabled: !!worker && !!birthData && enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
  });
}

/**
 * Hook to calculate transits using Web Worker
 */
export function useTransits(birthData: any, transitDate: Date = new Date(), enabled = true) {
  const [worker, setWorker] = useState<any>(null);
  
  // Initialize worker on mount
  useEffect(() => {
    let mounted = true;
    
    const loadWorker = async () => {
      const workerInstance = await initWorker();
      if (mounted) {
        setWorker(workerInstance);
      }
    };
    
    loadWorker();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Use React Query to handle the calculation and caching
  return useQuery({
    queryKey: ['transits', birthData, transitDate.toISOString()],
    queryFn: async () => {
      if (!worker) {
        throw new Error('Worker not initialized');
      }
      
      return worker.calculateTransits(birthData, transitDate);
    },
    enabled: !!worker && !!birthData && enabled,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
  });
}

/**
 * Hook to calculate compatibility using Web Worker
 */
export function useCompatibility(person1: any, person2: any, enabled = true) {
  const [worker, setWorker] = useState<any>(null);
  
  // Initialize worker on mount
  useEffect(() => {
    let mounted = true;
    
    const loadWorker = async () => {
      const workerInstance = await initWorker();
      if (mounted) {
        setWorker(workerInstance);
      }
    };
    
    loadWorker();
    
    return () => {
      mounted = false;
    };
  }, []);
  
  // Use React Query to handle the calculation and caching
  return useQuery({
    queryKey: ['compatibility', person1, person2],
    queryFn: async () => {
      if (!worker) {
        throw new Error('Worker not initialized');
      }
      
      return worker.calculateCompatibility(person1, person2);
    },
    enabled: !!worker && !!person1 && !!person2 && enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
  });
}
