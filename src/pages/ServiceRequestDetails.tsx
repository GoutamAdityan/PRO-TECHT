import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, FileText, Phone, Mail } from "lucide-react";

interface ServiceRequest {
  id: string;
  issue_description: string;
  appointment_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: string;
  products: {
    brand: string;
    model: string;
  };
  service_centers?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

const ServiceRequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      const fetchServiceRequest = async () => {
        try {
          const { data, error } = await supabase
            .from("service_requests")
            .select(`
              *,
              products (brand, model),
              service_centers (name, phone, email)
            `)
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching service request:", error);
            toast({
              title: "Error",
              description: "Failed to load service request details",
              variant: "destructive",
            });
            navigate("/service-requests");
          } else {
            setRequest(data);
          }
        } catch (error) {
          console.error("Error:", error);
          toast({
            title: "Error",
            description: "Failed to load service request details",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchServiceRequest();
    }
  }, [user, id, toast, navigate]);

  const getStatusBadge = (request: ServiceRequest) => {
    if (!request.service_centers) {
      return <Badge variant="outline">Pending Assignment</Badge>;
    }
    if (!request.appointment_date) {
      return <Badge variant="secondary">Assigned</Badge>;
    }
    if (request.actual_cost !== null) {
      return <Badge variant="outline" className="border-success text-success">Completed</Badge>;
    }
    return <Badge variant="outline" className="border-warning text-warning">In Progress</Badge>;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!request) {
    return <div>Service request not found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">Service Request for {request.products.brand} {request.products.model}</CardTitle>
            <CardDescription className="mt-1">{request.issue_description}</CardDescription>
          </div>
          {getStatusBadge(request)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {request.service_centers && (
          <div className="text-sm">
            <span className="text-muted-foreground">Service Center:</span>{' '}
            <span className="font-medium">{request.service_centers.name}</span>
            {request.service_centers.phone && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>{request.service_centers.phone}</span>
              </div>
            )}
            {request.service_centers.email && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{request.service_centers.email}</span>
              </div>
            )}
          </div>
        )}

        {request.appointment_date && (
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Appointment:</span>
            <span>{new Date(request.appointment_date).toLocaleString()}</span>
          </div>
        )}

        {(request.estimated_cost || request.actual_cost) && (
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            {request.actual_cost ? (
              <span>Final Cost: <span className="font-medium">${request.actual_cost}</span></span>
            ) : (
              <span>Estimated: <span className="font-medium">${request.estimated_cost}</span></span>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <span>Created:</span>{' '}
          {new Date(request.created_at).toLocaleDateString()}
        </div>

        {request.notes && (
          <div className="text-sm">
            <span className="text-muted-foreground">Notes:</span>{' '}
            <span>{request.notes}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceRequestDetails;
