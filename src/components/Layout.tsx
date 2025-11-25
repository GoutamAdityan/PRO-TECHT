import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/ui/sidebar';
import { SidebarProvider } from '@/providers/SidebarProvider';
import { useAuth } from '@/hooks/useAuth';
import CustomCursor from './ui/CustomCursor';

const Layout = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isHomePage = location.pathname === '/';

  if (isAuthPage || isHomePage) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <CustomCursor />
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background text-foreground overflow-hidden flex font-sans selection:bg-primary/30">
        <CustomCursor />
        <Sidebar profileRole={profile?.role} signOut={signOut} />
        <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
            <div className="glass-panel rounded-3xl p-6 min-h-full relative">
              <AnimatePresence mode="wait">
                <Outlet />
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;