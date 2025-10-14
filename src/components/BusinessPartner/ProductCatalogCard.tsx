import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCatalogCardProps {
  count: number;
}

export const ProductCatalogCard = ({ count }: ProductCatalogCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Product Listings</CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">products in your catalog</p>
          <Button asChild className="mt-4">
            <Link to="/product-catalog">Open Catalog</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
