import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ProductSelector } from '@/components/ui/ProductSelector';
import { motion } from 'framer-motion';
import { mockRealtimeAdapter } from '@/lib/realtime/mockAdapter';
import { Send } from 'lucide-react';

interface SelectedProduct {
  type: string;
  brand: string;
  model: string;
}

const serviceRequestSchema = z.object({
  product_type: z.string().min(1, "Product type is required"),
  product_brand: z.string().min(1, "Product brand is required"),
  product_model: z.string().min(1, "Product model is required"),
  issue_description: z.string().min(10, "Please describe the issue in at least 10 characters"),
});

const NewServiceRequest = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof serviceRequestSchema>>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      product_type: "",
      product_brand: "",
      product_model: "",
      issue_description: "",
    },
  });

  useEffect(() => {
    if (selectedProduct) {
      form.setValue('product_type', selectedProduct.type);
      form.setValue('product_brand', selectedProduct.brand);
      form.setValue('product_model', selectedProduct.model);
    } else {
      form.setValue('product_type', '');
      form.setValue('product_brand', '');
      form.setValue('product_model', '');
    }
  }, [selectedProduct, form]);

  const onSubmit = async (values: z.infer<typeof serviceRequestSchema>) => {
    if (!user || !profile) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("service_requests").insert([
        {
          user_id: user.id,
          product_type: values.product_type,
          product_brand: values.product_brand,
          product_model: values.product_model,
          issue_description: values.issue_description,
          status: "Pending", // Initial status
        },
      ]).select(); // Select the inserted data to get its ID

      if (error) {
        throw error;
      }

      const newRequest = data[0];

      // Notify service centers via mock adapter
      mockRealtimeAdapter.emit('newRequest', {
        id: newRequest.id,
        requestId: newRequest.id, // Assuming id is also requestId for now
        productName: `${newRequest.product_brand} ${newRequest.product_model}`,
        customerName: profile.full_name || user.email || 'Unknown',
        requestDate: new Date(newRequest.created_at).toISOString().split('T')[0],
        status: newRequest.status,
        assignedCenter: '',
      });

      toast({
        title: "Service request created",
        description: "Your service request has been submitted.",
      });
      navigate("/service-requests");
    } catch (error: any) {
      console.error("Error creating service request:", error.message);
      toast({
        title: "Error creating service request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <h1 className="text-3xl font-bold font-heading">Create a New Service Request</h1>

      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="font-heading">Service Request Details</CardTitle>
          <CardDescription>Please provide details about the product and the issue you are experiencing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="product_type"
                render={() => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <ProductSelector onProductSelect={setSelectedProduct} className="mt-1" />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please describe the issue with your product in detail."
                        {...field}
                        className="bg-background/50 border-border/50 focus-visible:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting || !selectedProduct}>
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Submit Request
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewServiceRequest;