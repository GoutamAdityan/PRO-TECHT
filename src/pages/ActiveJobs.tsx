import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SearchBar from "@/components/ui/SearchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, RotateCcw, Filter, CalendarDays, Search, Loader2, Users } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import { DetailsPanel } from '@/features/chat/DetailsPanel/DetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import PageTransition from '@/components/PageTransition';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants, rowVariants } from '@/lib/animations';

// TODO: Replace with actual API hook for fetching active jobs
const DUMMY_JOBS = [
  { id: 'SR001', requestId: 'SR001', product: 'Laptop Pro', customer: 'Alice Smith', date: '2023-10-26', status: 'In Progress', assignedCenter: 'Uptown Electronics' },
  { id: 'SR002', requestId: 'SR002', product: 'Smartwatch X', customer: 'Bob Johnson', date: '2023-10-25', status: 'Pending', assignedCenter: 'Downtown Gadgets' },
  { id: 'SR003', requestId: 'SR003', product: 'Tablet Air', customer: 'Charlie Brown', date: '2023-10-24', status: 'In Progress', assignedCenter: 'Uptown Electronics' },
  { id: 'SR004', requestId: 'SR004', product: 'Headphones Z', customer: 'Diana Prince', date: '2023-10-23', status: 'Completed', assignedCenter: 'Downtown Gadgets' },
  { id: 'SR005', requestId: 'SR005', product: 'Gaming Console', customer: 'Eve Adams', date: '2023-10-22', status: 'Pending', assignedCenter: 'Uptown Electronics' },
  { id: 'SR006', requestId: 'SR006', product: 'Monitor Ultra', customer: 'Frank White', date: '2023-10-21', status: 'In Progress', assignedCenter: 'Downtown Gadgets' },
  { id: 'SR007', requestId: 'SR007', product: 'Keyboard Mech', customer: 'Grace Lee', date: '2023-10-20', status: 'Completed', assignedCenter: 'Uptown Electronics' },
];

type JobStatus = "Pending" | "In Progress" | "Completed";

interface Job {
  id: string;
  requestId: string;
  product: string;
  customer: string;
  date: string;
  status: JobStatus;
  assignedCenter: string;
}

const ActiveJobs = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "All">("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isLoadingJobs, setIsLoadingJobs] = useState(false); // Start with false for dummy data
  const shouldReduceMotion = useReducedMotion();

  // TODO: Replace with actual API hook for fetching active jobs
  useEffect(() => {
    // Simulate fetching data
    setIsLoadingJobs(true);
    const timer = setTimeout(() => {
      setJobs(DUMMY_JOBS);
      setIsLoadingJobs(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    setJobs(jobs.map(job => job.id === id ? { ...job, status: newStatus } : job));
    toast({
      title: "Job Status Updated",
      description: `Request ${id} is now ${newStatus}.`,
    });
  };

  const filteredJobs = jobs.filter(job =>
    (job.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requestId.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || job.status === filterStatus)
  );

  const handleViewDetails = (requestId: string) => {
    setSelectedRequestId(requestId);
    setIsDetailsPanelOpen(true);
  };

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white"
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
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Active Jobs</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Overview of all active service requests and their current status.
        </motion.p>

        {/* Main Content Card */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
          className="rounded-2xl transition-all duration-300 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]"
        >
          <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground/90">Current Service Assignments</CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <SearchBar
                  placeholder="Search by ID, product, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search active jobs"
                />
                <Select value={filterStatus} onValueChange={(value: JobStatus | "All") => setFilterStatus(value)}>
                  <SelectTrigger className="w-[180px] h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0">
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
                <Button
                  variant="outline"
                  className="h-10 px-6 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg
                             hover:translate-y-[-2px] transition-all duration-200 ease-out
                             shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                >
                  <CalendarDays className="h-4 w-4 mr-2" /> Date Range
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex-grow">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-semibold text-foreground/90">Request ID</TableHead>
                      <TableHead className="font-semibold text-foreground/90">Product</TableHead>
                      <TableHead className="font-semibold text-foreground/90">Customer</TableHead>
                      <TableHead className="font-semibold text-foreground/90">Date</TableHead>
                      <TableHead className="font-semibold text-foreground/90">Status</TableHead>
                      <TableHead className="font-semibold text-foreground/90">Assigned Center</TableHead>
                      <TableHead className="font-semibold text-foreground/90 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingJobs ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" /> Loading jobs...
                        </TableCell>
                      </TableRow>
                    ) : filteredJobs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No active jobs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredJobs.map((job) => (
                        <motion.tr
                          key={job.id}
                          variants={shouldReduceMotion ? { opacity: 1 } : rowVariants}
                          initial="hidden"
                          animate="show"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.01, transition: { duration: 0.12 } }}
                          className="border-b border-foreground/5 hover:bg-muted/20"
                        >
                          <TableCell className="font-medium text-primary cursor-pointer hover:underline" onClick={() => handleViewDetails(job.id)}>{job.requestId}</TableCell>
                          <TableCell className="text-foreground/80">{job.product}</TableCell>
                          <TableCell className="text-foreground/80">{job.customer}</TableCell>
                          <TableCell className="text-foreground/80">{job.date}</TableCell>
                          <TableCell>
                            <StatusBadge status={job.status} />
                          </TableCell>
                          <TableCell className="text-foreground/80">{job.assignedCenter || "Unassigned"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full
                                                                   hover:bg-accent/10 hover:text-accent-foreground
                                                                   shadow-[0_0_10px_rgba(34,197,94,0.05)] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                        aria-label="Job Actions">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-sm border-border/50">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/50" />
                                <DropdownMenuItem onClick={() => handleViewDetails(job.id)} className="hover:bg-accent/10 hover:text-accent-foreground">
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                {job.status === "Pending" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(job.id, "In Progress")} className="hover:bg-accent/10 hover:text-accent-foreground">
                                    <Check className="h-4 w-4 mr-2" /> Claim Job
                                  </DropdownMenuItem>
                                )}
                                {job.status === "In Progress" && (
                                  <DropdownMenuItem onClick={() => handleStatusChange(job.id, "Completed")} className="hover:bg-accent/10 hover:text-accent-foreground">
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
        </motion.div>
      </motion.div>

      <DetailsPanel
        open={isDetailsPanelOpen}
        onClose={() => setIsDetailsPanelOpen(false)}
        conversationId={selectedRequestId}
        isMobile={isMobile}
      />
    </PageTransition>
  );
};

export default ActiveJobs;
