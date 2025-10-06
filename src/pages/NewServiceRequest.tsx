import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (user) {
      const fetchProducts = async () => {
        const { data, error } = await supabase
          .from("products")
          .select("id, brand, model")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data);
        }
      };
      fetchProducts();
    }
  }, [user]);

  const form = useForm<z.infer<typeof serviceRequestSchema>>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      product_id: "",
      issue_description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof serviceRequestSchema>) => {
    if (!user) return;

    const { error } = await supabase.from("service_requests").insert([
      {
        ...values,
        user_id: user.id,
      },
    ]);

    if (error) {
      toast({
        title: "Error creating service request",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Service request created",
        description: "Your service request has been submitted.",
      });
      navigate("/service-requests");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Service Request</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.brand} {product.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewServiceRequest;
