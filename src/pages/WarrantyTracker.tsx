import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WarrantyStatusBadge } from '@/components/custom/WarrantyStatusBadge';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShieldCheck, ShieldX, Search, Wrench } from 'lucide-react';
import { FloatingLabelInput } from '../components/ui/FloatingLabelInput'; // Corrected relative import
import { Input } from '@/components/ui/input'; // Added import for Input component
import WarrantyTrackerSkeleton from '@/components/WarrantyTrackerSkeleton'; // New import

interface ProductWarrantyInfo {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  warranty_expiry: string;
  service_counts: {
    submitted?: number;
    in_progress?: number;
    completed?: number;
  };
}

const WarrantyTracker = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWarrantyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (user) {
      fetchWarrantyData();
    }
  }, [user]);

  const fetchWarrantyData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_products_with_service_counts', {
        user_id_param: user.id,
      });

      if (error) {
        console.error('Error fetching warranty data:', error);
      } else {
        setProducts(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    if (diff < 0) return null;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days === null) return 'expired';
    if (days <= 30) return 'expiring-soon';
    return 'active';
  };

  const filteredProducts = products
    .filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(filter.toLowerCase()))
    .filter(p => {
      if (statusFilter === 'all') return true;
      return getStatus(p.warranty_expiry) === statusFilter;
    });

  // Global easing for primary transitions
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
      className="max-w-7xl mx-auto px-6 py-10 text-white" // Centered with max-width and generous padding
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold leading-tight mb-2">Warranty Tracker</h1>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-lg text-gray-400 leading-relaxed">
              An overview of your product warranties and service history.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <motion.div variants={itemVariants} className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by brand or model..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="h-11 w-full pl-10 pr-4 py-2.5 rounded-lg border border-[rgba(255,255,255,0.03)] bg-[rgba(18,26,22,0.45)] text-foreground/80 placeholder:text-muted-foreground placeholder:opacity-80
                       focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all duration-150 ease-out"
            aria-label="Filter warranties"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger
              className="h-11 w-full md:w-[180px] px-4 rounded-lg border border-[rgba(255,255,255,0.03)] bg-[rgba(18,26,22,0.45)] text-foreground/80
                         focus:outline-none focus:ring-2 focus:ring-emerald-400/30 transition-all duration-150 ease-out"
            >
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-[rgba(18,26,22,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] text-foreground/80">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <WarrantyTrackerSkeleton key="skeleton" />
        ) : filteredProducts.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center"
          >
            <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-8 shadow-xl max-w-md w-full">
              <CardContent className="flex flex-col items-center justify-center p-0">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                  <ShieldX className="w-20 h-20 mx-auto text-green-500 mb-6" /> {/* Subtle icon */}
                </motion.div>
                <CardTitle className="text-2xl font-bold mb-3 leading-normal">
                  No Warranties Found
                </CardTitle>
                <CardDescription className="text-base text-gray-400 mb-8 leading-relaxed">
                  It looks like you haven't registered any products yet, or all warranties have expired.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="warranty-list"
            className="rounded-md border border-[rgba(255,255,255,0.03)] bg-[rgba(18,26,22,0.45)] backdrop-blur-sm shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <Table>
              <TableHeader className="[&_tr]:border-b-[rgba(255,255,255,0.05)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-300 font-bold tracking-wider">Product</TableHead>
                  <TableHead className="text-gray-300 font-bold tracking-wider">Warranty Status</TableHead>
                  <TableHead className="text-gray-300 font-bold tracking-wider">Days to Expiry</TableHead>
                  <TableHead className="text-gray-300 font-bold tracking-wider">Services (In Progress)</TableHead>
                  <TableHead className="text-gray-300 font-bold tracking-wider">Services (Completed)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(p => {
                  const daysUntilExpiry = getDaysUntilExpiry(p.warranty_expiry);
                  return (
                    <motion.tr
                      key={p.id}
                      variants={itemVariants}
                      whileHover={{
                        y: shouldReduceMotion ? 0 : -4,
                        boxShadow: shouldReduceMotion ? 'none' : '0 10px 20px rgba(0,0,0,0.3)',
                        scale: shouldReduceMotion ? 1 : 1.01,
                        transition: { duration: 0.18, ease: [0.22, 0.9, 0.32, 1] },
                        backgroundColor: shouldReduceMotion ? 'transparent' : 'rgba(255,255,255,0.05)',
                      }}
                      whileTap={{ scale: 0.99, transition: { duration: 0.08 } }}
                      className="border-b-[rgba(255,255,255,0.05)] cursor-pointer"
                    >
                      <TableCell>
                        <div className="font-medium text-gray-100">{p.brand} {p.model}</div>
                        <div className="text-sm text-gray-400">{p.serial_number}</div>
                      </TableCell>
                      <TableCell><WarrantyStatusBadge warrantyExpiry={p.warranty_expiry} /></TableCell>
                      <TableCell className="text-gray-200">{daysUntilExpiry !== null ? `${daysUntilExpiry} days` : '-'}</TableCell>
                      <TableCell className="text-gray-200">{p.service_counts?.in_progress || 0}</TableCell>
                      <TableCell className="text-gray-200">{p.service_counts?.completed || 0}</TableCell>
                    </motion.tr>
                  );
                })}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WarrantyTracker;