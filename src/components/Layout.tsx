
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
} from "@/components/ui/sidebar";
import { Shield, Package, Wrench, LogOut, LayoutDashboard } from "lucide-react";

const Layout = () => {
  const { user, profile, signOut } = useAuth();

  if (!user) {
    return <Outlet />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarContent>
          <SidebarHeader>
            <div className="flex items-center space-x-3 p-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">ServiceBridge</h1>
            </div>
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {profile?.role === 'consumer' && (
              <>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/products">
                      <Package className="w-4 h-4 mr-2" />
                      Product Vault
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/service-requests">
                      <Wrench className="w-4 h-4 mr-2" />
                      Service Requests
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
          </SidebarMenu>
          <SidebarFooter>
            <div className="flex items-center space-x-4 p-2">
              <div className="text-sm text-muted-foreground">
                Welcome, {profile?.full_name || user.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <SidebarTrigger />
            <div></div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
