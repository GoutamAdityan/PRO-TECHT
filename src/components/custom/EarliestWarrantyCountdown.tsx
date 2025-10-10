import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  warranty_end_date: string;
}

const EarliestWarrantyCountdown = () => {
  const { user } = useAuth();
  const [earliestProduct, setEarliestProduct] = useState<Product | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, warranty_end_date')
        .eq('user_id', user.id)
        .not('warranty_end_date', 'is', null)
        .order('warranty_end_date', { ascending: true })
        .limit(1);

      if (error) {
        console.error('Error fetching products for warranty countdown:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setEarliestProduct(data[0]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [user]);

  useEffect(() => {
    if (!earliestProduct) {
      setTimeLeft('No expiring warranties found.');
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const warrantyEndDate = new Date(earliestProduct.warranty_end_date);
      const difference = warrantyEndDate.getTime() - now.getTime();

      if (difference <= 0) {
        return 'Warranty Expired!';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft()); // Initial call

    return () => clearInterval(timer);
  }, [earliestProduct]);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-primary" /> Upcoming Warranty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>Loading warranty data...</CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="w-5 h-5 text-primary" /> Upcoming Warranty
          </CardTitle>
          {earliestProduct && (
            <CardDescription className="flex items-center gap-1">
              <Package className="w-4 h-4" /> {earliestProduct.name}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-foreground">{timeLeft}</p>
          {earliestProduct && (
            <p className="text-sm text-muted-foreground mt-1">
              Expires on: {new Date(earliestProduct.warranty_end_date).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EarliestWarrantyCountdown;
