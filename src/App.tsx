
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // Added Navigate
import { AuthProvider, useAuth } from "@/hooks/useAuth"; // Added useAuth
import { SoundProvider } from "@/context/SoundContext";
import HomePage from "./pages/HomePage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import NewProduct from "./pages/NewProduct";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";
import ServiceRequests from "./pages/ServiceRequests";
import NewServiceRequest from "./pages/NewServiceRequest";
import ServiceRequestDetails from "./pages/ServiceRequestDetails";
import WarrantyTracker from "./pages/WarrantyTracker";
import Layout from "@/components/Layout";
import ServiceQueue from "./pages/ServiceQueue";
import ProductCatalog from "./pages/ProductCatalog";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import ActiveJobs from "./pages/ActiveJobs";
import CustomerCommunication from "./pages/CustomerCommunication";
import ServiceReports from "./pages/ServiceReports";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AuthRedirector from "@/components/AuthRedirector"; // Import AuthRedirector
import ConsumerDashboard from "./pages/ConsumerDashboard";
import BusinessPartnerDashboard from "./pages/BusinessPartnerDashboard";
import * as ServiceCenterDashboardModule from "./pages/ServiceCenterDashboard";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/Terms";
import ModerationDashboard from "./pages/ModerationDashboard";
import ChatPage from "./pages/Chat";

const queryClient = new QueryClient();

// ProtectedRoute component for role-based access control
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { profile, loading } = useAuth();

  if (loading) {
    // Optionally render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  if (!profile || !allowedRoles.includes(profile.role)) {
    // Redirect to a "Not Found" page or login if not authorized
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SoundProvider>
            <AuthRedirector /> {/* Render AuthRedirector here */}
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes location={location}>
                <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route element={<Layout />}>
                  <Route path="/chat" element={<PageTransition><ChatPage /></PageTransition>} />
                  <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
                  <Route path="/products/new" element={<PageTransition><NewProduct /></PageTransition>} />
                  <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
                  <Route path="/products/:id/edit" element={<PageTransition><EditProduct /></PageTransition>} />
                  <Route path="/service-requests" element={<PageTransition><ServiceRequests /></PageTransition>} />
                  <Route path="/service-requests/new" element={<PageTransition><NewServiceRequest /></PageTransition>} />
                  <Route path="/service-requests/:id" element={<PageTransition><ServiceRequestDetails /></PageTransition>} />
                  <Route path="/warranty-tracker" element={<PageTransition><WarrantyTracker /></PageTransition>} />
                  <Route path="/service-queue" element={<PageTransition><ServiceQueue /></PageTransition>} />
                  <Route path="/product-catalog" element={<PageTransition><ProductCatalog /></PageTransition>} />
                  <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                  <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
                  <Route path="/active-jobs" element={<PageTransition><ActiveJobs /></PageTransition>} />
                  <Route path="/customer-communication" element={<PageTransition><CustomerCommunication /></PageTransition>} />
                  <Route path="/service-reports" element={<PageTransition><ServiceReports /></PageTransition>} />
                  <Route path="/community" element={<ProtectedRoute allowedRoles={['consumer']}><PageTransition><Community /></PageTransition></ProtectedRoute>} />
                  <Route path="/consumer-dashboard" element={<PageTransition><ConsumerDashboard /></PageTransition>} />
                  <Route path="/business-partner-dashboard" element={<PageTransition><BusinessPartnerDashboard /></PageTransition>} />
                  <Route path="/service-center-dashboard" element={<PageTransition><ServiceCenterDashboardModule.default /></PageTransition>} />
                  <Route path="/moderation-dashboard" element={<PageTransition><ModerationDashboard /></PageTransition>} />
                </Route>
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </TooltipProvider>
          </SoundProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;