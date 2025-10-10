// src/features/chat/ChatPage.tsx
import React, { useState, useEffect } from 'react';
import { CustomerList } from './CustomerList';
import { ConversationView } from './ConversationView';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon, InfoIcon } from 'lucide-react'; // Assuming lucide-react is available for icons
import { useChat } from './useChat';
import { DetailsPanel } from './DetailsPanel/DetailsPanel';
import { useMediaQuery } from '@/hooks/use-mobile'; // Assuming this hook exists for mobile detection

const ChatPage: React.FC = () => {
  const [isCustomerListSheetOpen, setIsCustomerListSheetOpen] = useState(false);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const chatState = useChat();
  const { selectedCustomer } = chatState;
  const isMobile = useMediaQuery('(max-width: 768px)'); // Adjust breakpoint as needed

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
          {/* Conversation Header with Details Button */}
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-3">
              {selectedCustomer ? (
                <>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                    <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedCustomer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {chatState.isCustomerOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="font-medium text-muted-foreground">Select a customer</p>
              )}
            </div>
            {selectedCustomer && (
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDetailsPanelOpen((prev) => !prev)}
                  aria-label="Toggle customer and product details"
                >
                  <InfoIcon className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          <ConversationView {...chatState} />
        </div>

        {/* Details Panel */}
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