import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ChatProductCardProps {
  product: {
    id: string;
    brand: string;
    model: string;
    serial_number: string;
    // Add other product properties as needed
  };
}

export const ChatProductCard = ({ product }: ChatProductCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      className="h-full rounded-lg"
    >
      <Link to={`/products/${product.id}`} className="block h-full">
        <Card className="h-full flex flex-col justify-center transition-colors border-border/50 hover:border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle className="text-md font-semibold">{product.brand} {product.model}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Serial: {product.serial_number}</p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};