import React, { useEffect, useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarContext } from '@/hooks/useSidebar';

// --- Sidebar Provider ---
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(true); // This now controls the desktop sidebar

  const [openMobile, setOpenMobile] = useState(false);

  // Effect to set the sidebar width as a CSS variable for the desktop layout
  useEffect(() => {
    if (!isMobile) {
      const sidebarWidth = isOpen ? '280px' : '80px'; // Expanded and collapsed widths
      document.documentElement.style.setProperty('--sidebar-width', sidebarWidth);
    }
  }, [isOpen, isMobile]);

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setIsOpen((open) => !open);
  }, [isMobile, setIsOpen, setOpenMobile]);

  const contextValue = React.useMemo(
    () => ({ isMobile, isOpen, setIsOpen, openMobile, setOpenMobile, toggleSidebar }),
    [isMobile, isOpen, setIsOpen, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  );
}
