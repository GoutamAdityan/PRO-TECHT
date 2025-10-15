import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const CatalogPreviewCard = () => {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <Card variant="app">
        <CardHeader>
          <CardTitle className="text-foreground">Catalog Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for catalog preview */}
          <div className="text-muted-foreground">No products in catalog.</div>
          <Button asChild variant="primary" size="pill" className="mt-4">
            <Link to="/product-catalog">View Catalog</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
