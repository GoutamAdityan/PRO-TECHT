import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const CatalogPreviewCard = () => {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <Card variant="app">
        <CardHeader>
          <CardTitle>Catalog Preview</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for catalog preview */}
          <div className="text-muted-text">No products in catalog.</div>
          <Button variant="primary" size="pill" className="mt-4">View Catalog</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
