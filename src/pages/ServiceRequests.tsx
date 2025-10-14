import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Wrench, Calendar, DollarSign, FileText, ClipboardList } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ServiceRequestSkeleton from '@/components/ServiceRequestSkeleton'; // New import

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
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

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

      // Role-based data fetching
      if (profile.role === 'consumer') {
        query = query.eq('user_id', user.id);
      } else if (profile.role === 'business_partner') {
        // The RLS policy for business_partner will automatically filter requests.
        // We don't need to add a filter here.
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
    let statusText = 'Pending';
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
    let bgColor = 'bg-gray-600/30';
    let textColor = 'text-gray-300';
    let borderColor = 'border-gray-500/50';

    if (!request.service_centers) {
      statusText = 'Pending Assignment';
    } else if (!request.appointment_date) {
      statusText = 'Assigned';
      variant = 'secondary';
      bgColor = 'bg-blue-600/30';
      textColor = 'text-blue-300';
      borderColor = 'border-blue-500/50';
    } else if (request.actual_cost !== null) {
      statusText = 'Completed';
      variant = 'default';
      bgColor = 'bg-green-600/30';
      textColor = 'text-green-300';
      borderColor = 'border-green-500/50';
    } else {
      statusText = 'In Progress';
      variant = 'outline';
      bgColor = 'bg-yellow-600/30';
      textColor = 'text-yellow-300';
      borderColor = 'border-yellow-500/50';
    }

    return (
      <Badge variant={variant} className={`flex items-center gap-1 shadow-sm ${bgColor} ${textColor} ${borderColor}`}>
        {statusText}
      </Badge>
    );
  };

  // Global easing for primary transitions
  const globalEasing = [0.22, 0.9, 0.32, 1];

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 50 }, // More dramatic slide-in
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.07, // Match dashboard
        delayChildren: 0.2,    // Match dashboard
        ease: "easeOut",       // Match dashboard
      },
    },
  };

  const itemVariants = {
    hidden: { y: shouldReduceMotion ? 0 : 20, opacity: 0, filter: shouldReduceMotion ? 'none' : 'blur(8px)' }, // Add blur-in
    show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } }, // Increased blur-in duration
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -30, filter: shouldReduceMotion ? 'none' : 'blur(10px)', transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" } }} // Increased exit duration and blur
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 py-10 text-white" // Centered with max-width and generous padding
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold leading-tight mb-2">Service Requests</h1>
          </motion.div>
          <motion.div variants={itemVariants}>
            <p className="text-lg text-gray-400 leading-relaxed">
              Track your product repairs and service appointments.
            </p>
          </motion.div>
        </div>
        <Button
          asChild
          className="h-12 px-6 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-medium shadow-lg
                     hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out
                     focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          whileHover={{ scale: 1.06, boxShadow: shouldReduceMotion ? 'none' : '0 0 20px rgba(34, 197, 94, 0.7)' }} // More prominent hover
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Link to="/service-requests/new">
            <Plus className="w-5 h-5 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <ServiceRequestSkeleton key="skeleton" />
        ) : requests.length === 0 ? (
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
                  <Wrench className="w-20 h-20 mx-auto text-green-500 mb-6" /> {/* Micro-illustration icon */}
                </motion.div>
                <CardTitle className="text-2xl font-bold mb-3 leading-normal">
                  No Service Requests Yet
                </CardTitle>
                <CardDescription className="text-base text-gray-400 mb-8 leading-relaxed">
                  Create your first service request when you need repair or maintenance.
                </CardDescription>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1, scaleX: [1, 1.05, 1] }} // Pulse once animation
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  className="relative"
                >
                  <Button
                    asChild
                    className="h-12 px-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white font-medium shadow-lg
                               hover:from-green-700 hover:to-green-800 transition-all duration-300 ease-out
                               focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <Link to="/service-requests/new">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Service Request
                    </Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="request-list"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {requests.map((request) => (
              <motion.div
                key={request.id}
                variants={itemVariants}
                whileHover={{
                  y: shouldReduceMotion ? 0 : -10, // More lift
                  boxShadow: shouldReduceMotion ? 'none' : '0 20px 40px rgba(0,0,0,0.5)', // More prominent shadow
                  scale: shouldReduceMotion ? 1 : 1.03, // More scale
                  rotateZ: shouldReduceMotion ? 0 : 1, // Slight tilt
                  transition: { duration: 0.2, ease: "easeOut" }, // short 200ms
                }}
                className="relative"
              >
                <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5 h-full flex flex-col justify-between">
                  <CardHeader className="pb-3 px-0 pt-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold leading-normal">
                          {request.products.brand} {request.products.model}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-400 leading-relaxed">
                          {request.issue_description.length > 80
                            ? `${request.issue_description.substring(0, 80)}...`
                            : request.issue_description}
                        </CardDescription>
                      </div>
                      {getStatusBadge(request)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-0 pb-0">
                    {request.service_centers && (
                      <div className="text-base">
                        <span className="text-gray-400">Service Center:</span>{' '}
                        <span className="font-medium text-gray-200">{request.service_centers.name}</span>
                        {request.service_centers.phone && (
                          <span className="text-gray-400 ml-2">
                            • {request.service_centers.phone}
                          </span>
                        )}
                      </div>
                    )}

                    {request.appointment_date && (
                      <div className="flex items-center gap-1 text-base text-gray-400">
                        <Calendar className="w-4 h-4 text-green-400" />
                        <span>Appointment:</span>
                        <span className="text-gray-200">{new Date(request.appointment_date).toLocaleString()}</span>
                      </div>
                    )}

                    {(request.estimated_cost || request.actual_cost) && (
                      <div className="flex items-center gap-1 text-base text-gray-400">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        {request.actual_cost ? (
                          <span>Final Cost: <span className="font-medium text-gray-200">${request.actual_cost}</span></span>
                        ) : (
                          <span>Estimated: <span className="font-medium text-gray-200">${request.estimated_cost}</span></span>
                        )}
                      </div>
                    )}

                    <div className="text-base text-gray-400">
                      <span>Created:</span>{' '}
                      <span className="text-gray-200">{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-10 px-5 rounded-full border-green-500/50 text-green-300 bg-green-600/20
                                   hover:bg-green-600/40 hover:text-green-100 transition-all duration-200 ease-out
                                   focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <Link to={`/service-requests/${request.id}`}>
                          <FileText className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ServiceRequests;