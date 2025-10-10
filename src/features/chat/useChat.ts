
// src/features/chat/useChat.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Customer, Message,
  fetchConversations, fetchMessages, sendMessage, subscribeToConversation, markMessagesAsRead,
} from './realtime';

export interface ChatState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  messages: Message[];
  isLoadingCustomers: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean;
  error: string | null;
  isTyping: boolean;
  isCustomerOnline: boolean;
  selectCustomer: (customerId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  markConversationAsRead: (conversationId: string) => Promise<void>;
}

export const useChat = (): ChatState => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isCustomerOnline, setIsCustomerOnline] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Fetch customers on initial load
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const fetchedCustomers = await fetchConversations();
        setCustomers(fetchedCustomers);
      } catch (err) {
        setError('Failed to fetch customers.');
        console.error(err);
      } finally {
        setIsLoadingCustomers(false);
      }
    };
    getCustomers();
  }, []);

  // Select customer and fetch messages
  const selectCustomer = useCallback(async (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsLoadingMessages(true);
      setMessages([]); // Clear messages for previous conversation
      setError(null);

      // Unsubscribe from previous conversation if any
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      try {
        const fetchedMessages = await fetchMessages(customerId);
        setMessages(fetchedMessages);
        // Mark messages as read after fetching
        const unreadMessageIds = fetchedMessages.filter(msg => msg.sender === 'customer' && !msg.read).map(msg => msg.id);
        if (unreadMessageIds.length > 0) {
          await markMessagesAsRead(customerId, unreadMessageIds);
          // Update customer's unread count in the list
          setCustomers(prevCustomers =>
            prevCustomers.map(c =>
              c.id === customerId ? { ...c, unreadCount: 0 } : c
            )
          );
        }

        // Subscribe to real-time updates for the new conversation
        unsubscribeRef.current = subscribeToConversation(customerId, {
          onMessage: (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            // If the new message is from the customer, mark it as read immediately
            if (newMessage.sender === 'customer') {
              markMessagesAsRead(customerId, [newMessage.id]);
            }
          },
          onTyping: (typingStatus) => {
            setIsTyping(typingStatus);
          },
          onPresence: (onlineStatus) => {
            setIsCustomerOnline(onlineStatus);
          },
        });
      } catch (err) {
        setError('Failed to fetch messages.');
        console.error(err);
      } finally {
        setIsLoadingMessages(false);
      }
    }
  }, [customers]);

  // Clean up subscription on unmount or when selectedCustomer changes to null
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [selectedCustomer]);

  const sendChatMessage = useCallback(async (content: string) => {
    if (!selectedCustomer) return;

    setIsSendingMessage(true);
    setError(null);

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: 'agent',
      content,
      timestamp: new Date().toISOString(),
      read: false, // Optimistically assume not read yet
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    try {
      const sentMessage = await sendMessage(selectedCustomer.id, content);
      // Replace optimistic message with actual sent message
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === optimisticMessage.id ? sentMessage : msg))
      );
    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
      // Optionally, mark the optimistic message as failed
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === optimisticMessage.id ? { ...msg, content: `Failed: ${msg.content}` } : msg
        )
      );
    } finally {
      setIsSendingMessage(false);
    }
  }, [selectedCustomer]);

  const markConversationAsRead = useCallback(async (conversationId: string) => {
    const customer = customers.find(c => c.id === conversationId);
    if (customer && customer.unreadCount > 0) {
      const unreadMessageIds = messages.filter(msg => msg.sender === 'customer' && !msg.read).map(msg => msg.id);
      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(conversationId, unreadMessageIds);
        setCustomers(prevCustomers =>
          prevCustomers.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        );
      }
    }
  }, [customers, messages]);

  return {
    customers,
    selectedCustomer,
    messages,
    isLoadingCustomers,
    isLoadingMessages,
    isSendingMessage,
    error,
    isTyping,
    isCustomerOnline,
    selectCustomer,
    sendMessage: sendChatMessage,
    markConversationAsRead,
  };
};
