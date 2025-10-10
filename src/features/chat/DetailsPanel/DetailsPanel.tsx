// src/features/chat/DetailsPanel/DetailsPanel.tsx
import React, { useEffect, useRef } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { XIcon, Loader2 } from 'lucide-react';
import { ProductDetails } from './ProductDetails';
import { CustomerDetails } from './CustomerDetails';
import { QueryHistory } from './QueryHistory';
import { useDetails } from '../useDetails';
import { motion, AnimatePresence } from 'framer-motion';

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

  const panelContent = (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? "100%" : 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isMobile ? "100%" : 50 }}
      transition={{ duration: 0.3 }}
      ref={panelRef}
      tabIndex={-1} // Make div focusable
      role="dialog"
      aria-label="Customer and Product Details"
      className="flex h-full flex-col bg-surface/[0.6] text-card-foreground focus:outline-none shadow-xl border-l border-border/50"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-3 bg-card/50 backdrop-blur-sm">
        <h2 className="text-lg font-semibold">Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close details panel" className="hover:bg-accent/10">
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
    </motion.div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {open && (
          <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="right" className="w-full sm:w-[90%] p-0 bg-transparent border-none">
              {panelContent}
            </SheetContent>
          </Sheet>
        )}
      </AnimatePresence>
    );
  } else {
    return (
      <AnimatePresence>
        {open && (
          <div className="w-96">
            {panelContent}
          </div>
        )}
      </AnimatePresence>
    );
  }
};