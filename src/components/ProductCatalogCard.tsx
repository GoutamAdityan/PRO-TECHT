import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ProductCatalogCardProps {
  product: {
    id: string;
    name: string;
    modelNumber: string;
    warrantyLength: string;
    description: string;
    imageUrl?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export const ProductCatalogCard = ({ product, onEdit, onDelete, delay = 0 }: ProductCatalogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2), 0 0 30px rgba(34,197,94,0.15)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="h-full cursor-pointer rounded-2xl transition-all duration-300 ease-out"
    >
      <Card variant="consumer" className="h-full flex flex-col">
        <div className="relative w-full h-40 rounded-t-2xl overflow-hidden mb-4">
          <img 
            src={product.imageUrl || 'https://placehold.co/600x400/0f1713/DBE9E0?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-emerald-400" />
            <CardTitle className="text-lg font-medium text-foreground/90">{product.name}</CardTitle>
          </div>
          <div className="text-xs text-muted-foreground">{product.modelNumber}</div>
        </CardHeader>
        <CardContent className="flex-grow p-6 pb-0">
          <p className="text-sm text-foreground/70 line-clamp-2">{product.description}</p>
        </CardContent>
        <div className="p-6 pt-4 flex items-center justify-between">
          <div className="text-base font-bold text-foreground">{product.warrantyLength}</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={() => onEdit(product.id)} aria-label="Edit product">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onDelete(product.id)} aria-label="Delete product">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};