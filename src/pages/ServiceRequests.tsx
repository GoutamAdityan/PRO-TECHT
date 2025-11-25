import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Wrench, Calendar, DollarSign, FileText, ClipboardList, ArrowRight, Search, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Input } from '@/components/ui/input';

interface ServiceRequest {
  id: string;
  issue_description: string;
  appointment_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: string;
  products: {
    brand: string;
    model: string;
  };
  service_centers?: {
    name: string;
    phone?: string;
  };
}

const ServiceRequests = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServiceRequests = useCallback(async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      let query = supabase
        .from('service_requests')
        .select(`
          *,
          products (brand, model),
          service_centers (name, phone)
        `);

      if (profile.role === 'consumer') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service requests.',
          variant: 'destructive',
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, profile, toast]);

  useEffect(() => {
    fetchServiceRequests();
  }, [fetchServiceRequests]);

  const getStatusBadge = (request: ServiceRequest) => {
    let statusText = 'In Progress';
    let className = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';

    if (!request.service_centers) {
      statusText = 'Pending Assignment';
      className = 'bg-red-500/10 text-red-400 border-red-500/20';
    } else if (!request.appointment_date) {
      statusText = 'Assigned';
      className = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    } else if (request.actual_cost !== null) {
      statusText = 'Completed';
      className = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }

    return (
      <Badge variant="outline" className={className}>
        {statusText}
      </Badge>
    );
  };

  const filteredRequests = requests.filter(req =>
    req.products?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.products?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.issue_description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <motion.h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-emerald-500">
            Service Requests
          </motion.h1>
          <motion.p className="text-muted-foreground text-lg">
            Track repairs and maintenance for your devices.
          </motion.p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search requests..."
              className="pl-10 bg-card border-border focus:border-emerald-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/service-requests/new')} className="btn-neon rounded-full px-6 whitespace-nowrap">
            <Plus className="w-5 h-5 mr-2" /> New Request
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="p-6 rounded-full bg-emerald-500/10 mb-6 animate-pulse-glow">
              <Wrench className="w-16 h-16 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Requests Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {searchTerm ? "No requests match your search." : "Create your first service request when you need repair or maintenance."}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/service-requests/new')} className="btn-neon rounded-full px-8 py-6 text-lg">
                <Plus className="w-6 h-6 mr-2" /> Create Request
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="request-list"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
          >
            {filteredRequests.map((request) => (
              <AnimatedCard
                key={request.id}
                hoverEffect="lift"
                className="h-full flex flex-col justify-between group border-border hover:border-emerald-500/30 transition-colors"
                onClick={() => navigate(`/service-requests/${request.id}`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-muted to-muted/50 border border-border group-hover:border-emerald-500/50 transition-colors">
                      <ClipboardList className="w-6 h-6 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
                    </div>
                    {getStatusBadge(request)}
                  </div>

                  <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors">
                    {request.products?.brand} {request.products?.model}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {request.issue_description}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    {request.service_centers && (
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-emerald-500/70" />
                        <span>{request.service_centers.name}</span>
                      </div>
                    )}
                    {request.appointment_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500/70" />
                        <span>{new Date(request.appointment_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {(request.estimated_cost || request.actual_cost) && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-emerald-500/70" />
                        <span>
                          {request.actual_cost ? `Final: $${request.actual_cost}` : `Est: $${request.estimated_cost}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">View Details</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </AnimatedCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceRequests;