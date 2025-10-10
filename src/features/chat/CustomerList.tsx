// src/features/chat/CustomerList.tsx
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChatState } from './useChat'; // Import ChatState interface

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
    <div className="flex h-full flex-col">
      <div className="p-3 border-b">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredCustomers.length === 0 && (
          <div className="text-center text-muted-foreground">No customers found.</div>
        )}
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors relative",
              selectedCustomer?.id === customer.id && "bg-accent text-accent-foreground ring-2 ring-primary"
            )}
            onClick={() => selectCustomer(customer.id)}
          >
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {customer.isOnline && (
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background" />
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
                  <Badge className="ml-2 px-2 py-0.5 rounded-full text-xs">
                    {customer.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};