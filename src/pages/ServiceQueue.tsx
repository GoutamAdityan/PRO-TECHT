import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, useReducedMotion } from "framer-motion";
import { Filter, ClipboardList } from "lucide-react";
import PageTransition from '@/components/PageTransition';
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants, rowVariants } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceRequest {
  id: string;
  productName: string;
  customerName: string;
  issueDescription: string;
  requestDate: string;
  status: JobStatus;
  assignedCenter: string;
}

const ServiceQueue = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "All">("All");
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();

  // Fetch service requests from database
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        // 1. Get current user's Service Center ID
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Find the company owned by this user
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        let serviceCenterId = null;

        if (company) {
          // Find the service center for this company
          const { data: serviceCenter } = await supabase
            .from('service_centers')
            .select('id')
            .eq('company_id', company.id)
            .single();

          if (serviceCenter) {
            serviceCenterId = serviceCenter.id;
          }
        }

        if (!serviceCenterId) {
          // If no service center, return empty list (or handle error)
          setRequests([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('service_requests' as any)
          .select(`
            id,
            status,
            issue_description,
            created_at,
            products (
              brand,
              model
            ),
            profiles (
              full_name
            )
          `)
          .eq('service_center_id', serviceCenterId) // Filter by service center
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedRequests: ServiceRequest[] = (data || []).map((req: any) => ({
          id: req.id.substring(0, 8).toUpperCase(),
          productName: `${req.products?.brand || 'Unknown'} ${req.products?.model || ''}`.trim(),
          customerName: req.profiles?.full_name || 'Unknown Customer',
          issueDescription: req.issue_description || 'No description provided',
          requestDate: new Date(req.created_at).toLocaleDateString(),
          status: (req.status || 'submitted') as JobStatus,
          assignedCenter: 'Pending Assignment',
        }));

        setRequests(formattedRequests);
      } catch (error: any) {
        toast({
          title: "Error fetching service requests",
          description: error.message,
          variant: "destructive"
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();

    // Set up real-time subscription
    const channel = supabase
      .channel('service_requests_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'service_requests' },
        () => {
          fetchServiceRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const filteredRequests = requests.filter(req =>
    (req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.issueDescription.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || req.status === filterStatus)
  );

  const handleStatusChange = async (id: string, newStatus: JobStatus) => {
    // Optimistic update
    const oldRequests = [...requests];
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));

    try {
      // Find full ID from database
      const { data: fullReq } = await supabase
        .from('service_requests' as any)
        .select('id')
        .ilike('id', `${id}%`)
        .single();

      if (fullReq && (fullReq as any).id) {
        const { error } = await supabase
          .from('service_requests' as any)
          .update({ status: newStatus })
          .eq('id', (fullReq as any).id);

        if (error) throw error;

        toast({
          title: "Status updated",
          description: `Service request ${id} status changed to ${newStatus}`,
        });
      }
    } catch (error: any) {
      // Revert on error
      setRequests(oldRequests);
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const containerAnimation: any = shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 }, exit: { opacity: 1 } } : containerVariants;
  const headerIconAnimation: any = shouldReduceMotion ? { hidden: { opacity: 1, scale: 1 }, show: { opacity: 1, scale: 1 } } : headerIconVariants;
  const cardAnimation: any = shouldReduceMotion ? { hidden: { opacity: 1, y: 0, scale: 1 }, show: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 1, y: 0, scale: 1 } } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-foreground relative overflow-hidden bg-gradient-to-br from-background/50 via-background to-background"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            variants={headerIconAnimation}
            initial="hidden"
            animate="show"
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <ClipboardList className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Service Queue</h1>
        </div>

        {/* Subtitle */}
        <motion.p
          variants={shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : cardVariants}
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Manage incoming service requests and assign them to technicians.
        </motion.p>

        {/* Main Content Card */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover={shouldReduceMotion ? {} : (cardHoverVariants as any).hover}
          className="rounded-2xl transition-all duration-300 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
        >
          <Card className="bg-card backdrop-blur-xl border border-border rounded-2xl p-6 flex flex-col h-full">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground/90">Incoming Warranty & Service Requests</CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <SearchBar
                  placeholder="Filter by product, customer, or issue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search service requests"
                />
                <Select value={filterStatus} onValueChange={(value: JobStatus | "All") => setFilterStatus(value)}>
                  <SelectTrigger className="w-[180px] h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="submitted">
                      <StatusBadge status="submitted" />
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <StatusBadge status="in_progress" />
                    </SelectItem>
                    <SelectItem value="completed">
                      <StatusBadge status="completed" />
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex-grow">
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  Loading service requests...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="font-semibold text-foreground/90">Request ID</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Product</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Customer</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Issue Description</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Date</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Status</TableHead>
                        <TableHead className="font-semibold text-foreground/90">Assigned Center</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((req) => (
                          <motion.tr
                            key={req.id}
                            variants={shouldReduceMotion ? { hidden: { opacity: 1 }, show: { opacity: 1 } } : rowVariants}
                            initial="hidden"
                            animate="show"
                            whileHover={shouldReduceMotion ? {} : { scale: 1.01, transition: { duration: 0.12 } }}
                            className="border-b border-border hover:bg-accent"
                          >
                            <TableCell className="font-medium text-primary cursor-pointer hover:underline">{req.id}</TableCell>
                            <TableCell className="text-foreground/80">{req.productName}</TableCell>
                            <TableCell className="text-foreground/80">{req.customerName}</TableCell>
                            <TableCell className="text-foreground/80 max-w-xs truncate" title={req.issueDescription}>
                              {req.issueDescription}
                            </TableCell>
                            <TableCell className="text-foreground/80">{req.requestDate}</TableCell>
                            <TableCell>
                              <Select onValueChange={(value: JobStatus) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                                <SelectTrigger className="w-[140px] h-8 text-xs rounded-full bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                                  <SelectItem value="submitted">
                                    <StatusBadge status="submitted" />
                                  </SelectItem>
                                  <SelectItem value="in_progress">
                                    <StatusBadge status="in_progress" />
                                  </SelectItem>
                                  <SelectItem value="completed">
                                    <StatusBadge status="completed" />
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-foreground/80">{req.assignedCenter}</TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            <div className="flex flex-col items-center justify-center">
                              <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                              No service requests found.
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default ServiceQueue;