import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Book } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ProductCatalogCard as ProductGridCard } from "@/components/ProductCatalogCard";
import Header from '@/components/ConsumerDashboard/Header';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// TypeScript Types
interface CatalogProduct {
  id: string;
  name: string;
  model_number: string;
  warranty: string;
  description: string;
  image_url?: string;
}

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  const fetchCatalogProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('catalog_products')
        .select('id, name, model_number, warranty, description, image_url')
        .eq('business_partner_id', user.id);

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to fetch products.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogProducts();
  }, [user]);

  const handleEdit = (product: CatalogProduct) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const confirmDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const executeDelete = async () => {
    if (!user || !productToDelete) return;

    try {
      const { error } = await supabase.from('catalog_products').delete().eq('id', productToDelete).eq('business_partner_id', user.id);
      if (error) throw error;

      setProducts(products.filter(p => p.id !== productToDelete));
      toast({ title: "Success", description: "Product deleted successfully." });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({ title: "Error", description: error.message || "Failed to delete product.", variant: "destructive" });
    } finally {
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
    }
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
          <Book className="w-5 h-5 text-emerald-400" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Product Catalog</h1>
      </div>
      <Header
        userName="Partner"
        subtitle="Manage your product listings and their details."
      />

      <div className="flex justify-between items-center mb-6">
        <Button variant="primary" size="pill" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No products in your catalog. Add your first one!</p>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div key={product.id} variants={itemVariants} exit="exit">
                <ProductGridCard 
                  product={{
                    id: product.id,
                    name: product.name,
                    modelNumber: product.model_number,
                    warrantyLength: product.warranty,
                    description: product.description,
                    imageUrl: product.image_url,
                  }}
                  onEdit={() => handleEdit(product)} 
                  onDelete={confirmDelete} 
                  delay={index * 0.1} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

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
                      <TableCell>{product.model_number}</TableCell>
                      <TableCell>{product.warranty}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(product)} aria-label="Edit product">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => confirmDelete(product.id)} aria-label="Delete product">
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

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onProductAdded={fetchCatalogProducts} 
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onProductUpdated={fetchCatalogProducts}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-card text-foreground rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your product 
              from the catalog and remove its associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default ProductCatalog;