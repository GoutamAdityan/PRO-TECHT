import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchBar from "@/components/ui/SearchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Check, RotateCcw, Filter, CalendarDays, Loader2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import { DetailsPanel } from '@/features/chat/DetailsPanel/DetailsPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import AnimatedCard from '@/components/ui/AnimatedCard';

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

type JobStatusType = "Pending" | "In Progress" | "Completed";

interface Job {
  id: string;
  requestId: string;
  product: string;
  customer: string;
  date: string;
  status: string;
  assignedCenter: string;
}

const ActiveJobs = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>(DUMMY_JOBS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatusType | "All">("All");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const isMobile = useIsMobile();
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  useEffect(() => {
    setIsLoadingJobs(true);
    const timer = setTimeout(() => {
      setJobs(DUMMY_JOBS);
      setIsLoadingJobs(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: JobStatusType) => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 mb-8 flex items-center justify-between">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Active Jobs</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Track and manage ongoing service requests and assignments.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex gap-3">
          <div className="text-center px-6 py-3 rounded-2xl bg-card border border-border backdrop-blur-sm">
            <div className="text-2xl font-bold text-emerald-400">{jobs.filter(j => j.status === 'In Progress').length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">In Progress</div>
          </div>
          <div className="text-center px-6 py-3 rounded-2xl bg-card border border-border backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">{jobs.filter(j => j.status === 'Pending').length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Pending</div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <AnimatedCard className="border-border bg-card backdrop-blur-md overflow-hidden p-0">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-black/20">
          <h2 className="text-xl font-semibold text-foreground">Current Assignments</h2>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <SearchBar
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-background/50 border-border"
            />
            <Select value={filterStatus} onValueChange={(value: JobStatusType | "All") => setFilterStatus(value)}>
              <SelectTrigger className="w-[160px] bg-background/50 border-border text-foreground">
                <Filter className="h-4 w-4 mr-2 text-emerald-400" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Request ID</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Assigned Center</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode="wait">
                {isLoadingJobs ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                        <span>Loading jobs...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredJobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      No active jobs found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((job, index) => (
                    <motion.tr
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/20 transition-colors group"
                    >
                      <TableCell className="font-medium text-emerald-400 cursor-pointer hover:underline" onClick={() => handleViewDetails(job.id)}>{job.requestId}</TableCell>
                      <TableCell className="text-foreground">{job.product}</TableCell>
                      <TableCell className="text-foreground">{job.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{job.date}</TableCell>
                      <TableCell>
                        <StatusBadge status={job.status as JobStatus} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">{job.assignedCenter || "Unassigned"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted/20 text-muted-foreground hover:text-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem onClick={() => handleViewDetails(job.id)} className="hover:bg-accent cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            {job.status === "Pending" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, "In Progress")} className="hover:bg-accent cursor-pointer text-blue-400">
                                <Check className="h-4 w-4 mr-2" /> Claim Job
                              </DropdownMenuItem>
                            )}
                            {job.status === "In Progress" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, "Completed")} className="hover:bg-accent cursor-pointer text-emerald-400">
                                <Check className="h-4 w-4 mr-2" /> Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="hover:bg-accent cursor-pointer text-red-400">
                              <RotateCcw className="h-4 w-4 mr-2" /> Reassign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </AnimatedCard>

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
