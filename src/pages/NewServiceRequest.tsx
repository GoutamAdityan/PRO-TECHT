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
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { Send, Plus, Wrench } from 'lucide-react';
import { ProductDropdown } from "@/components/ui/ProductDropdown";

const serviceRequestSchema = z.object({
  product_id: z.string().min(1, "Please select a product"),
  issue_description: z.string().min(10, "Please describe the issue in at least 10 characters"),
});

interface Product {
  id: string;
  brand: string;
  model: string;
}

const NewServiceRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof serviceRequestSchema>>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      product_id: "",
      issue_description: "",
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, brand, model')
          .eq('user_id', user.id);

        if (error) throw error;
        setProducts(data || []);
      } catch (error: any) {
        toast({ title: "Error fetching products", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user, toast]);

  const onSubmit = async (values: z.infer<typeof serviceRequestSchema>) => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      const { error: requestError } = await supabase.from("service_requests").insert([
        {
          user_id: user.id,
          product_id: values.product_id,
          issue_description: values.issue_description,
          status: "submitted",
        },
      ]);

      if (requestError) throw requestError;

      toast({ title: "Service request created", description: "Your service request has been submitted." });
      navigate("/service-requests");
    } catch (error: any) {
      toast({ title: "Error creating service request", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-center">
        <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Products Found</h1>
        <p className="text-muted-foreground mb-6">You need to add a product to your vault before you can create a service request.</p>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="h-5 w-5 mr-2" /> Add a Product
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold leading-tight mb-6">Create a New Service Request</h1>
      <Card className="bg-card border-border rounded-2xl p-6 shadow-xl">
        <CardContent className="px-0 pb-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold">1. Select a Product</FormLabel>
                    <FormControl>
                      <ProductDropdown products={products} value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl font-bold">2. Describe the Issue</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., The screen is flickering and showing distorted colors."
                        {...field}
                        className="bg-background border-border text-foreground focus-visible:ring-ring"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : <><Send className="h-5 w-5 mr-2" /> Submit Request</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewServiceRequest;