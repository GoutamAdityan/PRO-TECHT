
// src/features/chat/realtime.ts

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

export interface Message {
  id: string;
  sender: 'customer' | 'agent';
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: { type: 'image' | 'pdf'; url: string; name: string }[];
}

interface ConversationHandlers {
  onMessage: (message: Message) => void;
  onTyping: (isTyping: boolean) => void;
  onPresence: (isOnline: boolean) => void;
}

const mockCustomers: Customer[] = [
  {
    id: 'cust1',
    name: 'Alice Smith',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Thanks for your help!',
    timestamp: '2025-10-10T10:00:00Z',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'cust2',
    name: 'Bob Johnson',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'When will my order arrive?',
    timestamp: '2025-10-09T15:30:00Z',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'cust3',
    name: 'Charlie Brown',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'I have a question about my warranty.',
    timestamp: '2025-10-08T11:00:00Z',
    unreadCount: 0,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  cust1: [
    {
      id: 'msg1',
      sender: 'customer',
      content: 'Hi, I have a problem with my product.',
      timestamp: '2025-10-10T09:50:00Z',
      read: true,
    },
    {
      id: 'msg2',
      sender: 'agent',
      content: 'Sure, how can I help you?',
      timestamp: '2025-10-10T09:52:00Z',
      read: true,
    },
    {
      id: 'msg3',
      sender: 'customer',
      content: 'My widget is not turning on.',
      timestamp: '2025-10-10T09:55:00Z',
      read: false,
    },
    {
      id: 'msg4',
      sender: 'agent',
      content: 'Have you tried restarting it?',
      timestamp: '2025-10-10T09:58:00Z',
      read: false,
    },
    {
      id: 'msg5',
      sender: 'customer',
      content: 'Yes, I did. Still no luck.',
      timestamp: '2025-10-10T09:59:00Z',
      read: false,
    },
    {
      id: 'msg6',
      sender: 'agent',
      content: 'Okay, let me check some troubleshooting steps for you.',
      timestamp: '2025-10-10T09:59:30Z',
      read: false,
    },
    {
      id: 'msg7',
      sender: 'customer',
      content: 'Thanks for your help!',
      timestamp: '2025-10-10T10:00:00Z',
      read: false,
    },
  ],
  cust2: [
    {
      id: 'msg8',
      sender: 'customer',
      content: 'When will my order arrive?',
      timestamp: '2025-10-09T15:30:00Z',
      read: true,
    },
    {
      id: 'msg9',
      sender: 'agent',
      content: 'Let me check the tracking information for you.',
      timestamp: '2025-10-09T15:31:00Z',
      read: true,
    },
  ],
  cust3: [
    {
      id: 'msg10',
      sender: 'customer',
      content: 'I have a question about my warranty.',
      timestamp: '2025-10-08T11:00:00Z',
      read: true,
    },
    {
      id: 'msg11',
      sender: 'agent',
      content: 'Sure, what is your product model?',
      timestamp: '2025-10-08T11:01:00Z',
      read: true,
    },
  ],
};

// Simulate a real-time connection
const conversationSubscriptions: Record<string, ConversationHandlers> = {};

export const subscribeToConversation = (
  conversationId: string,
  handlers: ConversationHandlers
) => {
  conversationSubscriptions[conversationId] = handlers;

  // Simulate typing and presence events
  let typingTimeout: NodeJS.Timeout;
  let presenceInterval: NodeJS.Timeout;

  // Simulate typing
  typingTimeout = setTimeout(() => {
    if (conversationSubscriptions[conversationId]) {
      conversationSubscriptions[conversationId].onTyping(true);
      setTimeout(() => {
        if (conversationSubscriptions[conversationId]) {
          conversationSubscriptions[conversationId].onTyping(false);
        }
      }, 3000);
    }
  }, 5000);

  // Simulate presence
  let isOnline = true;
  presenceInterval = setInterval(() => {
    isOnline = !isOnline;
    if (conversationSubscriptions[conversationId]) {
      conversationSubscriptions[conversationId].onPresence(isOnline);
    }
  }, 10000); // Toggle online status every 10 seconds

  return () => {
    clearTimeout(typingTimeout);
    clearInterval(presenceInterval);
    delete conversationSubscriptions[conversationId];
  };
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        sender: 'agent',
        content,
        timestamp: new Date().toISOString(),
        read: false, // Agent messages are unread by customer until customer reads them
      };
      if (!mockMessages[conversationId]) {
        mockMessages[conversationId] = [];
      }
      mockMessages[conversationId].push(newMessage);

      // Simulate customer response
      setTimeout(() => {
        const customerResponse: Message = {
          id: `msg${Date.now() + 1}`,
          sender: 'customer',
          content: `Echo: ${content}`,
          timestamp: new Date().toISOString(),
          read: false,
        };
        mockMessages[conversationId].push(customerResponse);
        if (conversationSubscriptions[conversationId]) {
          conversationSubscriptions[conversationId].onMessage(customerResponse);
        }
      }, 2000);

      resolve(newMessage);
    }, 500);
  });
};

export const fetchConversations = async (): Promise<Customer[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 500);
  });
};

export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[conversationId] || []);
    }, 500);
  });
};

export const markMessagesAsRead = async (conversationId: string, messageIds: string[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockMessages[conversationId]) {
        mockMessages[conversationId] = mockMessages[conversationId].map(msg =>
          messageIds.includes(msg.id) ? { ...msg, read: true } : msg
        );
      }
      // Also update unread count in mockCustomers
      const customer = mockCustomers.find(c => c.id === conversationId);
      if (customer) {
        customer.unreadCount = 0; // For simplicity, mark all as read
      }
      resolve();
    }, 200);
  });
};
