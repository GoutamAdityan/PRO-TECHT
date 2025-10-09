import { ModeToggle } from "@/components/theme-toggle";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Shield, Package, Wrench, LogOut, LayoutDashboard, ClipboardList, Book, BarChart, User, Info, ShieldCheck, MessageSquare, FileText } from "lucide-react";

// force reload
// force reload
const MainLayout = () => {
  const { isExpanded } = useSidebar();
  const { user, profile, signOut } = useAuth();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center space-x-3 p-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {isExpanded && <h1 className="text-xl font-bold">ServiceBridge</h1>}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton label="" asChild>
                <NavLink to="/" className="flex items-center">
                  <LayoutDashboard
                    className={`w-4 h-4 ${isExpanded ? 'ml-2' : '-ml-1'}`}
                  />
                  {isExpanded && <span className="ml-2">Dashboard</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {profile?.role === 'consumer' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/products" className="flex items-center">
                      <Package className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Product Vault</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/service-requests" className="flex items-center">
                      <Wrench className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Service Requests</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            {profile?.role !== 'consumer' && profile?.role !== 'service_center' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/service-queue" className="flex items-center">
                      <ClipboardList className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Service Queue</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/product-catalog" className="flex items-center">
                      <Book className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Product Catalog</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/analytics" className="flex items-center">
                      <BarChart className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Analytics</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
            {profile?.role === 'consumer' && (
              <SidebarMenuItem>
                <SidebarMenuButton label="" asChild>
                  <NavLink to="/warranty-tracker" className="flex items-center">
                    <ShieldCheck className="w-4 h-4" />
                    {isExpanded && <span className="ml-2">Warranty Tracker</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {profile?.role === 'service_center' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/active-jobs" className="flex items-center">
                      <ClipboardList className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Active Jobs</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/customer-communication" className="flex items-center">
                      <MessageSquare className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Customer Communication</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton label="" asChild>
                    <NavLink to="/service-reports" className="flex items-center">
                      <FileText className="w-4 h-4" />
                      {isExpanded && <span className="ml-2">Service Reports</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
                <SidebarFooter>
                  <div className="flex flex-col items-center w-full gap-2">
                    <NavLink to="/profile" className="w-full">
                      <Button variant="outline" size={isExpanded ? "lg" : "default"} className="w-full">
                        <User className="h-5 w-5" />
                        {isExpanded && <span className="ml-2">Profile</span>}
                      </Button>
                    </NavLink>
                    <NavLink to="/about" className="w-full">
                      <Button variant="outline" size={isExpanded ? "lg" : "default"} className="w-full">
                        <Info className="h-5 w-5" />
                        {isExpanded && <span className="ml-2">About Us</span>}
                      </Button>
                    </NavLink>
                    <ModeToggle isExpanded={isExpanded} />
                    <div className="flex items-center space-x-4 p-2">
                      {isExpanded && (
                        <div className="text-sm text-muted-foreground">
                          Welcome, {profile?.full_name || user.email}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={signOut}
                        className="flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {isExpanded && <span>Sign Out</span>}
                      </Button>
                    </div>
                  </div>
                </SidebarFooter>      </Sidebar>
      <SidebarInset>
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <SidebarTrigger />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}

const Layout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  return (
    <SidebarProvider>
      <MainLayout />
    </SidebarProvider>
  );
};

export default Layout;