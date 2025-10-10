import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, RotateCcw, Filter, CalendarDays, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { DetailsPanel } from '@/features/chat/DetailsPanel/DetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/hooks/useRealtime';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { mockRealtimeAdapter } from '@/lib/realtime/mockAdapter';

// TypeScript Types
type ServiceRequestStatus = "Pending" | "In Progress" | "Completed";

type ServiceRequest = {
  id: string;
  requestId: string;
  productName: string;
  customerName: string;
  requestDate: string;
  status: ServiceRequestStatus;
  assignedCenter: string;
};

const getStatusBadgeClass = (status: ServiceRequestStatus) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "In Progress":
      return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    case "Completed":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  }
};

const ActiveJobs = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ServiceRequestStatus | "All">("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  // Fetch initial active jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      // In a real app, centerId would come from profile or be selected
      const centerId = profile?.assigned_center_id || "Uptown Electronics Repair"; // Mock center ID
      const fetchedJobs = await mockRealtimeAdapter.fetchActiveJobs(centerId);
      setRequests(fetchedJobs);
      setIsLoadingJobs(false);
    };
    if (profile?.role === 'service_center') {
      fetchJobs();
    }
  }, [profile]);

  // Subscribe to new requests
  useRealtime({
    newRequest: (newReq: ServiceRequest) => {
      if (profile?.role === 'service_center') {
        // Check if the request is for this service center (mock logic)
        // For now, assume all new requests are relevant
        setRequests((prev) => [newReq, ...prev]);
        toast({
          title: "New Service Request!",
          description: `Request ID: ${newReq.requestId} for ${newReq.productName}`,
          action: <Button variant="ghost" onClick={() => handleViewDetails(newReq.id)}>View</Button>,
          duration: 5000,
        });
      }
    },
  });

  const handleStatusChange = (id: string, newStatus: ServiceRequestStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const filteredRequests = requests.filter(req =>
    (req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || req.status === filterStatus)
  );

  const handleViewDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsDetailsPanelOpen(true);
  };

  if (isLoadingJobs) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-lg">Loading active jobs...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full overflow-hidden"
    >
      <div className="flex-1 flex flex-col">
        <h1 className="text-3xl font-bold font-heading mb-6">Active Jobs</h1>
        <Card className="mb-6 bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
          <CardHeader>
            <CardTitle className="font-heading">Current Service Assignments</CardTitle>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, product, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary"
                />
              </div>
              <Select value={filterStatus} onValueChange={(value: ServiceRequestStatus | "All") => setFilterStatus(value)}>
                <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus-visible:ring-primary">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-accent/10 hover:text-accent-foreground">
                <CalendarDays className="h-4 w-4 mr-2" /> Date Range
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-heading">Request ID</TableHead>
                    <TableHead className="font-heading">Product</TableHead>
                    <TableHead className="font-heading">Customer</TableHead>
                    <TableHead className="font-heading">Date</TableHead>
                    <TableHead className="font-heading">Status</TableHead>
                    <TableHead className="font-heading">Assigned Center</TableHead>
                    <TableHead className="font-heading text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingJobs ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" /> Loading jobs...
                      </TableCell>
                    </TableRow>
                  ) : filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No active jobs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((req) => (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.005, backgroundColor: "rgba(var(--surface-rgb), 0.1)", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
                        className="border-b border-border/50"
                      >
                        <TableCell className="font-medium text-primary cursor-pointer hover:underline" onClick={() => handleViewDetails(req.id)}>{req.requestId}</TableCell>
                        <TableCell>{req.productName}</TableCell>
                        <TableCell>{req.customerName}</TableCell>
                        <TableCell>{req.requestDate}</TableCell>
                        <TableCell>
                          <Badge className={cn("border shadow-sm", getStatusBadgeClass(req.status))}>{req.status}</Badge>
                        </TableCell>
                        <TableCell>{req.assignedCenter || "Unassigned"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-sm border-border/50">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border/50" />
                              <DropdownMenuItem onClick={() => handleViewDetails(req.id)} className="hover:bg-accent/10 hover:text-accent-foreground">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              {req.status === "Pending" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(req.id, "In Progress")} className="hover:bg-accent/10 hover:text-accent-foreground">
                                  <Check className="h-4 w-4 mr-2" /> Claim Job
                                </DropdownMenuItem>
                              )}
                              {req.status === "In Progress" && (
                                <DropdownMenuItem onClick={() => handleStatusChange(req.id, "Completed")} className="hover:bg-accent/10 hover:text-accent-foreground">
                                  <Check className="h-4 w-4 mr-2" /> Mark Complete
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="hover:bg-accent/10 hover:text-accent-foreground">
                                <RotateCcw className="h-4 w-4 mr-2" /> Reassign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <DetailsPanel
        open={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
        conversationId={selectedRequestId}
        isMobile={isMobile}
      />
    </motion.div>
  );
};

export default ActiveJobs;