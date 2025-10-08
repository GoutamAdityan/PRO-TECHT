import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
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
import About from "./pages/About";

// force reload
const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
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

              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
