import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Uploader } from '@/components/ui/Uploader';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Save, Image as ImageIcon, X } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  model_number: z.string().min(1, { message: "Model number is required." }),
  warranty_value: z.string().min(1, { message: "Warranty duration is required." }),
  warranty_unit: z.string().min(1, { message: "Warranty unit is required." }),
  description: z.string().optional(),
  image_file: z.any().optional(), // For new image upload
  existing_image_url: z.string().optional().nullable(), // To display existing image
});

interface CatalogProduct {
  id: string;
  name: string;
  model_number: string;
  warranty: string;
  description: string;
  image_url?: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: CatalogProduct | null;
  onProductUpdated: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ isOpen, onClose, product, onProductUpdated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model_number: '',
      warranty_value: '',
      warranty_unit: 'years',
      description: '',
      existing_image_url: null,
    },
  });

  // Pre-fill form when product prop changes
  useEffect(() => {
    if (product) {
      console.log("Editing product:", product);
      const [warrantyValue, warrantyUnit] = product.warranty.split(' ');
      console.log("Parsed warranty:", { warrantyValue, warrantyUnit });
      form.reset({
        name: product.name,
        model_number: product.model_number,
        warranty_value: warrantyValue || '',
        warranty_unit: warrantyUnit || 'years',
        description: product.description,
        existing_image_url: product.image_url,
        image_file: undefined, // Clear any previous file selection
      });
    }
  }, [product, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !product) {
      toast({ title: "Error", description: "User not logged in or no product selected.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = values.existing_image_url || null;

    try {
      // 1. Upload new image if provided
      if (values.image_file) {
        const file = values.image_file;
        const filePath = `${user.id}/catalog/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('catalog_product_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('catalog_product_images')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
      }

      // 2. Update product data in catalog_products table
      const { error: updateError } = await supabase.from('catalog_products').update({
        name: values.name,
        model_number: values.model_number,
        warranty: `${values.warranty_value} ${values.warranty_unit}`,
        description: values.description,
        image_url: imageUrl,
      })
      .eq('id', product.id)
      .eq('business_partner_id', user.id);

      if (updateError) throw updateError;

      toast({ title: "Success", description: "Product updated successfully." });
      form.reset();
      onProductUpdated();
      onClose();
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({ title: "Error", description: error.message || "Failed to update product.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const warrantyValues = Array.from({ length: form.watch('warranty_unit') === 'years' ? 5 : 24 }, (_, i) => String(i + 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-foreground rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Catalog Product</DialogTitle>
          <DialogDescription>Modify the details for this product in your catalog.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Laptop Pro X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., LPX-2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="warranty_value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Warranty Duration</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warrantyValues.map(val => (
                          <SelectItem key={val} value={val}>{val}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warranty_unit"
                render={({ field }) => (
                  <FormItem className="w-[100px]">
                    <FormLabel className="sr-only">Warranty Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="years">Years</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., High-performance laptop with 16GB RAM..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Product Image (Optional)</FormLabel>
                  <FormControl>
                    <Uploader
                      onFilesChange={(files) => field.onChange(files[0])}
                      maxFiles={1}
                      accept={{ 'image/*': ['.jpeg', '.png', '.gif'] }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('existing_image_url') && !form.watch('image_file') && (
              <div className="relative w-32 h-32 rounded-md overflow-hidden border border-border">
                <img src={form.watch('existing_image_url')!} alt="Existing Product" className="w-full h-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                  onClick={() => form.setValue('existing_image_url', null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating Product...' : <><Save className="mr-2 h-4 w-4" /> Update Product</>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
