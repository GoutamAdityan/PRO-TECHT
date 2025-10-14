import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarContext } from '@/hooks/useSidebar';

// --- Sidebar Provider ---
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const contextValue = React.useMemo(
    () => ({ isMobile, openMobile, setOpenMobile }),
    [isMobile, openMobile]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}
