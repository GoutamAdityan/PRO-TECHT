
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

  const handleStatusChange = (id: string, newStatus: ServiceRequestStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const filteredRequests = requests.filter(req =>
    req.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Service Queue</h1>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Warranty & Service Requests</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Filter by product or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Center</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.productName}</TableCell>
                  <TableCell>{req.customerName}</TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value: ServiceRequestStatus) => handleStatusChange(req.id, value)} defaultValue={req.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending"><Badge className='bg-yellow-500'>Pending</Badge></SelectItem>
                        <SelectItem value="In Progress"><Badge className='bg-blue-500'>In Progress</Badge></SelectItem>
                        <SelectItem value="Completed"><Badge className='bg-green-500'>Completed</Badge></SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{req.assignedCenter}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceQueue;
