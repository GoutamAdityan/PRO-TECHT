import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const QuickActionsRow = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div whileHover={{ scale: 1.02, y: -5 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add New Product</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Add a new product to your catalog</p>
            <Button asChild className="mt-4">
              <Link to="/product-catalog/new">Add Product</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
