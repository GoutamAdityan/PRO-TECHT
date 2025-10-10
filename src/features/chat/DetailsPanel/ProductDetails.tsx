// src/features/chat/DetailsPanel/ProductDetails.tsx
import React from 'react';
import { Product } from './mockDetailsAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText, Image, CalendarDays, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const getWarrantyBadgeVariant = (status: Product['warrantyStatus']) => {
    switch (status) {
      case 'Active':
        return 'default'; // Primary green
      case 'Expired':
        return 'destructive';
      case 'Pending':
        return 'secondary'; // Warm neutral
      default:
        return 'outline';
    }
  };

  return (
    <Card className="mb-4 bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide font-heading">Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} className="w-20 h-20 rounded-md object-cover border border-border/50 shadow-sm" />
          )}
          <div>
            <h3 className="font-semibold text-lg font-heading">{product.name}</h3>
            <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
            <p className="text-sm text-muted-foreground">Model: {product.model}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Purchase Date:</span>
            <span>{product.purchaseDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Warranty Status:</span>
            <Badge variant={getWarrantyBadgeVariant(product.warrantyStatus)} className={cn("shadow-sm", product.warrantyStatus === 'Active' && "bg-primary text-primary-foreground")}>{product.warrantyStatus}</Badge>
          </div>
          {product.warrantyStatus === 'Active' && (
            <div className="flex flex-col col-span-2">
              <span className="text-muted-foreground">Warranty End Date:</span>
              <span>{product.warrantyEndDate}</span>
            </div>
          )}
        </div>

        {product.attachments && product.attachments.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-sm mb-2 font-heading">Attachments:</h4>
            <div className="space-y-2">
              {product.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
                >
                  {attachment.type === 'manual' && <FileText className="h-4 w-4" />}
                  {attachment.type === 'photo' && <Image className="h-4 w-4" />}
                  {attachment.type === 'document' && <FileText className="h-4 w-4" />}
                  {attachment.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          <Button variant="outline" size="sm" className="hover:bg-accent/10 hover:text-accent-foreground border-border/50">
            <Ticket className="h-4 w-4 mr-2" /> Create Ticket
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-accent/10 hover:text-accent-foreground border-border/50">
            <CalendarDays className="h-4 w-4 mr-2" /> Schedule Pickup
          </Button>
          {/* <Button variant="outline" size="sm">Upload Photo</Button> */}
        </div>
      </CardContent>
    </Card>
  );
};