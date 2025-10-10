// src/features/chat/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { CustomerList } from './CustomerList';
import { ConversationView } from './ConversationView';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon, InfoIcon } from 'lucide-react';
import { useChat } from './useChat';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added missing import

const ChatPage: React.FC = () => {
  const [isCustomerListSheetOpen, setIsCustomerListSheetOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const chatState = useChat();
  const { selectedCustomer } = chatState;
  const isMobile = useIsMobile();

  // Keyboard shortcut to toggle details panel (D key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'D' || event.key === 'd') {
        setIsDetailsPanelOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close details panel if no customer is selected
  useEffect(() => {
    if (!selectedCustomer) {
      setIsDetailsPanelOpen(false);
    }
  }, [selectedCustomer]);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop Layout - Customer List */}
      <div className="hidden md:flex w-80 bg-card border-r border-border flex-col">
        <CustomerList {...chatState} />
      </div>

      {/* Mobile Layout - Sheet for CustomerList */}
      <Sheet open={isCustomerListSheetOpen} onOpenChange={setIsCustomerListSheetOpen}>
        <div className="flex md:hidden items-center p-3 border-b bg-card">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open customer list</span>
            </Button>
          </SheetTrigger>
          <h1 className="text-lg font-semibold">Customer Communication</h1>
        </div>
        <SheetContent side="left" className="!w-80 p-0">
          <CustomerList {...chatState} />
        </SheetContent>
      </Sheet>

      {/* Conversation View and Details Panel */}
      <div className="flex flex-1">
                            <div className="flex flex-col flex-1 bg-background">
                              <ConversationView
                                {...chatState}
                                isDetailsPanelOpen={isDetailsPanelOpen}
                                setIsDetailsPanelOpen={setIsDetailsPanelOpen}
                              />
                            </div>        {/* Details Panel */}
        <DetailsPanel
          open={isDetailsPanelOpen}
          onClose={() => setIsDetailsPanelOpen(false)}
          conversationId={selectedCustomer?.id || null}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ChatPage;