import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  brand: string;
  model: string;
  product_image_url?: string;
}

interface ProductSelectorCardProps {
  products: Product[];
  selectedProductId: string | null;
  onSelectProduct: (productId: string) => void;
}

export const ProductSelectorCard = ({ products, selectedProductId, onSelectProduct }: ProductSelectorCardProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => {
        const isSelected = product.id === selectedProductId;
        return (
          <motion.div
            key={product.id}
            onClick={() => onSelectProduct(product.id)}
            className={cn(
              'relative rounded-lg border-2 cursor-pointer transition-all duration-300',
              isSelected ? 'border-green-500 shadow-2xl' : 'border-transparent hover:border-green-500/50'
            )}
            whileHover={{ scale: 1.03 }}
            animate={{ scale: isSelected ? 1.05 : 1 }}
          >
            {isSelected && (
              <motion.div
                className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <CheckCircle className="h-4 w-4 text-white" />
              </motion.div>
            )}
            <Card className="overflow-hidden bg-card">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.product_image_url || 'https://placehold.co/600x400/0f1713/DBE9E0?text=No+Image'}
                  alt={`${product.brand} ${product.model}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground">{product.brand}</h3>
                <p className="text-sm text-muted-foreground">{product.model}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};
