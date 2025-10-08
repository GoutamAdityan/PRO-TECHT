import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Package, Calendar, DollarSign, ShieldCheck, ShieldX, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
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
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [products, searchTerm]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            Product Vault
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your products, warranties, and documentation
          </p>
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by brand, model, or serial number..."
            className="pl-10 w-full max-w-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Products Found</CardTitle>
            <CardDescription className="mb-6">
              {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first product to track warranties and service history'}
            </CardDescription>
            {!searchTerm && (
              <Button asChild>
                <Link to="/products/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{product.brand}</CardTitle>
                    <CardDescription>{product.model}</CardDescription>
                  </div>
                  {product.warranty_expiry && (
                    <div className="flex items-center">
                      {isWarrantyExpired(product.warranty_expiry) ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <ShieldX className="w-3 h-3" />
                          Expired
                        </Badge>
                      ) : isWarrantyExpiringSoon(product.warranty_expiry) ? (
                        <Badge variant="outline" className="flex items-center gap-1 border-warning text-warning">
                          <ShieldCheck className="w-3 h-3" />
                          Expiring Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 border-success text-success">
                          <ShieldCheck className="w-3 h-3" />
                          Active
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.serial_number && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Serial:</span>{' '}
                    <span className="font-mono">{product.serial_number}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(product.purchase_date).toLocaleDateString()}
                  </div>
                  {product.purchase_price && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      ${product.purchase_price}
                    </div>
                  )}
                </div>

                {product.warranty_expiry && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Warranty expires:</span>{' '}
                    <span className={isWarrantyExpired(product.warranty_expiry) ? 'text-destructive' : 'text-foreground'}>
                      {new Date(product.warranty_expiry).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {product.retailer && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Purchased from:</span>{' '}
                    <span>{product.retailer}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/products/${product.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;