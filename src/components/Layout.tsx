import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider } from "@/providers/SidebarProvider";
import NavBar from "./NavBar";
import { Sidebar } from "@/components/ui/sidebar";
import "@/styles/ChatPage.css"; // Import the gradient background styles

const Layout = () => {
  const { profile, signOut } = useAuth(); // Get signOut

  if (!profile) {
    return null; // Or a loading spinner, or a redirect
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full gradient-background">
        <Sidebar profileRole={profile?.role} signOut={signOut} />
        <div style={{ marginLeft: 'var(--sidebar-width)' }} className="transition-all duration-300 ease-in-out">
          <main className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;