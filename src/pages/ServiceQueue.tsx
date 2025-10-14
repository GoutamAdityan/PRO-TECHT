
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Filter, ChevronDown, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageRoot, container, item, row, micro } from "@/lib/animations/variants";

// TypeScript Types
type ServiceRequestStatus = "Pending" | "In Progress" | "Completed";

type ServiceRequest = {
  id: string;
  productName: string;
  customerName: string;
  requestDate: string;
  status: ServiceRequestStatus;
  assignedCenter: string;
};

// Dummy Data
const dummyServiceRequests: ServiceRequest[] = [
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
];

const ServiceQueue = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>(dummyServiceRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const shouldReduceMotion = useReducedMotion();

  const filteredRequests = requests.filter(req =>
    req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    // console.log("Requests:", requests);
    // console.log("Filtered Requests:", filteredRequests);
  }, [requests, filteredRequests]);

  const handleStatusChange = (id: string, newStatus: ServiceRequestStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-6 py-6 text-white"
      variants={pageRoot}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={container} initial="hidden" animate="visible">
        <motion.div variants={item} className="flex items-center gap-3 mb-6">
          <div
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Service Queue</h1>
        </motion.div>
        <motion.p variants={item} className="text-sm text-muted-foreground mb-8">Manage incoming service requests and assign them to technicians.</motion.p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="visible">
        <Card variant="app" className="mb-8" whileHover={micro.hover} whileTap={micro.tap}>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Incoming Warranty & Service Requests</CardTitle>
            <div className="mt-4 flex items-center gap-4">
              <motion.div
                variants={item}
                className="relative flex-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Filter by product or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[rgba(30,40,35,0.6)] border border-[rgba(64,87,74,0.3)] text-foreground placeholder-muted-foreground focus:border-accent-green focus:ring-0"
                />
              </motion.div>
              {/* Add filter dropdown here if needed */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Request ID</TableHead>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Product</TableHead>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Customer</TableHead>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Date</TableHead>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Status</TableHead>
                    <TableHead className="text-muted-foreground text-xs uppercase tracking-wide">Assigned Center</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((req) => (
                        <motion.tr
                          key={req.id}
                          variants={row}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          whileHover={micro.hover}
                          transition={{ type: "spring", stiffness: 120, damping: 18 }}
                          className="border-b border-panel-border"
                        >
                          <TableCell className="font-medium text-text-main">{req.id}</TableCell>
                          <TableCell className="text-text-main">{req.productName}</TableCell>
                          <TableCell className="text-text-main">{req.customerName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{req.requestDate}</TableCell>
                          <TableCell>
                                                      <Select onValueChange={(value: ServiceRequestStatus) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                                                        <SelectTrigger
                                                          className="w-[140px] h-8 text-xs rounded-full bg-panel-bg border-panel-border focus:ring-0 focus:border-accent-green"
                                                          whileHover={micro.hover}
                                                          whileTap={micro.tap}
                                                          transition={{ duration: 0.2, ease: "easeOut" }}
                                                        >
                                                          <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-panel-bg border-panel-border rounded-lg shadow-lg backdrop-blur-glass">
                                                          <SelectItem value="Pending">
                                                            <motion.div
                                                              whileHover={micro.hover}
                                                              whileTap={micro.tap}
                                                              transition={{ duration: 0.2, ease: "easeOut" }}
                                                            >
                                                                                              <Badge
                                                                                                className="bg-[rgba(255,217,102,0.15)] text-[#FFD766] rounded-full px-3 py-1 text-xs font-medium"
                                                                                                animate={{ opacity: [0.8, 1, 0.8] }}
                                                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                                              >
                                                                                                Pending
                                                                                              </Badge>                                                            </motion.div>
                                                          </SelectItem>
                                                          <SelectItem value="In Progress">
                                                            <motion.div
                                                              whileHover={micro.hover}
                                                              whileTap={micro.tap}
                                                              transition={{ duration: 0.2, ease: "easeOut" }}
                                                            >
                                                                                              <Badge
                                                                                                className="bg-[rgba(66,145,255,0.15)] text-[#4291FF] rounded-full px-3 py-1 text-xs font-medium"
                                                                                                animate={{ opacity: [0.8, 1, 0.8] }}
                                                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                                              >
                                                                                                In Progress
                                                                                              </Badge>                                                            </motion.div>
                                                          </SelectItem>
                                                          <SelectItem value="Completed">
                                                            <motion.div
                                                              whileHover={micro.hover}
                                                              whileTap={micro.tap}
                                                              transition={{ duration: 0.2, ease: "easeOut" }}
                                                            >
                                                                                              <Badge
                                                                                                className="bg-[rgba(27,180,91,0.15)] text-[#1BB45B] rounded-full px-3 py-1 text-xs font-medium"
                                                                                                animate={{ opacity: [0.8, 1, 0.8] }}
                                                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                                              >
                                                                                                Completed
                                                                                              </Badge>                                                            </motion.div>
                                                          </SelectItem>
                                                        </SelectContent>
                                                      </Select>                          </TableCell>
                          <TableCell className="text-text-main">{req.assignedCenter}</TableCell>
                        </motion.tr>
                      ))
                    ) : (
                                          <motion.tr
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            variants={item}
                                            transition={{ type: "spring", stiffness: 120, damping: 18 }}
                                          >                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          <div className="flex flex-col items-center justify-center">
                            <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                            No service requests found.
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ServiceQueue;
