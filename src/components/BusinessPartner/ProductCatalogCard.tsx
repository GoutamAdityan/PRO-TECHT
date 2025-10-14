import { AppCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCatalogCardProps {
  count: number;
}

export const ProductCatalogCard = ({ count }: ProductCatalogCardProps) => {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <AppCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-muted-text">Product Listings</CardTitle>
          <Book className="h-4 w-4 text-muted-text" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text-main">{count}</div>
          <p className="text-xs text-muted-text">products in your catalog</p>
          <Button asChild variant="primary" size="pill" className="mt-4">
            <Link to="/product-catalog">Open Catalog</Link>
          </Button>
        </CardContent>
      </AppCard>
    </motion.div>
  );
};
