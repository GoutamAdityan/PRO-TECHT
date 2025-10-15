import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, useReducedMotion } from "framer-motion";
import { Filter, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from '@/components/PageTransition';
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants, rowVariants } from '@/lib/animations';

// Dummy Data
const DUMMY_SERVICE_REQUESTS: { id: string; productName: string; customerName: string; requestDate: string; status: JobStatus; assignedCenter: string; }[] = [
  {
    id: "SR001",
    productName: "Laptop Pro X",
    customerName: "Alice Johnson",
    requestDate: "2025-10-05",
    status: "Pending",
    assignedCenter: "Downtown Service Center",
  },
  {
    id: "SR002",
    productName: "Smartphone Z",
    customerName: "Bob Williams",
    requestDate: "2025-10-04",
    status: "In Progress",
    assignedCenter: "Uptown Electronics Repair",
  },
  {
    id: "SR003",
    productName: "Wireless Headphones",
    customerName: "Charlie Brown",
    requestDate: "2025-10-02",
    status: "Completed",
    assignedCenter: "Downtown Service Center",
  },
  {
    id: "SR004",
    productName: "Smart TV 55\"",
    customerName: "David Green",
    requestDate: "2025-10-01",
    status: "Pending",
    assignedCenter: "Uptown Electronics Repair",
  },
  {
    id: "SR005",
    productName: "Gaming PC",
    customerName: "Eve Davis",
    requestDate: "2025-09-30",
    status: "In Progress",
    assignedCenter: "Downtown Service Center",
  },
];

const ServiceQueue = () => {
  const [requests, setRequests] = useState(DUMMY_SERVICE_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "All">("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredRequests = requests.filter(req =>
    (req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || req.status === filterStatus)
  );

  const handleStatusChange = (id: string, newStatus: JobStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    // TODO: Implement API call to update status
  };

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white relative overflow-hidden bg-gradient-to-br from-background/50 via-background to-background"
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

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Manage incoming service requests and assign them to technicians.
        </motion.p>

        {/* Main Content Card (Table Wrapper) */}
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
              <CardTitle className="text-xl font-semibold text-foreground/90">Incoming Warranty & Service Requests</CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <SearchBar
                  placeholder="Filter by product or customer..."
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
                    <SelectItem value="Pending">
                      <StatusBadge status="Pending" />
                    </SelectItem>
                    <SelectItem value="In Progress">
                      <StatusBadge status="In Progress" />
                    </SelectItem>
                    <SelectItem value="Completed">
                      <StatusBadge status="Completed" />
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <motion.tr
                          key={req.id}
                          variants={shouldReduceMotion ? { opacity: 1 } : rowVariants}
                          initial="hidden"
                          animate="show"
                          whileHover={shouldReduceMotion ? {} : { scale: 1.01, transition: { duration: 0.12 } }}
                          className="border-b border-foreground/5 hover:bg-muted/20"
                        >
                          <TableCell className="font-medium text-primary cursor-pointer hover:underline">{req.id}</TableCell>
                          <TableCell className="text-foreground/80">{req.productName}</TableCell>
                          <TableCell className="text-foreground/80">{req.customerName}</TableCell>
                          <TableCell className="text-foreground/80">{req.requestDate}</TableCell>
                          <TableCell>
                            <Select onValueChange={(value: JobStatus) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                              <SelectTrigger className="w-[140px] h-8 text-xs rounded-full bg-background/50 border-border/50 focus:ring-primary focus:ring-offset-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                                <SelectItem value="Pending">
                                  <StatusBadge status="Pending" />
                                </SelectItem>
                                <SelectItem value="In Progress">
                                  <StatusBadge status="In Progress" />
                                </SelectItem>
                                <SelectItem value="Completed">
                                  <StatusBadge status="Completed" />
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-foreground/80">{req.assignedCenter}</TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </PageTransition>
  );
};

export default ServiceQueue;