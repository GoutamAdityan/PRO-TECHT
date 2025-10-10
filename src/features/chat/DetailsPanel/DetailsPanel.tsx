
// src/features/chat/DetailsPanel/DetailsPanel.tsx
import React, { useEffect, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { XIcon, Loader2 } from 'lucide-react';
import { ProductDetails } from './ProductDetails';
import { CustomerDetails } from './CustomerDetails';
import { QueryHistory } from './QueryHistory';
import { useDetails } from '../useDetails';

interface DetailsPanelProps {
  open: boolean;
  onClose: () => void;
  conversationId: string | null;
  isMobile: boolean;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ open, onClose, conversationId, isMobile }) => {
  const { data, isLoading, error, refetch, addNote } = useDetails(conversationId);
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  // Keyboard shortcut to close (Esc)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div
      ref={panelRef}
      tabIndex={-1} // Make div focusable
      role="dialog"
      aria-label="Customer and Product Details"
      className="flex h-full flex-col bg-card text-card-foreground focus:outline-none"
    >
      <div className="flex items-center justify-between border-b p-3">
        <h2 className="text-lg font-semibold">Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close details panel">
          <XIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading details...</span>
          </div>
        )}
        {error && <div className="text-destructive text-center p-4">Error: {error}</div>}
        {data && (
          <>
            <ProductDetails product={data.product} />
            <CustomerDetails customer={data.customer} />
            <QueryHistory queryHistory={data.queryHistory} addNote={addNote} isLoading={isLoading} />
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="right" className="w-full sm:w-[90%] p-0">
          {content}
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <div className="w-96 border-l border-border shadow-lg bg-card text-card-foreground">
        {content}
      </div>
    );
  }
};
