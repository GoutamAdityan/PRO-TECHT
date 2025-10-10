import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ProductSelector } from '@/components/ui/ProductSelector';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, ReceiptText } from 'lucide-react';

interface SelectedProduct {
  type: string;
  brand: string;
  model: string;
}

const NewProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [retailer, setRetailer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a product.", variant: "destructive" });
      return;
    }

    if (!selectedProduct || !selectedProduct.type || !selectedProduct.brand || !selectedProduct.model || !serialNumber || !purchaseDate) {
      toast({ title: "Error", description: "Please ensure product type, brand, model, serial number, and purchase date are all filled.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const warrantyExpiryDate = warrantyMonths
        ? new Date(new Date(purchaseDate).setMonth(new Date(purchaseDate).getMonth() + parseInt(warrantyMonths)))
            .toISOString().split('T')[0]
        : null;

      const { error } = await supabase.from('products').insert({
        user_id: user.id,
        type: selectedProduct.type,
        brand: selectedProduct.brand,
        model: selectedProduct.model,
        serial_number: serialNumber,
        purchase_date: purchaseDate,
        purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
        warranty_months: warrantyMonths ? parseInt(warrantyMonths) : null,
        warranty_expiry: warrantyExpiryDate,
        retailer: retailer || null,
      });

      if (error) {
        throw error;
      }

      toast({ title: "Success", description: "Product added successfully!" });
      navigate('/products');
    } catch (error: any) {
      console.error('Error adding product:', error.message);
      let errorMessage = `Failed to add product: ${error.message}`;
      if (error.message.includes("Could not find the 'type' column") || error.message.includes("schema cache")) {
        errorMessage = "We couldn't save this product because the system schema is missing a required field (type). Please try again or contact support.";
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <h1 className="text-3xl font-bold font-heading">Add New Product</h1>

      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="font-heading">Product Details</CardTitle>
          <CardDescription>Enter the details of your new product.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Product Type, Brand, Model</Label>
              <ProductSelector onProductSelect={setSelectedProduct} className="mt-1" />
              {!selectedProduct?.type && <p className="text-xs text-destructive mt-1">Product type, brand, and model are required.</p>}
            </div>

            <div>
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                placeholder="Enter serial number"
              />
              {!serialNumber && <p className="text-xs text-destructive mt-1">Serial number is required.</p>}
            </div>

            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
              />
              {!purchaseDate && <p className="text-xs text-destructive mt-1">Purchase date is required.</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="purchasePrice">Purchase Price</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                  placeholder="e.g., 499.99"
                />
              </div>
              <div>
                <Label htmlFor="warrantyMonths">Warranty (Months)</Label>
                <Input
                  id="warrantyMonths"
                  type="number"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(e.target.value)}
                  className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                  placeholder="e.g., 12"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="retailer">Retailer</Label>
              <Input
                id="retailer"
                value={retailer}
                onChange={(e) => setRetailer(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                placeholder="e.g., Amazon"
              />
            </div>

            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? 'Adding Product...' : (
                <>
                  <Plus className="h-4 w-4 mr-2" /> Add Product
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewProduct;