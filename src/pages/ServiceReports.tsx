import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Uploader } from '@/components/ui/Uploader';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, Download, Filter, CalendarDays, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportFile {
  preview: string;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  name: string;
}

type ReportStatus = "Pending" | "Approved" | "Rejected";

interface ServiceReport {
  id: string;
  requestId: string;
  agentName: string;
  submissionDate: string;
  status: ReportStatus;
  summary: string;
  attachments: { name: string; url: string; type: string }[];
}

const dummyReports: ServiceReport[] = [
  {
    id: "REP001",
    requestId: "SR002",
    agentName: "Agent Sarah",
    submissionDate: "2025-10-05",
    status: "Approved",
    summary: "Replaced faulty display on Smartphone Z. Customer satisfied.",
    attachments: [{ name: "report_001.pdf", url: "#", type: "application/pdf" }],
  },
  {
    id: "REP002",
    requestId: "SR003",
    agentName: "Agent John",
    submissionDate: "2025-10-01",
    status: "Pending",
    summary: "Routine maintenance for Robotic Vacuum Cleaner Pro.",
    attachments: [{ name: "photos_002.zip", url: "#", type: "application/zip" }],
  },
];

const getReportStatusBadgeClass = (status: ReportStatus) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
    case "Approved":
      return "bg-green-500/20 text-green-700 border-green-500/30";
    case "Rejected":
      return "bg-red-500/20 text-red-700 border-red-500/30";
    default:
      return "bg-gray-500/20 text-gray-700 border-gray-500/30";
  }
};

const ServiceReports = () => {
  const { toast } = useToast();
  const [requestId, setRequestId] = useState('');
  const [summary, setSummary] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<ReportFile[]>([]);
  const [reports, setReports] = useState<ServiceReport[]>(dummyReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "All">("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!requestId.trim() || !summary.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newReport: ServiceReport = {
      id: `REP${Date.now()}`,
      requestId,
      agentName: "Current Agent", // Placeholder
      submissionDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      summary,
      attachments: uploadedFiles.map(file => ({ name: file.name, url: file.preview, type: file.type || 'application/octet-stream' })),
    };

    setReports(prev => [newReport, ...prev]);
    setRequestId('');
    setSummary('');
    setUploadedFiles([]);

    toast({
      title: "Report Submitted!",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <span>Your service report has been submitted successfully.</span>
        </div>
      ),
      duration: 3000,
    });
  };

  const filteredReports = reports.filter(report =>
    (report.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.summary.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "All" || report.status === filterStatus)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8"
    >
      <h1 className="text-3xl font-bold font-heading">Service Reports</h1>

      {/* Submit Report Form */}
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="font-heading">Submit New Service Report</CardTitle>
          <CardDescription>Fill out the details for a completed service request.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="requestId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Request ID</label>
                <Input
                  id="requestId"
                  placeholder="e.g., SR001"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
                />
                {!requestId.trim() && <p className="text-xs text-destructive mt-1">Request ID is required.</p>}
              </div>
              {/* Add more fields here if needed, e.g., Agent Name, Date */}
            </div>
            <div>
              <label htmlFor="summary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Service Summary</label>
              <Textarea
                id="summary"
                placeholder="Describe the service performed and any findings..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                className="mt-1 bg-background/50 border-border/50 focus-visible:ring-primary"
              />
              {!summary.trim() && <p className="text-xs text-destructive mt-1">Service summary is required.</p>}
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Attachments</label>
              <Uploader onFilesChange={setUploadedFiles} />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Submit Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50">
        <CardHeader>
          <CardTitle className="font-heading">Submitted Reports</CardTitle>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Request ID, agent, or summary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary"
              />
            </div>
            <Select value={filterStatus} onValueChange={(value: ReportStatus | "All") => setFilterStatus(value)}>
              <SelectTrigger className="w-[180px] bg-background/50 border-border/50 focus-visible:ring-primary">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-background/50 border-border/50 hover:bg-accent/10 hover:text-accent-foreground">
              <CalendarDays className="h-4 w-4 mr-2" /> Date Range
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {filteredReports.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">No reports found.</div>
            ) : (
              filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.005, boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}
                  className="bg-card/50 backdrop-blur-sm shadow-sm border border-border/50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg font-heading">Report for Request ID: {report.requestId}</h3>
                      <p className="text-sm text-muted-foreground">Submitted by {report.agentName} on {report.submissionDate}</p>
                    </div>
                    <Badge className={cn("shadow-sm", getReportStatusBadgeClass(report.status))}>{report.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{report.summary}</p>
                  {report.attachments && report.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {report.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline hover:text-primary/80 transition-colors"
                        >
                          <Download className="h-3 w-3" /> {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ServiceReports;
