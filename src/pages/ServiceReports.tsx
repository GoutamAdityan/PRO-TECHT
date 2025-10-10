import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ServiceReports = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Service report submitted successfully.",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Service Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Submit Service Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Request ID" />
            <Textarea placeholder="Service details and summary..." />
            <Input type="file" />
            <Button type="submit">Submit Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceReports;