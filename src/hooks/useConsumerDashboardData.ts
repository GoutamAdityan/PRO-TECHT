import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Keep existing interfaces, but they might need adjustment based on actual table structure
export interface Product {
  id: string;
  brand: string;
  model: string;
  purchase_date: string;
  warranty_expiry: string;
  product_image_url?: string;
}

export interface ServiceRequest {
  id: string;
  product_id: string;
  status: string;
  created_at: string;
  products: {
    brand: string;
    model: string;
  };
}

export interface WarrantyEvent {
  id: string;
  productName: string;
  type: 'Purchase' | 'Warranty Expiry' | 'Service';
  date: string;
  description: string;
}

export interface ConsumerDashboardData {
  userName: string;
  totalProducts: number;
  activeWarranties: number;
  pendingServiceRequests: number;
  recentProducts: Product[];
  warrantyHistory: WarrantyEvent[]; // This can be developed later
}

export const useConsumerDashboardData = () => {
  const { user, profile } = useAuth();
  const [data, setData] = useState<ConsumerDashboardData>({
    userName: 'Guest',
    totalProducts: 0,
    activeWarranties: 0,
    pendingServiceRequests: 0,
    recentProducts: [],
    warrantyHistory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !profile) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Fetch all products for the user
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, brand, model, purchase_date, warranty_expiry, product_image_url')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        // 2. Fetch all service requests for the user
        const { data: requestsData, error: requestsError } = await supabase
          .from('service_requests')
          .select('id, product_id, status, created_at, products(brand, model)')
          .eq('user_id', user.id);

        if (requestsError) throw requestsError;

        // 3. Calculate the required counts
        const totalProducts = productsData.length;
        const activeWarranties = productsData.filter(p => new Date(p.warranty_expiry) > new Date()).length;
        const pendingServiceRequests = requestsData.filter(r => r.status === 'Pending' || r.status === 'In Progress' || r.status === 'Open').length;

        // 4. Generate Warranty History from products
        const warrantyHistory: WarrantyEvent[] = productsData.map(product => {
          const expiryDate = new Date(product.warranty_expiry);
          const now = new Date();
          const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          let status: 'active' | 'nearing_expiry' | 'expired';
          let description: string;

          if (expiryDate < now) {
            status = 'expired';
            description = `Warranty expired on ${new Date(product.warranty_expiry).toLocaleDateString()}`;
          } else if (expiryDate <= thirtyDaysFromNow) {
            status = 'nearing_expiry';
            description = 'Warranty expires soon';
          } else {
            status = 'active';
            description = `Warranty is active till ${new Date(product.warranty_expiry).toLocaleDateString()}`;
          }

          return {
            id: product.id,
            productName: `${product.brand} ${product.model}`,
            type: 'Warranty Expiry',
            date: product.warranty_expiry,
            description,
            status,
          };
        });

        setData({
          userName: profile.full_name || 'Guest',
          totalProducts,
          activeWarranties,
          pendingServiceRequests,
          recentProducts: productsData.slice(0, 5), // Show the 5 most recent products
          warrantyHistory: warrantyHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        });

      } catch (error: any) {
        console.error("Error fetching dashboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, profile]);

  return { ...data, loading };
};