import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  thumbnail: string;
}

export interface ServiceRequest {
  id: string;
  productName: string;
  status: 'Open' | 'Closed' | 'Pending';
  date: string;
}

export interface WarrantyEvent {
  id: string;
  productName: string;
  type: 'Purchase' | 'Warranty Expiry' | 'Service';
  date: string;
  description: string;
  status: 'active' | 'nearing_expiry' | 'expired';
}

export interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  date: string;
}

export interface ConsumerDashboardData {
  userName: string;
  products: Product[];
  serviceRequests: ServiceRequest[];
  warrantyHistory: WarrantyEvent[];
  recentActivity: ActivityEvent[];
}

export const useConsumerDashboardData = (initialUserName: string = 'Guest') => {
  const [data, setData] = useState<ConsumerDashboardData>({
    userName: initialUserName,
    products: [],
    serviceRequests: [],
    warrantyHistory: [],
    recentActivity: [],
  });

  useEffect(() => {
    const today = new Date();
    const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());
    const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const mockProducts: Product[] = [
      {
        id: 'prod1',
        name: 'Smart Toaster',
        brand: 'ToastCo',
        model: 'TT-2000',
        serialNumber: 'SN123456789',
        purchaseDate: '2023-01-15',
        warrantyExpiry: '2025-11-01', // Nearing expiry
        thumbnail: '/public/placeholder.svg',
      },
      {
        id: 'prod2',
        name: 'Coffee Maker',
        brand: 'BrewMaster',
        model: 'CM-500',
        serialNumber: 'SN987654321',
        purchaseDate: '2024-03-20',
        warrantyExpiry: '2026-03-20', // Active
        thumbnail: '/public/placeholder.svg',
      },
      {
        id: 'prod3',
        name: 'Blender Pro',
        brand: 'BlendIt',
        model: 'BP-700',
        serialNumber: 'SN112233445',
        purchaseDate: '2024-06-01',
        warrantyExpiry: '2025-09-01', // Expired
        thumbnail: '/public/placeholder.svg',
      },
      {
        id: 'prod4',
        name: 'Air Fryer',
        brand: 'CrispyCook',
        model: 'AF-100',
        serialNumber: 'SN667788990',
        purchaseDate: '2024-07-10',
        warrantyExpiry: '2026-07-10', // Active
        thumbnail: '/public/placeholder.svg',
      },
    ];

    const mockServiceRequests: ServiceRequest[] = [
      { id: 'sr1', productName: 'Smart Toaster', status: 'Open', date: '2025-10-10' },
      { id: 'sr2', productName: 'Coffee Maker', status: 'Pending', date: '2025-09-25' },
    ];

    const mockWarrantyHistory: WarrantyEvent[] = [
      { id: 'we1', productName: 'Smart Toaster', type: 'Purchase', date: '2023-01-15', description: 'Product purchased', status: 'active' },
      { id: 'we2', productName: 'Smart Toaster', type: 'Service', date: '2024-05-20', description: 'Repaired heating element', status: 'active' },
      { id: 'we3', productName: 'Coffee Maker', type: 'Purchase', date: '2024-03-20', description: 'Product purchased', status: 'active' },
      { id: 'we4', productName: 'Smart Toaster', type: 'Warranty Expiry', date: '2025-11-01', description: 'Warranty expires soon', status: 'nearing_expiry' },
      { id: 'we5', productName: 'Blender Pro', type: 'Warranty Expiry', date: '2025-09-01', description: 'Warranty expired', status: 'expired' },
    ];

    const mockRecentActivity: ActivityEvent[] = [
      { id: 'act1', type: 'Service Request', description: 'Submitted new service request for Smart Toaster', date: '2025-10-10' },
      { id: 'act2', type: 'Product Registration', description: 'Registered new Coffee Maker', date: '2025-09-25' },
      { id: 'act3', type: 'Warranty Update', description: 'Warranty extended for Blender Pro', date: '2025-09-01' },
      { id: 'act4', type: 'Service Request', description: 'Service request for Air Fryer closed', date: '2025-08-15' },
    ];

    setData({
      userName: initialUserName,
      products: mockProducts,
      serviceRequests: mockServiceRequests,
      warrantyHistory: mockWarrantyHistory,
      recentActivity: mockRecentActivity,
    });
  }, [initialUserName]);

  const addProduct = (newProduct: Omit<Product, 'id' | 'thumbnail'>) => {
    setData((prev) => {
      const id = `prod${prev.products.length + 1}`;
      const productWithId: Product = { ...newProduct, id, thumbnail: '/public/placeholder.svg' };
      return {
        ...prev,
        products: [...prev.products, productWithId],
        recentActivity: [
          {
            id: `act${prev.recentActivity.length + 1}`,
            type: 'Product Registration',
            description: `Registered new ${newProduct.name}`,
            date: new Date().toISOString().split('T')[0],
          },
          ...prev.recentActivity,
        ],
      };
    });
  };

  return { ...data, addProduct };
};
