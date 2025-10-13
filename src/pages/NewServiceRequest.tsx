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
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'; // Added AnimatePresence, useReducedMotion
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
  const shouldReduceMotion = useReducedMotion(); // Added useReducedMotion

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

  // Global easing for primary transitions (matching dashboard/product vault)
  const globalEasing = [0.22, 0.9, 0.32, 1];

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0, filter: shouldReduceMotion ? 'none' : 'blur(8px)' },
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -30, filter: shouldReduceMotion ? 'none' : 'blur(10px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } }}
      variants={containerVariants}
      className="max-w-3xl mx-auto px-6 py-10 text-white" // Centered with max-width and generous padding
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold leading-tight mb-6">Create a New Service Request</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-6 shadow-xl">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold leading-normal">Service Request Details</CardTitle>
            <CardDescription className="text-base text-gray-400 leading-relaxed">Please provide details about the product and the issue you are experiencing.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="product_type"
                  render={() => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-gray-300">Product</FormLabel>
                        <ProductSelector onProductSelect={setSelectedProduct} className="mt-1" />
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="issue_description"
                  render={({ field }) => (
                    <motion.div variants={itemVariants}>
                      <FormItem>
                        <FormLabel className="text-gray-300">Issue Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe the issue with your product in detail."
                            {...field}
                            className="bg-[rgba(18,26,22,0.45)] border-[rgba(255,255,255,0.03)] text-white focus-visible:ring-green-400 focus-visible:ring-offset-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </motion.div>
                  )}
                />
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full h-12 px-6 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-medium shadow-lg
                               hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out
                               focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                    whileHover={{ scale: 1.02, boxShadow: shouldReduceMotion ? 'none' : '0 0 15px rgba(34, 197, 94, 0.5)' }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    disabled={isSubmitting || !selectedProduct}
                  >
                    {isSubmitting ? 'Submitting...' : (
                      <>
                        <Send className="h-5 w-5 mr-2" /> Submit Request
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default NewServiceRequest;