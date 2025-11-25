
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogOut, Info, LayoutDashboard, ClipboardList, Book, BarChart, MessageSquare, FileText, ShieldCheck, Shield, User, Users } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/hooks/useSidebar";

const MotionLink = motion(Link);

// --- Main Sidebar Component ---
interface SidebarProps {
  profileRole: string | undefined;
  signOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ profileRole, signOut }) => {
  const location = useLocation();

  const { isOpen: expanded, setIsOpen: setExpanded } = useSidebar(); // Use centralized state
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const shouldReducedMotion = useReducedMotion();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (!expanded) {
      setIsTooltipVisible(false);
    }
  }, [expanded]);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/consumer-dashboard', roles: ['consumer'] },
    { id: 'dashboard-bp', label: 'Dashboard', icon: LayoutDashboard, to: '/business-partner-dashboard', roles: ['business_partner'] },
    { id: 'dashboard-sc', label: 'Dashboard', icon: LayoutDashboard, to: '/service-center-dashboard', roles: ['service_center'] },
    { id: 'products', label: 'Product Vault', icon: Shield, to: '/products', roles: ['consumer'] },
    { id: 'requests', label: 'Service Requests', icon: ClipboardList, to: '/service-requests', roles: ['consumer'] },
    { id: 'warranty', label: 'Warranty Tracker', icon: ShieldCheck, to: '/warranty-tracker', roles: ['consumer'] },
    { id: 'service-queue', label: 'Service Queue', icon: ClipboardList, to: '/service-queue', roles: ['business_partner', 'service_center'] },
    { id: 'product-catalog', label: 'Product Catalog', icon: Book, to: '/product-catalog', roles: ['business_partner'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart, to: '/analytics', roles: ['business_partner'] },
    { id: 'customer-communication', label: 'Customer Communication', icon: MessageSquare, to: '/customer-communication', roles: ['service_center'] },
    { id: 'service-reports', label: 'Service Reports', icon: FileText, to: '/service-reports', roles: ['service_center'] },
    { id: 'community', label: 'Community', icon: Users, to: '/community', roles: ['consumer'] },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare, to: '/chat', roles: ['consumer', 'business_partner', 'service_center'] },
  ].filter(item => item.roles.includes(profileRole || 'guest'));

  const footerNavItems = [
    { id: 'profile', label: 'Profile', icon: User, to: '/profile' },
    { id: 'about', label: 'About', icon: Info, to: '/about' },
  ];

  const renderSidebarContent = () => (
    <motion.aside
      ref={containerRef}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) setExpanded(false);
      }}
      initial={false}
      animate={{ width: expanded ? 280 : 80 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-card/80 dark:bg-[#0f1713]/85 border-r border-border/50 backdrop-blur-sm px-3 pt-3 pb-4 flex flex-col items-start z-50 overflow-x-hidden"
      aria-label="Primary navigation"
    >
      {/* Top logo */}
      <div className="w-full flex items-center justify-center mb-2">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Shield className="w-5 h-5 text-primary" />
        </motion.div>
      </div>

      <nav className="w-full mt-2 flex-1" aria-label="Main">
        {mainNavItems.map((item) => {
          const active = location.pathname === item.to;
          const IconComponent = item.icon;
          return (
            <Tooltip key={item.id} open={isTooltipVisible && !expanded}>
              <TooltipTrigger asChild>
                <MotionLink
                  to={item.to}
                  onMouseEnter={() => setIsTooltipVisible(true)}
                  onMouseLeave={() => setIsTooltipVisible(false)}
                  className={cn(
                    "relative w-full flex items-center px-1 py-2 rounded-lg hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200",
                    expanded ? "gap-3" : "justify-center"
                  )}
                  whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3 }}
                  whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {expanded && <motion.span
                    layout
                    className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${active ? 'bg-primary' : 'bg-transparent'}`}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                  />}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-primary/10' : 'bg-transparent'}`}
                    animate={shouldReducedMotion ? {} : (active ? { scale: 1.02, rotate: 3 } : { scale: 1, rotate: 0 })}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <IconComponent className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -6, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className={`ml-2 text-sm font-medium whitespace-nowrap overflow-hidden ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MotionLink>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto w-full flex flex-col items-start gap-2">
        {footerNavItems.map((item) => {
          const active = location.pathname === item.to;
          const IconComponent = item.icon;
          return (
            <Tooltip key={item.id} open={isTooltipVisible && !expanded}>
              <TooltipTrigger asChild>
                <MotionLink
                  to={item.to}
                  onMouseEnter={() => setIsTooltipVisible(true)}
                  onMouseLeave={() => setIsTooltipVisible(false)}
                  className={cn(
                    "relative w-full flex items-center px-1 py-2 rounded-lg hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200",
                    expanded ? "gap-3" : "justify-center"
                  )}
                  whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3 }}
                  whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {expanded && <motion.span
                    layout
                    className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${active ? 'bg-primary' : 'bg-transparent'}`}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                  />}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-primary/10' : 'bg-transparent'}`}
                    animate={shouldReducedMotion ? {} : (active ? { scale: 1.02, rotate: 3 } : { scale: 1, rotate: 0 })}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <IconComponent className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </motion.div>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -6, width: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className={`ml-2 text-sm font-medium whitespace-nowrap overflow-hidden ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MotionLink>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}

        <div className="w-full flex items-center justify-center py-2">
          <ThemeSwitch />
        </div>

        <Tooltip open={isTooltipVisible && !expanded}>
          <TooltipTrigger asChild>
            <motion.button
              onClick={signOut}
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
              className={cn(
                "relative w-full flex items-center px-1 py-2 rounded-lg hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors duration-200",
                expanded ? "gap-3" : "justify-center"
              )}
              whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3 }}
              whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
              aria-label="Sign Out"
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent"
                animate={shouldReducedMotion ? {} : { scale: 1, rotate: 0 }}
                transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
              >
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </motion.div>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -6, width: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="ml-2 text-sm font-medium whitespace-nowrap overflow-hidden text-muted-foreground"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="right">Sign Out</TooltipContent>
        </Tooltip>
      </div>
    </motion.aside>
  );

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-4 z-50 h-7 w-7 md:hidden"
            aria-label="Toggle Sidebar"
          >
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[--sidebar-width-mobile] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{ "--sidebar-width-mobile": `280px` } as React.CSSProperties}
        >
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return renderSidebarContent();
};