
// src/features/chat/DetailsPanel/QueryHistory.tsx
import React, { useState } from 'react';
import { Query } from './mockDetailsAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface QueryHistoryProps {
  queryHistory: Query[];
  addNote: (noteContent: string) => Promise<void>;
  isLoading: boolean;
}

export const QueryHistory: React.FC<QueryHistoryProps> = ({ queryHistory, addNote, isLoading }) => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = async () => {
    if (newNoteContent.trim()) {
      setIsAddingNote(true);
      await addNote(newNoteContent);
      setNewNoteContent('');
      setIsAddingNote(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Query History & Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Add Private Note:</h4>
          <Textarea
            placeholder="Type your private note here..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
            className="mb-2"
          />
          <Button onClick={handleAddNote} disabled={!newNoteContent.trim() || isAddingNote}>
            {isAddingNote && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Note
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center text-muted-foreground">Loading history...</div>
          ) : queryHistory.length === 0 ? (
            <div className="text-center text-muted-foreground">No query history found.</div>
          ) : (
            queryHistory.map((query) => (
              <div key={query.id} className="border-b pb-3 last:border-b-0">
                <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                  <span>{query.agentName} - {new Date(query.timestamp).toLocaleString()}</span>
                  <div className="flex gap-1">
                    {query.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="px-1 py-0 text-[10px]">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <p className="text-sm">{query.notes}</p>
              </div>
            ))
          )}
        </div>
        {/* Load more functionality can be added here */}
      </CardContent>
    </Card>
  );
};
