import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Wrench, Calendar, DollarSign, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  };
}

const ServiceRequests = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchServiceRequests();
    }
  }, [user]);

  const fetchServiceRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('service_requests')
        .select(`
          *,
          products (brand, model),
          service_centers (name, phone)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service requests:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service requests',
          variant: 'destructive',
        });
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load service requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            Service Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your product repairs and service appointments
          </p>
        </div>
        <Button asChild>
          <Link to="/service-requests/new">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Link>
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wrench className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="mb-2">No Service Requests Yet</CardTitle>
            <CardDescription className="mb-6">
              Create your first service request when you need repair or maintenance
            </CardDescription>
            <Button asChild>
              <Link to="/service-requests/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Service Request
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {request.products.brand} {request.products.model}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {request.issue_description.length > 80
                        ? `${request.issue_description.substring(0, 80)}...`
                        : request.issue_description}
                    </CardDescription>
                  </div>
                  {getStatusBadge(request)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.service_centers && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Service Center:</span>{' '}
                    <span className="font-medium">{request.service_centers.name}</span>
                    {request.service_centers.phone && (
                      <span className="text-muted-foreground ml-2">
                        • {request.service_centers.phone}
                      </span>
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

                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/service-requests/${request.id}`}>
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;