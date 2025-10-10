import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Assuming products.json is structured like this
interface ProductData {
  type: string;
  brand: string;
  models: string[];
}

// Mock data adapter for products.json
const fetchProductData = async (): Promise<ProductData[]> => {
  // In a real app, this would be an API call
  const productsJson = await import('@/data/products.json');
  return productsJson.default;
};

interface ProductSelectorProps {
  onProductSelect: (product: { type: string; brand: string; model: string } | null) => void;
  initialProduct?: { type: string; brand: string; model: string };
  className?: string;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  onProductSelect,
  initialProduct,
  className,
}) => {
  const [allProducts, setAllProducts] = useState<ProductData[]>([]);
  const [selectedType, setSelectedType] = useState<string>(initialProduct?.type || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialProduct?.brand || '');
  const [selectedModel, setSelectedModel] = useState<string>(initialProduct?.model || '');
  const [customModel, setCustomModel] = useState('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  useEffect(() => {
    fetchProductData().then(setAllProducts);
  }, []);

  useEffect(() => {
    if (selectedType && selectedBrand && selectedModel) {
      onProductSelect({ type: selectedType, brand: selectedBrand, model: selectedModel });
    } else {
      onProductSelect(null);
    }
  }, [selectedType, selectedBrand, selectedModel, onProductSelect]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    allProducts.forEach((p) => types.add(p.type));
    return Array.from(types);
  }, [allProducts]);

  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    allProducts.filter((p) => p.type === selectedType).forEach((p) => brands.add(p.brand));
    return Array.from(brands);
  }, [allProducts, selectedType]);

  const availableModels = useMemo(() => {
    const models = new Set<string>();
    allProducts
      .filter((p) => p.type === selectedType && p.brand === selectedBrand)
      .forEach((p) => p.models.forEach((m) => models.add(m)));
    return Array.from(models);
  }, [allProducts, selectedType, selectedBrand]);

  const handleCustomModelSubmit = () => {
    if (customModel.trim()) {
      onProductSelect({ type: selectedType, brand: selectedBrand, model: customModel.trim() });
      setSelectedModel(customModel.trim());
      setIsCustomModalOpen(false);
      setCustomModel('');
    }
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {/* Type Selector */}
      <div className="space-y-2">
        <Label htmlFor="product-type">Type</Label>
        <Select value={selectedType} onValueChange={(value) => {
          setSelectedType(value);
          setSelectedBrand('');
          setSelectedModel('');
        }}>
          <SelectTrigger id="product-type" className="bg-background/50 border-border/50 focus-visible:ring-primary">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
            {availableTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand Selector */}
      <div className="space-y-2">
        <Label htmlFor="product-brand">Brand</Label>
        <Select value={selectedBrand} onValueChange={(value) => {
          setSelectedBrand(value);
          setSelectedModel('');
        }} disabled={!selectedType}>
          <SelectTrigger id="product-brand" className="bg-background/50 border-border/50 focus-visible:ring-primary">
            <SelectValue placeholder="Select Brand" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
            {availableBrands.map((brand) => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model Selector with Custom Fallback */}
      <div className="space-y-2">
        <Label htmlFor="product-model">Model</Label>
        <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
          <SelectTrigger id="product-model" className="bg-background/50 border-border/50 focus-visible:ring-primary">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
            {availableModels.map((model) => (
              <SelectItem key={model} value={model}>{model}</SelectItem>
            ))}
            <Dialog open={isCustomModalOpen} onOpenChange={setIsCustomModalOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-primary hover:bg-accent/10 hover:text-accent-foreground">
                  + Add custom model...
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card/90 backdrop-blur-sm shadow-lg border border-border/50">
                <DialogHeader>
                  <DialogTitle className="font-heading">Add Custom Model</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="custom-model" className="text-right">Model Name</Label>
                    <Input
                      id="custom-model"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      className="col-span-3 bg-background/50 border-border/50 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCustomModalOpen(false)} className="hover:bg-accent/10 hover:text-accent-foreground border-border/50">Cancel</Button>
                  <Button onClick={handleCustomModelSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">Add Model</Button>
                </div>
              </DialogContent>
            </Dialog>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
