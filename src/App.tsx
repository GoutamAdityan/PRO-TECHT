import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
import { About } from "./pages/About";
import ActiveJobs from "./pages/ActiveJobs";
import CustomerCommunication from "./pages/CustomerCommunication";
import ServiceReports from "./pages/ServiceReports";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AuthRedirector from "@/components/AuthRedirector"; // Import AuthRedirector
import ConsumerDashboard from "./pages/ConsumerDashboard";
import BusinessPartnerDashboard from "./pages/BusinessPartnerDashboard";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthRedirector /> {/* Render AuthRedirector here */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/auth" element={<PageTransition><Auth /></PageTransition>} />
                <Route path="/" element={<HomePage />} />
                <Route element={<Layout />}>
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/new" element={<NewProduct />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/products/:id/edit" element={<EditProduct />} />
                  <Route path="/service-requests" element={<ServiceRequests />} />
                  <Route path="/service-requests/new" element={<NewServiceRequest />} />
                  <Route path="/service-requests/:id" element={<ServiceRequestDetails />} />
                  <Route path="/warranty-tracker" element={<WarrantyTracker />} />
                  <Route path="/service-queue" element={<ServiceQueue />} />
                  <Route path="/product-catalog" element={<ProductCatalog />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/active-jobs" element={<ActiveJobs />} />
                                  <Route path="/customer-communication" element={<CustomerCommunication />} />
                                  <Route path="/service-reports" element={<ServiceReports />} />
                                  <Route path="/consumer-dashboard" element={<PageTransition><ConsumerDashboard /></PageTransition>} />
                                  <Route path="/business-partner-dashboard" element={<PageTransition><BusinessPartnerDashboard /></PageTransition>} />                </Route>
                <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;


