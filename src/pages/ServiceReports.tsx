import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Uploader } from '@/components/ui/Uploader';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, FileText, Download, Filter, CalendarDays, Users, Plus, FileCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge, { JobStatus } from '@/components/ui/StatusBadge';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface ReportFile {
  preview: string;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  name: string;
  type?: string;
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
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      agentName: "Current Agent",
      submissionDate: new Date().toISOString().split('T')[0],
      status: "Pending",
      summary,
      attachments: uploadedFiles.map(file => ({ name: file.name, url: file.preview, type: file.type || 'application/octet-stream' })),
    };

    setReports(prev => [newReport, ...prev]);
    setRequestId('');
    setSummary('');
    setUploadedFiles([]);
    setIsFormOpen(false);

    toast({
      title: "Report Submitted!",
      description: (
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Service Reports</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Submit detailed reports for completed service requests and track their approval status.
          </p>
        </div>

        <Button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="relative z-10 btn-neon rounded-full px-6 py-6 text-lg shadow-lg shadow-emerald-500/20"
        >
          {isFormOpen ? 'Cancel Report' : <><Plus className="w-5 h-5 mr-2" /> New Report</>}
        </Button>
      </div>

      {/* Submit Report Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <AnimatedCard className="border-border bg-card backdrop-blur-md">
              <h2 className="text-xl font-semibold text-foreground mb-6 border-b border-border pb-4">Submit New Service Report</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="requestId" className="text-sm font-medium text-muted-foreground">Request ID</label>
                    <Input
                      id="requestId"
                      placeholder="e.g., SR001"
                      value={requestId}
                      onChange={(e) => setRequestId(e.target.value)}
                      className="bg-background/50 border-border focus:border-emerald-500/50 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Attachments</label>
                    <Uploader onFilesChange={setUploadedFiles} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="summary" className="text-sm font-medium text-muted-foreground">Service Summary</label>
                  <Textarea
                    id="summary"
                    placeholder="Describe the service performed, parts used, and any important notes..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    className="bg-background/50 border-border focus:border-emerald-500/50 min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="btn-neon px-8 rounded-full">
                    Submit Report
                  </Button>
                </div>
              </form>
            </AnimatedCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      <AnimatedCard className="border-border bg-card backdrop-blur-md p-0 overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20 flex flex-col md:flex-row gap-4 justify-between items-center">
          <h2 className="text-xl font-semibold text-foreground">Submitted Reports</h2>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <SearchBar
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-background/50 border-border"
            />
            <Select value={filterStatus} onValueChange={(value: ReportStatus | "All") => setFilterStatus(value)}>
              <SelectTrigger className="w-[160px] bg-background/50 border-border text-muted-foreground">
                <Filter className="h-4 w-4 mr-2 text-emerald-400" />
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-6 grid gap-4">
          <AnimatePresence mode="popLayout">
            {filteredReports.length === 0 ? (
              <div className="text-center text-muted-foreground p-8 bg-card rounded-xl border border-dashed border-border">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p>No reports found matching your criteria.</p>
              </div>
            ) : (
              filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-border bg-card hover:bg-accent transition-colors rounded-xl p-5 group"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-foreground">{report.requestId}</h3>
                        <span className="text-sm text-muted-foreground">• {report.submissionDate}</span>
                      </div>
                      <p className="text-sm text-emerald-400 font-medium mb-2">Agent: {report.agentName}</p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed bg-muted/20 p-3 rounded-lg border border-border">
                    {report.summary}
                  </p>

                  {report.attachments && report.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {report.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-xs font-medium"
                        >
                          <Download className="h-3 w-3" /> {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </AnimatedCard>
    </motion.div>
  );
};

export default ServiceReports;