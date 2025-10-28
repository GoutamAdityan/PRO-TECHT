import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Calendar, DollarSign, ShieldCheck, ShieldX, HandCoins } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ProductSkeleton from '@/components/ProductSkeleton'; // New import

const MotionButton = motion(Button);

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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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

  const globalEasing = [0.22, 0.9, 0.32, 1]; // Keep custom easing for other animations

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 }, // More dramatic slide-in
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07, // Match dashboard
        delayChildren: 0.2,    // Match dashboard
        ease: "easeOut",       // Match dashboard
      },
    },
  };

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0, filter: shouldReduceMotion ? 'none' : 'blur(8px)' }, // Add blur-in
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } }, // Increased blur-in duration
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -30, filter: shouldReduceMotion ? 'none' : 'blur(10px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } }} // Increased exit duration and blur
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-10 text-white" // Centered with max-width and generous padding
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-bold leading-tight mb-2">Product Vault</h1> {/* H1 36-48px */}
        </motion.div>
        <motion.div variants={itemVariants}>
          <p className="text-lg text-gray-400 leading-relaxed">
            Manage your products, warranties, and documentation with ease.
          </p>
        </motion.div>
        </div>
        <MotionButton
          asChild
          className="h-12 px-6 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-medium shadow-lg
                     hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out
                     focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.06, boxShadow: shouldReduceMotion ? 'none' : '0 0 20px rgba(34, 197, 94, 0.7)' }} // More prominent hover
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link to="/products/new">
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Link>
        </MotionButton>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <ProductSkeleton key="skeleton" />
        ) : products.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center"
          >
            <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-8 shadow-xl max-w-md w-full">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  <HandCoins className="w-20 h-20 mx-auto text-green-500 mb-6" /> {/* Micro-illustration icon */}
                </motion.div>
                <CardTitle className="text-2xl font-bold mb-3 leading-normal">
                  No Products Registered Yet
                </CardTitle>
                <CardDescription className="text-base text-gray-400 mb-8 leading-relaxed">
                  Start by adding your first product to track warranties and service history.
                </CardDescription>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, scaleX: [1, 1.05, 1] }} // Pulse once animation
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} // Longer duration for pulse
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative"
                >
                  <MotionButton
                    asChild
                    className="h-12 px-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-medium shadow-lg
                               hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out
                               focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <Link to="/products/new">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Product
                    </Link>
                  </MotionButton>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="product-list"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -10, // More lift
                  boxShadow: shouldReduceMotion ? 'none' : '0 20px 40px rgba(0,0,0,0.5)', // More prominent shadow
                  scale: shouldReduceMotion ? 1 : 1.03, // More scale
                  rotateZ: shouldReduceMotion ? 0 : 1, // Slight tilt
                  transition: { duration: 0.2, ease: "easeOut" }, // short 200ms
                }}
                className="relative"
              >
                <Card className="bg-card backdrop-blur-sm border border-border rounded-2xl p-5 h-full flex flex-col justify-between">
                  <CardHeader className="pb-3 px-0 pt-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold leading-normal">{product.brand} {product.model}</CardTitle> {/* H2 20-24px */}
                        <CardDescription className="text-base text-muted-foreground leading-relaxed">{product.type}</CardDescription>
                      </div>
                      {product.warranty_expiry && (
                        <div className="flex items-center">
                          {isWarrantyExpired(product.warranty_expiry) ? (
                            <Badge variant="destructive" className="badge-destructive">
                              <ShieldX className="w-3 h-3" />
                              Expired
                            </Badge>
                          ) : isWarrantyExpiringSoon(product.warranty_expiry) ? (
                            <Badge variant="outline" className="badge-warning">
                              <ShieldCheck className="w-3 h-3" />
                              Expiring Soon
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="badge-success">
                              <ShieldCheck className="w-3 h-3" />
                              Active
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-0 pb-0">
                    {product.serial_number && (
                      <div className="text-base">
                        <span className="text-gray-400">Serial:</span>{' '}
                        <span className="font-mono text-foreground">{product.serial_number}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-base text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-green-400" />
                        {new Date(product.purchase_date).toLocaleDateString()}
                      </div>
                      {product.purchase_price && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">₹</span>
                          <span className="font-bold">{product.purchase_price}</span>
                        </div>
                      )}
                    </div>

                    {product.warranty_expiry && (
                      <div className="text-base">
                        <span className="text-gray-400">Warranty expires:</span>{' '}
                        <span className={isWarrantyExpired(product.warranty_expiry) ? 'text-red-400' : 'text-green-400'}>
                          {new Date(product.warranty_expiry).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {product.retailer && (
                      <div className="text-base">
                        <span className="text-gray-400">Purchased from:</span>{' '}
                        <span className="text-gray-200">{product.retailer}</span>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="btn-subtle"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <Link to={`/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Products;
