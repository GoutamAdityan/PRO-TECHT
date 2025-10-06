import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, ShieldCheck, ShieldX, Trash, Edit } from "lucide-react";

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

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      const fetchProduct = async () => {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching product:", error);
            toast({
              title: "Error",
              description: "Failed to load product details",
              variant: "destructive",
            });
            navigate("/products");
          } else {
            setProduct(data);
          }
        } catch (error) {
          console.error("Error:", error);
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [user, id, toast, navigate]);

  const handleDelete = async () => {
    if (!product) return;

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Product deleted",
        description: "The product has been removed from your vault.",
      });
      navigate("/products");
    }
  };

  const isWarrantyExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{product.brand} {product.model}</CardTitle>
            {product.serial_number && <CardDescription>Serial: {product.serial_number}</CardDescription>}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" asChild>
                <Link to={`/products/${product.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your product
                    and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {product.warranty_expiry && (
            <div className="flex items-center">
                {isWarrantyExpired(product.warranty_expiry) ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                    <ShieldX className="w-3 h-3" />
                    Expired
                </Badge>
                ) : (
                <Badge variant="outline" className="flex items-center gap-1 border-success text-success">
                    <ShieldCheck className="w-3 h-3" />
                    Active
                </Badge>
                )}
            </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Purchased on {new Date(product.purchase_date).toLocaleDateString()}
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
        {product.notes && (
            <div className="text-sm">
                <span className="text-muted-foreground">Notes:</span>{' '}
                <span>{product.notes}</span>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductDetails;