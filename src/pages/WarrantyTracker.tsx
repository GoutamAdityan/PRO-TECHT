import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WarrantyStatusBadge } from '@/components/custom/WarrantyStatusBadge';
import { ShieldIntegrityMeter } from '@/components/custom/ShieldIntegrityMeter';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldX, Search, Wrench, AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { GlitchText } from '@/components/ui/GlitchText';

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
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductWarrantyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <GlitchText
            text="Warranty Tracker"
            className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-emerald-500"
          />
          <motion.p className="text-muted-foreground text-lg">
            Monitor warranty status and service history.
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search warranties..."
              className="pl-10 bg-card border-border focus:border-emerald-500/50 transition-all"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-card border-border">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="p-6 rounded-full bg-emerald-500/10 mb-6 animate-pulse-glow">
              <ShieldCheck className="w-16 h-16 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Warranties Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {filter ? "No warranties match your search." : "Register products to start tracking their warranties."}
            </p>
            {!filter && (
              <Button onClick={() => navigate('/products/new')} className="btn-neon rounded-full px-8 py-6 text-lg">
                <ShieldCheck className="w-6 h-6 mr-2" /> Register Product
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="warranty-list"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {filteredProducts.map((p) => {
              const daysUntilExpiry = getDaysUntilExpiry(p.warranty_expiry);
              const status = getStatus(p.warranty_expiry);

              return (
                <AnimatedCard
                  key={p.id}
                  hoverEffect="lift"
                  className={`h-full flex flex-col justify-between group border-border transition-colors ${status === 'expired' ? 'hover:border-red-500/30' :
                    status === 'expiring-soon' ? 'hover:border-yellow-500/30' :
                      'hover:border-emerald-500/30'
                    }`}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl border border-border transition-colors ${status === 'expired' ? 'bg-red-500/10 text-red-400 group-hover:border-red-500/50' :
                        status === 'expiring-soon' ? 'bg-yellow-500/10 text-yellow-400 group-hover:border-yellow-500/50' :
                          'bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/50'
                        }`}>
                        {status === 'expired' ? <ShieldX className="w-6 h-6" /> :
                          status === 'expiring-soon' ? <AlertTriangle className="w-6 h-6" /> :
                            <ShieldCheck className="w-6 h-6" />}
                      </div>
                      <WarrantyStatusBadge warrantyExpiry={p.warranty_expiry} />
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-foreground transition-colors">{p.brand} {p.model}</h3>
                    <p className="text-muted-foreground text-sm mb-4 font-mono">{p.serial_number}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <ShieldIntegrityMeter expiryDate={p.warranty_expiry} size="sm" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Service History</p>
                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-blue-400" title="In Progress">
                            <Clock className="w-4 h-4" />
                            <span>{p.service_counts?.in_progress || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400" title="Completed">
                            <CheckCircle className="w-4 h-4" />
                            <span>{p.service_counts?.completed || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">View Details</span>
                    <ArrowRight className={`w-4 h-4 transform group-hover:translate-x-1 transition-transform ${status === 'expired' ? 'text-red-400' :
                      status === 'expiring-soon' ? 'text-yellow-400' :
                        'text-emerald-400'
                      }`} />
                  </div>
                </AnimatedCard>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WarrantyTracker;