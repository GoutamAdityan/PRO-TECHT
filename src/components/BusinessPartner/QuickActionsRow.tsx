import { AppCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const QuickActionsRow = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
        <AppCard>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium text-muted-text">Add New Product</CardTitle>
            <Plus className="h-4 w-4 text-muted-text" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-text">Add a new product to your catalog</p>
            <Button asChild variant="primary" size="pill" className="mt-4">
              <Link to="/product-catalog/new">Add Product</Link>
            </Button>
          </CardContent>
        </AppCard>
      </motion.div>
    </div>
  );
};
