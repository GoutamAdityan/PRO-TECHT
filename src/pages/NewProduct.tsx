import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Plus, Calendar, DollarSign, ReceiptText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { parseReceipt } from '@/utils/receiptParser';

const NewProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [type, setType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [warrantyMonths, setWarrantyMonths] = useState('');
  const [retailer, setRetailer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [highlightedFields, setHighlightedFields] = useState<string[]>([]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
        const extractedData = await parseReceipt(file);
        const newHighlightedFields: string[] = [];

        if (extractedData.type) {
          setType(extractedData.type);
          newHighlightedFields.push('type');
        }
        if (extractedData.brand) {
          setBrand(extractedData.brand);
          newHighlightedFields.push('brand');
        }
        if (extractedData.model) {
          setModel(extractedData.model);
          newHighlightedFields.push('model');
        }
        if (extractedData.purchasePrice) {
          setPurchasePrice(extractedData.purchasePrice);
          newHighlightedFields.push('purchasePrice');
        }
        if (extractedData.purchaseDate) {
          setPurchaseDate(extractedData.purchaseDate);
          newHighlightedFields.push('purchaseDate');
        }
        if (extractedData.retailer) {
          setRetailer(extractedData.retailer);
          newHighlightedFields.push('retailer');
        }
        if (extractedData.serialNumber) {
          setSerialNumber(extractedData.serialNumber);
          newHighlightedFields.push('serialNumber');
        }

        setHighlightedFields(newHighlightedFields);
        setTimeout(() => setHighlightedFields([]), 1500);

        toast({ title: "Success", description: "Bill data extracted successfully!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to extract data from the bill.", variant: "destructive" });
      } finally {
        setIsProcessing(false);
        setIsModalOpen(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a product.", variant: "destructive" });
      return;
    }

    if (!type || !brand || !model || !serialNumber || !purchaseDate) {
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
        type,
        brand,
        model,
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
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Scan Bill
                </span>
              </div>
            </div>
            <div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" type="button">
                  <ReceiptText className="h-4 w-4 mr-2" />
                  Scan or Upload Bill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Scan or Upload Bill</DialogTitle>
                </DialogHeader>
                <div className="p-4">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isProcessing}>
                    {isProcessing ? 'Analyzing your bill...' : 'Upload Image'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            </div>

            <div className={highlightedFields.includes('type') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
              <Label htmlFor="type">Product Type</Label>
              <Input
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                placeholder="e.g., Smartphone"
              />
            </div>

            <div className={highlightedFields.includes('brand') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                placeholder="e.g., Acme"
              />
            </div>

            <div className={highlightedFields.includes('model') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                placeholder="e.g., Z1"
              />
            </div>

            <div className={highlightedFields.includes('serialNumber') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
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

            <div className={highlightedFields.includes('purchaseDate') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
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
              <div className={highlightedFields.includes('purchasePrice') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
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

            <div className={highlightedFields.includes('retailer') ? 'rounded-md ring-2 ring-offset-2 ring-green-500 transition-all duration-300' : ''}>
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