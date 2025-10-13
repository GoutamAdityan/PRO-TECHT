import { ModeToggle } from "@/components/theme-toggle";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Topbar } from "@/components/ui/Topbar";
import { RoleGuard } from "@/components/ui/RoleGuard"; // Import RoleGuard
import { Shield, Package, Wrench, LogOut, LayoutDashboard, ClipboardList, Book, BarChart, User, Info, ShieldCheck, MessageSquare, FileText } from "lucide-react";

const MainLayout = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/":
        return "ServiceBridge"; // Default for homepage, not dashboard anymore
      case "/consumer-dashboard":
        return "Consumer Dashboard";
      case "/products":
        return "Product Vault";
      case "/service-queue":
        return "Dashboard"; // Business Partner Dashboard
      case "/active-jobs":
        return "Dashboard"; // Service Center Dashboard
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
      <Sidebar profileRole={profile?.role} signOut={signOut} />
      <div className="pl-[88px]"> {/* Offset for the collapsed sidebar width */}
        <Topbar pageTitle={currentPageTitle} />
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
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