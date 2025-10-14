
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Users } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ProductCatalogCard as ProductGridCard } from "@/components/ProductCatalogCard";
import Header from '@/components/ConsumerDashboard/Header';

// TypeScript Types
type Product = {
  id: string;
  name: string;
  modelNumber: string;
  warrantyLength: string;
  description: string;
};

// Dummy Data
const dummyProducts: Product[] = [
  {
    id: "PROD001",
    name: "Laptop Pro X",
    modelNumber: "LPX-2025",
    warrantyLength: "2 years",
    description: "High-performance laptop for professionals.",
  },
  {
    id: "PROD002",
    name: "Smartphone Z",
    modelNumber: "SPZ-2025",
    warrantyLength: "1 year",
    description: "Latest generation smartphone with AI features.",
  },
  {
    id: "PROD003",
    name: "Wireless Headphones",
    modelNumber: "WH-1000",
    warrantyLength: "18 months",
    description: "Noise-cancelling over-ear headphones.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);
  const shouldReduceMotion = useReducedMotion();

  const handleEdit = (id: string) => {
    console.log("Edit product", id);
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    console.log("Delete product", id);
    // Implement delete logic
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-6 text-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
        >
          <Users className="w-5 h-5 text-emerald-400" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Product Catalog</h1>
      </div>
      <Header
        userName="Partner"
        subtitle="Manage your product listings and their details."
      />

      <div className="flex justify-between items-center mb-6">
        <Button variant="primary" size="pill">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div key={product.id} variants={itemVariants} exit="exit">
              <ProductGridCard product={product} onEdit={handleEdit} onDelete={handleDelete} delay={index * 0.1} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Responsive Table View for larger screens - hidden by default, shown on larger breakpoints */}
      <div className="hidden md:block mb-8">
        <Card variant="consumer">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground/90">All Products</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model Number</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr key={product.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit" whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }} transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.modelNumber}</TableCell>
                      <TableCell>{product.warrantyLength}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(product.id)} aria-label="Edit product">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(product.id)} aria-label="Delete product">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProductCatalog;
