
// src/features/chat/DetailsPanel/mockDetailsAdapter.ts

export interface Product {
  id: string;
  name: string;
  sku: string;
  model: string;
  imageUrl: string;
  purchaseDate: string;
  warrantyStatus: 'Active' | 'Expired' | 'Pending';
  warrantyEndDate: string;
  attachments: { name: string; url: string; type: 'manual' | 'photo' | 'document' }[];
}

export interface CustomerDetails {
  id: string;
  fullName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  address: string;
  accountCreated: string;
  subscriptionPlan: string;
  loyaltyPoints: number;
  lastOrderDate: string;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
}

export interface Query {
  id: string;
  timestamp: string;
  agentName: string;
  tags: string[];
  notes: string;
}

export interface DetailsData {
  product: Product;
  customer: CustomerDetails;
  queryHistory: Query[];
}

const mockProducts: Record<string, Product> = {
  'cust1-prod1': {
    id: 'prod1',
    name: 'Smart Coffee Maker X1',
    sku: 'SCM-X1-2023',
    model: 'CM-X1',
    imageUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    purchaseDate: '2023-01-15',
    warrantyStatus: 'Active',
    warrantyEndDate: '2025-01-15',
    attachments: [
      { name: 'User Manual', url: 'https://example.com/manual.pdf', type: 'manual' },
      { name: 'Troubleshooting Guide', url: 'https://example.com/guide.pdf', type: 'document' },
    ],
  },
  'cust2-prod1': {
    id: 'prod2',
    name: 'Robotic Vacuum Cleaner Pro',
    sku: 'RVC-PRO-2024',
    model: 'RV-P2',
    imageUrl: 'https://images.unsplash.com/photo-1581539250439-ad480e3d7228?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    purchaseDate: '2024-03-01',
    warrantyStatus: 'Pending',
    warrantyEndDate: '2026-03-01',
    attachments: [
      { name: 'Quick Start Guide', url: 'https://example.com/quickstart.pdf', type: 'manual' },
    ],
  },
  'cust3-prod1': {
    id: 'prod3',
    name: 'Smart Air Purifier Max',
    sku: 'SAP-MAX-2022',
    model: 'AP-M3',
    imageUrl: 'https://images.unsplash.com/photo-1626806787461-2d695619b61d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    purchaseDate: '2022-07-20',
    warrantyStatus: 'Expired',
    warrantyEndDate: '2024-07-20',
    attachments: [],
  },
};

const mockCustomers: Record<string, CustomerDetails> = {
  cust1: {
    id: 'cust1',
    fullName: 'Alice Smith',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    email: 'alice.smith@example.com',
    phone: '+1-555-123-4567',
    address: '123 Main St, Anytown, USA',
    accountCreated: '2022-01-01',
    subscriptionPlan: 'Premium',
    loyaltyPoints: 1500,
    lastOrderDate: '2024-09-20',
    verificationStatus: 'Verified',
  },
  cust2: {
    id: 'cust2',
    fullName: 'Bob Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    email: 'bob.johnson@example.com',
    phone: '+1-555-987-6543',
    address: '456 Oak Ave, Otherville, USA',
    accountCreated: '2023-05-10',
    subscriptionPlan: 'Standard',
    loyaltyPoints: 300,
    lastOrderDate: '2024-10-05',
    verificationStatus: 'Pending',
  },
  cust3: {
    id: 'cust3',
    fullName: 'Charlie Brown',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    email: 'charlie.brown@example.com',
    phone: '+1-555-111-2222',
    address: '789 Pine Ln, Somewhere, USA',
    accountCreated: '2021-11-11',
    subscriptionPlan: 'Basic',
    loyaltyPoints: 800,
    lastOrderDate: '2024-08-12',
    verificationStatus: 'Verified',
  },
};

const mockQueryHistory: Record<string, Query[]> = {
  cust1: [
    {
      id: 'q1',
      timestamp: '2024-09-10T10:30:00Z',
      agentName: 'Agent Sarah',
      tags: ['warranty', 'repair'],
      notes: 'Customer reported issue with coffee maker not brewing. Advised troubleshooting steps.',
    },
    {
      id: 'q2',
      timestamp: '2024-08-25T14:00:00Z',
      agentName: 'Agent John',
      tags: ['billing'],
      notes: 'Customer inquired about subscription renewal. Confirmed auto-renewal is active.',
    },
  ],
  cust2: [
    {
      id: 'q3',
      timestamp: '2024-09-28T09:00:00Z',
      agentName: 'Agent Emily',
      tags: ['delivery', 'tracking'],
      notes: 'Customer asked for order tracking update. Provided tracking number and estimated delivery.',
    },
  ],
  cust3: [
    {
      id: 'q4',
      timestamp: '2024-07-01T11:00:00Z',
      agentName: 'Agent Mike',
      tags: ['product info'],
      notes: 'Customer asked about air purifier filter replacement. Sent link to product page.',
    },
  ],
};

export const fetchDetails = async (conversationId: string): Promise<DetailsData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const customer = mockCustomers[conversationId];
      // For simplicity, assume each customer has one product for now
      const product = mockProducts[`${conversationId}-prod1`]; 
      const queryHistory = mockQueryHistory[conversationId] || [];

      if (customer && product) {
        resolve({ customer, product, queryHistory });
      } else {
        // Fallback for customers without specific mock data
        resolve({
          customer: customer || {
            id: conversationId,
            fullName: `Unknown Customer ${conversationId}`,
            avatarUrl: '',
            email: '',
            phone: '',
            address: '',
            accountCreated: '',
            subscriptionPlan: '',
            loyaltyPoints: 0,
            lastOrderDate: '',
            verificationStatus: 'Unverified',
          },
          product: product || {
            id: 'unknown-prod',
            name: 'Unknown Product',
            sku: '',
            model: '',
            imageUrl: '',
            purchaseDate: '',
            warrantyStatus: 'Expired',
            warrantyEndDate: '',
            attachments: [],
          },
          queryHistory: queryHistory,
        });
      }
    }, 700);
  });
};

export const addPrivateNote = async (conversationId: string, note: string, agentName: string): Promise<Query> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newNote: Query = {
        id: `note-${Date.now()}`,
        timestamp: new Date().toISOString(),
        agentName: agentName,
        tags: ['private note'],
        notes: note,
      };
      if (!mockQueryHistory[conversationId]) {
        mockQueryHistory[conversationId] = [];
      }
      mockQueryHistory[conversationId].unshift(newNote); // Add to the beginning
      resolve(newNote);
    }, 300);
  });
};
