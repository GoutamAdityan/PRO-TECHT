
// src/hooks/useRealtime.ts
import { useEffect, useRef } from 'react';
import { mockRealtimeAdapter } from '@/lib/realtime/mockAdapter';

interface RealtimeEventHandlers {
  newRequest?: (payload: any) => void;
  // Add other event handlers as needed
}

export const useRealtime = (handlers: RealtimeEventHandlers) => {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const subscriptions: (() => void)[] = [];

    if (handlersRef.current.newRequest) {
      subscriptions.push(mockRealtimeAdapter.subscribe('newRequest', handlersRef.current.newRequest));
    }

    // Add subscriptions for other events here

    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);
};
