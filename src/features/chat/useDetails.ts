
// src/features/chat/useDetails.ts
import { useState, useEffect, useCallback } from 'react';
import {
  DetailsData, Query,
  fetchDetails, addPrivateNote,
} from './DetailsPanel/mockDetailsAdapter'; // Using mock adapter for now

interface UseDetailsResult {
  data: DetailsData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  addNote: (noteContent: string) => Promise<void>;
}

export const useDetails = (conversationId: string | null): UseDetailsResult => {
  const [data, setData] = useState<DetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!conversationId) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedData = await fetchDetails(conversationId);
      setData(fetchedData);
    } catch (err) {
      setError('Failed to fetch details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addNote = useCallback(async (noteContent: string) => {
    if (!conversationId || !data) return;

    const optimisticNote: Query = {
      id: `temp-note-${Date.now()}`,
      timestamp: new Date().toISOString(),
      agentName: 'Current Agent', // Placeholder for current agent
      tags: ['private note', 'sending'],
      notes: noteContent,
    };

    // Optimistically update UI
    setData((prevData) => {
      if (!prevData) return null;
      return {
        ...prevData,
        queryHistory: [optimisticNote, ...prevData.queryHistory],
      };
    });

    try {
      const newNote = await addPrivateNote(conversationId, noteContent, 'Current Agent');
      // Replace optimistic note with actual note
      setData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          queryHistory: prevData.queryHistory.map((note) =>
            note.id === optimisticNote.id ? { ...newNote, tags: ['private note'] } : note
          ),
        };
      });
    } catch (err) {
      setError('Failed to add note.');
      console.error(err);
      // Revert optimistic update or mark as failed
      setData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          queryHistory: prevData.queryHistory.map((note) =>
            note.id === optimisticNote.id ? { ...note, tags: ['private note', 'failed'] } : note
          ),
        };
      });
    }
  }, [conversationId, data]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    addNote,
  };
};
