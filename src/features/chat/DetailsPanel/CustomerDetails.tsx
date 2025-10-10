
// src/features/chat/DetailsPanel/CustomerDetails.tsx
import React from 'react';
import { CustomerDetails as CustomerDetailsType } from './mockDetailsAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User, MapPin } from 'lucide-react';

interface CustomerDetailsProps {
  customer: CustomerDetailsType;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({ customer }) => {
  const getVerificationBadgeVariant = (status: CustomerDetailsType['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Unverified':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Customer Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.avatarUrl} alt={customer.fullName} />
            <AvatarFallback>{customer.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{customer.fullName}</h3>
            <Badge variant={getVerificationBadgeVariant(customer.verificationStatus)}>{customer.verificationStatus}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-2 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
              {customer.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
              {customer.phone}
            </a>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
            <span>{customer.address}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Account Created:</span>
            <span>{customer.accountCreated}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Subscription Plan:</span>
            <span>{customer.subscriptionPlan}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Loyalty Points:</span>
            <span>{customer.loyaltyPoints}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Last Order:</span>
            <span>{customer.lastOrderDate}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" /> Call
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" /> Email
          </Button>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" /> View Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
