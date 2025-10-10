
// src/lib/realtime/mockAdapter.ts

interface ServiceRequestNotification {
  id: string;
  requestId: string;
  productName: string;
  customerName: string;
  requestDate: string;
  status: string;
  assignedCenter: string;
}

type RealtimeEvent = 'newRequest';

type RealtimeCallback = (payload: any) => void;

const subscribers: Record<RealtimeEvent, RealtimeCallback[]> = {
  newRequest: [],
};

export const mockRealtimeAdapter = {
  subscribe: (event: RealtimeEvent, callback: RealtimeCallback) => {
    if (subscribers[event]) {
      subscribers[event].push(callback);
    }
    return () => {
      // Unsubscribe function
      if (subscribers[event]) {
        subscribers[event] = subscribers[event].filter((cb) => cb !== callback);
      }
    };
  },

  emit: (event: RealtimeEvent, payload: any) => {
    if (subscribers[event]) {
      subscribers[event].forEach((callback) => {
        // Simulate async delivery
        setTimeout(() => callback(payload), 100);
      });
    }
  },

  // Mock API for service requests
  submitServiceRequest: async (request: any): Promise<ServiceRequestNotification> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: ServiceRequestNotification = {
          id: `SR${Date.now()}`,
          requestId: `SR${Math.floor(Math.random() * 10000)}`,
          productName: request.productName || 'Unknown Product',
          customerName: request.customerName || 'Unknown Customer',
          requestDate: new Date().toISOString().split('T')[0],
          status: 'Pending',
          assignedCenter: '',
        };
        // Simulate notifying service centers
        mockRealtimeAdapter.emit('newRequest', newRequest);
        resolve(newRequest);
      }, 500);
    });
  },

  // Mock API for active jobs (polling fallback)
  fetchActiveJobs: async (centerId: string): Promise<ServiceRequestNotification[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return some mock active jobs for the center
        const mockJobs: ServiceRequestNotification[] = [
          {
            id: 'SR001',
            requestId: 'SR001',
            productName: 'Smart Coffee Maker X1',
            customerName: 'Alice Smith',
            requestDate: '2025-10-01',
            status: 'Pending',
            assignedCenter: centerId,
          },
          {
            id: 'SR002',
            requestId: 'SR002',
            productName: 'Smartphone Z',
            customerName: 'Bob Williams',
            requestDate: '2025-10-04',
            status: 'In Progress',
            assignedCenter: centerId,
          },
        ];
        resolve(mockJobs);
      }, 700);
    });
  },
};
