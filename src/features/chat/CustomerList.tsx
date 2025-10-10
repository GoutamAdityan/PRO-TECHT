
// src/features/chat/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatState } from './useChat';
import { motion } from 'framer-motion';

interface CustomerListProps extends ChatState {}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, selectedCustomer, selectCustomer, isLoadingCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  if (isLoadingCustomers) {
    return <div className="p-4 text-center text-muted-foreground">Loading customers...</div>;
  }

  return (
    <div className="flex h-full flex-col bg-card/50 backdrop-blur-sm">
      <div className="p-3 border-b border-border/50">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background/50 border-border/50 focus-visible:ring-primary"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredCustomers.length === 0 && (
          <div className="text-center text-muted-foreground">No customers found.</div>
        )}
        {filteredCustomers.map((customer) => (
          <motion.div
            key={customer.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 relative",
              "hover:bg-accent/10 hover:text-accent-foreground",
              selectedCustomer?.id === customer.id && "bg-accent/20 text-accent-foreground font-medium border-l-4 border-primary"
            )}
            onClick={() => selectCustomer(customer.id)}
            whileHover={{ scale: 1.01, x: 5, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="relative">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {customer.isOnline && (
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm truncate">{customer.name}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(customer.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {customer.lastMessage}
                </p>
                {customer.unreadCount > 0 && (
                  <Badge className="ml-2 px-2 py-0.5 rounded-full text-xs bg-primary text-primary-foreground">
                    {customer.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
