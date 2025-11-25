import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Calendar, ShieldCheck, ShieldX, HandCoins, Search, Filter, ArrowRight, Box, Grid3x3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/input';
import ProductVault3D from '@/components/3d/ProductVault3D';

interface Product {
  id: string;
  type: string;
  brand: string;
  model: string;
  serial_number?: string;
  purchase_date: string;
  purchase_price?: number;
  warranty_months?: number;
  warranty_expiry?: string;
  notes?: string;
  product_image_url?: string;
  retailer?: string;
}

const Products = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | '3d'>('grid');

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: 'Error',
          description: 'Failed to load products',
          variant: 'destructive',
        });
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const isWarrantyExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isWarrantyExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiry > today && expiry <= thirtyDaysFromNow;
  };

  const filteredProducts = products.filter(product =>
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // If 3D mode is active and there are products, show 3D vault
  if (viewMode === '3d' && !loading && filteredProducts.length > 0) {
    return <ProductVault3D products={filteredProducts} />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-emerald-500">
            Product Vault
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground text-lg">
            Manage your tech ecosystem and warranty status.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 bg-card border-border focus:border-emerald-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 border border-border rounded-full p-1 bg-card/50">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`rounded-full ${viewMode === 'grid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === '3d' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('3d')}
              className={`rounded-full ${viewMode === '3d' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
            >
              <Box className="w-4 h-4 mr-2" />
              3D Vault
            </Button>
          </div>

          <Button onClick={() => navigate('/products/new')} className="btn-neon rounded-full px-6 whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" /> Add Product
          </Button>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="p-6 rounded-full bg-emerald-500/10 mb-6 animate-pulse-glow">
              <Package className="w-16 h-16 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Products Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {searchTerm ? "No products match your search criteria." : "Start by adding your first product to track warranties and service history."}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/products/new')} className="btn-neon rounded-full px-8 py-6 text-lg">
                <Plus className="w-6 h-6 mr-2" /> Register First Product
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="product-list"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {filteredProducts.map((product) => (
              <AnimatedCard
                key={product.id}
                layoutId={`product-card-${product.id}`}
                hoverEffect="lift"
                className="h-full flex flex-col justify-between group border-border hover:border-emerald-500/30 transition-colors"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border group-hover:border-emerald-500/50 transition-colors">
                      <Package className="w-6 h-6 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    </div>
                    {product.warranty_expiry && (
                      isWarrantyExpired(product.warranty_expiry) ? (
                        <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20">Expired</Badge>
                      ) : isWarrantyExpiringSoon(product.warranty_expiry) ? (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">Expiring Soon</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">Active</Badge>
                      )
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">{product.brand} {product.model}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{product.type}</p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-500/70" />
                      <span>Purchased: {new Date(product.purchase_date).toLocaleDateString()}</span>
                    </div>
                    {product.warranty_expiry && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
                        <span>Expires: {new Date(product.warranty_expiry).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">View Details</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;
