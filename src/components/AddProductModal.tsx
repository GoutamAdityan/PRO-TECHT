import React, { useState } from 'react';
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
import { useSound } from '@/context/SoundContext';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  model_number: z.string().min(1, { message: "Model number is required." }),
  warranty_value: z.string().min(1, { message: "Warranty duration is required." }),
  warranty_unit: z.string().min(1, { message: "Warranty unit is required." }),
  description: z.string().optional(),
  image_file: z.any().optional(),
});

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onProductAdded }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { playSuccessSound } = useSound();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      model_number: '',
      warranty_value: '',
      warranty_unit: 'years',
      description: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to add a product.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    let imageUrl: string | null = null;

    try {
      // 1. Upload image if provided
      if (values.image_file) {
        console.log("Attempting image upload...");
        const file = values.image_file;
        const filePath = `${user.id}/catalog/${Date.now()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from('catalog_product_images')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Supabase image upload error:", uploadError);
          toast({ title: "Upload Error", description: uploadError.message, variant: "destructive" });
          throw uploadError; // Re-throw to stop further execution
        }

        const { data: urlData } = supabase.storage
          .from('catalog_product_images')
          .getPublicUrl(filePath);
        imageUrl = urlData.publicUrl;
        console.log("Image uploaded successfully. URL:", imageUrl);
      }

      // 2. Insert product data into catalog_products table
      console.log("Attempting product insertion...");
      const { error: insertError } = await supabase.from('catalog_products').insert({
        business_partner_id: user.id,
        name: values.name,
        model_number: values.model_number,
        warranty: `${values.warranty_value} ${values.warranty_unit}`,
        description: values.description,
        image_url: imageUrl,
      });

      if (insertError) {
        console.error("Supabase product insert error:", insertError);
        toast({ title: "Database Error", description: insertError.message, variant: "destructive" });
        throw insertError; // Re-throw to stop further execution
      }

      toast({ title: "Success", description: "Product added to catalog successfully." });
      playSuccessSound();
      form.reset();
      onProductAdded();
      onClose();
    } catch (error: any) {
      console.error("Caught error in onSubmit:", error);
      toast({ title: "Error", description: error.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const warrantyValues = Array.from({ length: form.watch('warranty_unit') === 'years' ? 5 : 24 }, (_, i) => String(i + 1));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-foreground rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Catalog Product</DialogTitle>
          <DialogDescription>Fill in the details for the new product to add to your catalog.</DialogDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Product...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add Product</>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
