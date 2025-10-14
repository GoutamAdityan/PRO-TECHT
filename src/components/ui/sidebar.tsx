import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { LogOut, Info, LayoutDashboard, ClipboardList, Book, BarChart, MessageSquare, FileText, ShieldCheck, Shield, User } from "lucide-react";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/theme-toggle";
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
 
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const shouldReducedMotion = useReducedMotion();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/consumer-dashboard', roles: ['consumer'] },
    { id: 'dashboard-bp', label: 'Dashboard', icon: LayoutDashboard, to: '/business-partner-dashboard', roles: ['business_partner'] },
    { id: 'dashboard-sc', label: 'Dashboard', icon: LayoutDashboard, to: '/active-jobs', roles: ['service_center'] },
    { id: 'products', label: 'Product Vault', icon: Shield, to: '/products', roles: ['consumer'] },
    { id: 'requests', label: 'Service Requests', icon: ClipboardList, to: '/service-requests', roles: ['consumer'] },
    { id: 'warranty', label: 'Warranty Tracker', icon: ShieldCheck, to: '/warranty-tracker', roles: ['consumer'] },
    { id: 'service-queue', label: 'Service Queue', icon: ClipboardList, to: '/service-queue', roles: ['business_partner'] }, // Icon directly here
    { id: 'product-catalog', label: 'Product Catalog', icon: Book, to: '/product-catalog', roles: ['business_partner'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart, to: '/analytics', roles: ['business_partner'] },
    { id: 'active-jobs', label: 'Active Jobs', icon: ClipboardList, to: '/active-jobs', roles: ['service_center'] },
    { id: 'customer-communication', label: 'Customer Communication', icon: MessageSquare, to: '/customer-communication', roles: ['service_center'] },
    { id: 'service-reports', label: 'Service Reports', icon: FileText, to: '/service-reports', roles: ['service_center'] },
  ].filter(item => item.roles.includes(profileRole || 'guest'));

  const footerNavItems = [
    { id: 'profile', label: 'Profile', icon: User, to: '/profile', roles: ['consumer', 'business_partner', 'service_center'] },
    { id: 'about', label: 'About Us', icon: Info, to: '/about', roles: ['consumer', 'business_partner', 'service_center'] },
  ].filter(item => item.roles.includes(profileRole || 'guest'));

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
      animate={{ width: shouldReducedMotion ? (expanded ? 280 : 88) : (expanded ? 280 : 88) }}
      transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
      className="fixed left-0 top-0 h-screen bg-[#0f1713]/85 border-r border-[rgba(255,255,255,0.02)] backdrop-blur-sm px-3 pt-3 pb-4 flex flex-col items-start z-50"
      aria-label="Primary navigation"
    >
      {/* Top logo */}
      <div className="w-full flex items-center justify-center mb-2">
        <div className="w-10 h-10 rounded-full bg-emerald-800/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-300" />
        </div>
      </div>

      <nav className="w-full mt-2 flex-1" aria-label="Main">
        {mainNavItems.map((item) => {
          const active = location.pathname === item.to;
          const IconComponent = item.icon; // Get the icon component
          return (
            <Tooltip key={item.id} delayDuration={120}>
              <TooltipTrigger asChild>
                <MotionLink
                  to={item.to}
                  className={cn(
                    "relative w-full flex items-center px-1 py-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors duration-200",
                    expanded ? "gap-3" : "justify-center"
                  )}
                  whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                  whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {/* Active left indicator */}
                  <motion.span
                    layout
                    className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${active ? 'bg-emerald-400' : 'bg-transparent'}`}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                  />

                  {/* Icon badge */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-emerald-800/40 shadow-[0_8px_24px_rgba(16,185,129,0.06)]' : 'bg-transparent'}`}
                    animate={ shouldReducedMotion ? {} : (active ? { scale: 1.02, rotate: 3 } : { scale: 1, rotate: 0 }) }
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <IconComponent className={`w-5 h-5 ${active ? 'text-emerald-300' : 'text-foreground/70'}`} />
                  </motion.div>

                  {/* Label area — only visible in expanded mode (animated) */}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -6, width: 0 }}
                        transition={shouldReducedMotion ? { duration: 0 } : { duration: 0.22 }}
                        className={`ml-2 text-sm font-medium whitespace-nowrap overflow-hidden ${active ? 'text-emerald-200' : 'text-foreground/80'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MotionLink>
              </TooltipTrigger>
              {!expanded && <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}
      </nav>

      {/* Footer small items (profile, about, theme, sign out) */}
      <div className="mt-auto w-full flex flex-col items-start gap-2">
        {footerNavItems.map((item) => {
          const active = location.pathname === item.to;
          const IconComponent = item.icon; // Get the icon component
          return (
            <Tooltip key={item.id} delayDuration={120}>
              <TooltipTrigger asChild>
                <MotionLink
                  to={item.to}
                  className="relative w-full flex items-center gap-3 px-1 py-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors duration-200"
                  whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
                  whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                >
                  {/* Active left indicator */}
                  <motion.span
                    layout
                    className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full ${active ? 'bg-emerald-400' : 'bg-transparent'}`}
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                  />

                  {/* Icon badge */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-emerald-800/40 shadow-[0_8px_24px_rgba(16,185,129,0.06)]' : 'bg-transparent'}`}
                    animate={ shouldReducedMotion ? {} : (active ? { scale: 1.02, rotate: 3 } : { scale: 1, rotate: 0 }) }
                    transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <IconComponent className={`w-5 h-5 ${active ? 'text-emerald-300' : 'text-foreground/70'}`} />
                  </motion.div>

                  {/* Label area — only visible in expanded mode (animated) */}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -8, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: "auto" }}
                        exit={{ opacity: 0, x: -6, width: 0 }}
                        transition={shouldReducedMotion ? { duration: 0 } : { duration: 0.22 }}
                        className={`ml-2 text-sm font-medium whitespace-nowrap overflow-hidden ${active ? 'text-emerald-200' : 'text-foreground/80'}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MotionLink>
              </TooltipTrigger>
              {!expanded && <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg">{item.label}</TooltipContent>}
            </Tooltip>
          );
        })}

        {/* Theme Toggle */}
        <div className="w-full flex items-center justify-center py-2">
          <ModeToggle />
        </div>

        {/* Sign Out Button */}
        <Tooltip delayDuration={120}>
          <TooltipTrigger asChild>
            <motion.button
              onClick={signOut}
              className="relative w-full flex items-center gap-3 px-1 py-2 rounded-lg hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors duration-200"
              whileHover={shouldReducedMotion ? {} : { scale: 1.01, y: -3, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
              whileTap={shouldReducedMotion ? {} : { scale: 0.99 }}
              aria-label="Sign Out"
            >
              {/* Icon badge */}
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent"
                animate={ shouldReducedMotion ? {} : { scale: 1, rotate: 0 } }
                transition={shouldReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 18 }}
              >
                <LogOut className="w-5 h-5 text-foreground/70" />
              </motion.div>

              {/* Label area — only visible in expanded mode (animated) */}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -6, width: 0 }}
                    transition={shouldReducedMotion ? { duration: 0 } : { duration: 0.22 }}
                    className="ml-2 text-sm font-medium whitespace-nowrap overflow-hidden text-foreground/80"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </TooltipTrigger>
          {!expanded && <TooltipContent side="right" className="bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg">Sign Out</TooltipContent>}
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

Sidebar.displayName = "Sidebar";