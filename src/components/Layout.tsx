import { ModeToggle } from "@/components/theme-toggle";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
import { Topbar } from "@/components/ui/Topbar";
import { RoleGuard } from "@/components/ui/RoleGuard"; // Import RoleGuard
import { Shield, Package, Wrench, LogOut, LayoutDashboard, ClipboardList, Book, BarChart, User, Info, ShieldCheck, MessageSquare, FileText } from "lucide-react";

const MainLayout = () => {
  const { isExpanded } = useSidebar();
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/products":
        return "Product Vault";
      case "/service-requests":
        return "Service Requests";
      case "/service-queue":
        return "Service Queue";
      case "/product-catalog":
        return "Product Catalog";
      case "/analytics":
        return "Analytics";
      case "/warranty-tracker":
        return "Warranty Tracker";
      case "/active-jobs":
        return "Active Jobs";
      case "/customer-communication":
        return "Customer Communication";
      case "/service-reports":
        return "Service Reports";
      case "/profile":
        return "Profile";
      case "/about":
        return "About Us";
      default:
        return "ServiceBridge";
    }
  };

  const currentPageTitle = getPageTitle(location.pathname);

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
            <RoleGuard allowed={['consumer', 'service_center', 'business_partner']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Dashboard" to="/">
                  <LayoutDashboard />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>

            <RoleGuard allowed={['consumer']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Product Vault" to="/products">
                  <Package />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Service Requests" to="/service-requests">
                  <Wrench />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Warranty Tracker" to="/warranty-tracker">
                  <ShieldCheck />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>

            <RoleGuard allowed={['business_partner']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Service Queue" to="/service-queue">
                  <ClipboardList />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Product Catalog" to="/product-catalog">
                  <Book />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Analytics" to="/analytics">
                  <BarChart />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>

            <RoleGuard allowed={['service_center']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Active Jobs" to="/active-jobs">
                  <ClipboardList />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Customer Communication" to="/customer-communication">
                  <MessageSquare />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="Service Reports" to="/service-reports">
                  <FileText />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex flex-col items-center w-full gap-2">
            <RoleGuard allowed={['consumer', 'service_center', 'business_partner']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Profile" to="/profile">
                  <User />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton label="About Us" to="/about">
                  <Info />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>
            <ModeToggle isExpanded={isExpanded} />
            <RoleGuard allowed={['consumer', 'service_center', 'business_partner']}>
              <SidebarMenuItem>
                <SidebarMenuButton label="Sign Out" onClick={signOut}>
                  <LogOut />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </RoleGuard>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Topbar pageTitle={currentPageTitle} actions={<ModeToggle isExpanded={isExpanded} />} />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
};

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