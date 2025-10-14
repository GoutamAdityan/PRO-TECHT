import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Uploader } from '@/components/ui/Uploader';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle, FileText, Download, Filter, CalendarDays, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import { containerVariants, cardVariants, cardHoverVariants, headerIconVariants, rowVariants } from '@/lib/animations';

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

const DUMMY_REPORTS: ServiceReport[] = [
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
  {
    id: "REP003",
    requestId: "SR005",
    agentName: "Agent Jane",
    submissionDate: "2025-09-28",
    status: "Rejected",
    summary: "Customer provided incorrect product details. Request denied.",
    attachments: [],
  },
];

const ServiceReports = () => {
  const { toast } = useToast();
  const [requestId, setRequestId] = useState('');
  const [summary, setSummary] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<ReportFile[]>([]);
  const [reports, setReports] = useState<ServiceReport[]>(DUMMY_REPORTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "All">("All");
  const shouldReduceMotion = useReducedMotion();

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
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Service Reports</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Submit and manage service reports for completed requests.
        </motion.p>

        {/* Submit Report Form */}
        <motion.div
          variants={cardAnimation}
          initial="hidden"
          animate="show"
          exit="exit"
          whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
          className="rounded-2xl transition-all duration-300 ease-out
                     shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] mb-8"
        >
          <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 flex flex-col h-full">
            <CardHeader className="px-0 pt-0 pb-4">
              <CardTitle className="text-xl font-semibold text-foreground/90">Submit New Service Report</CardTitle>
              <CardDescription className="text-foreground/70">Fill out the details for a completed service request.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 flex-grow">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="requestId" className="text-sm font-medium leading-none text-foreground/90">Request ID</label>
                    <Input
                      id="requestId"
                      placeholder="e.g., SR001"
                      value={requestId}
                      onChange={(e) => setRequestId(e.target.value)}
                      className="mt-1 h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                      aria-label="Request ID"
                    />
                    {!requestId.trim() && <p className="text-xs text-destructive mt-1">Request ID is required.</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="summary" className="text-sm font-medium leading-none text-foreground/90">Service Summary</label>
                  <Textarea
                    id="summary"
                    placeholder="Describe the service performed and any findings..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={5}
                    className="mt-1 rounded-lg bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                    aria-label="Service Summary"
                  />
                  {!summary.trim() && <p className="text-xs text-destructive mt-1">Service summary is required.</p>}
                </div>
                <div>
                  <label className="text-sm font-medium leading-none text-foreground/90">Attachments</label>
                  <Uploader onFilesChange={setUploadedFiles} />
                </div>
                <Button type="submit" className="w-full px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                                           hover:translate-y-[-2px] transition-all duration-200 ease-out
                                           shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                        aria-label="Submit Report">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reports List */}
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
              <CardTitle className="text-xl font-semibold text-foreground/90">Submitted Reports</CardTitle>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <SearchBar
                  placeholder="Search by Request ID, agent, or summary..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search reports"
                />
                <Select value={filterStatus} onValueChange={(value: ReportStatus | "All") => setFilterStatus(value)}>
                  <SelectTrigger className="w-[180px] h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0">
                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/90 backdrop-blur-sm border-border/50">
                    <SelectItem value="All">All Statuses</SelectItem>
                    <SelectItem value="Pending">
                      <StatusBadge status="Pending" />
                    </SelectItem>
                    <SelectItem value="Approved">
                      <StatusBadge status="Approved" />
                    </SelectItem>
                    <SelectItem value="Rejected">
                      <StatusBadge status="Rejected" />
                    </SelectItem>
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
              <div className="grid gap-4">
                {filteredReports.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">No reports found.</div>
                ) : (
                  filteredReports.map((report) => (
                    <motion.div
                      key={report.id}
                      variants={shouldReduceMotion ? { opacity: 1 } : rowVariants}
                      initial="hidden"
                      animate="show"
                      whileHover={shouldReduceMotion ? {} : { scale: 1.01, transition: { duration: 0.12 } }}
                      className="border-b border-foreground/5 hover:bg-muted/20 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground/90">Report for Request ID: {report.requestId}</h3>
                          <p className="text-sm text-muted-foreground">Submitted by {report.agentName} on {report.submissionDate}</p>
                        </div>
                        <StatusBadge status={report.status} />
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
      </motion.div>
    </PageTransition>
  );
};

export default ServiceReports;