import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, Users, Wrench } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return <Shield className="w-6 h-6" />;
      case 'service_center':
        return <Wrench className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  const getRoleTitle = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return 'Business Partner Dashboard';
      case 'service_center':
        return 'Service Center Portal';
      default:
        return 'Consumer Dashboard';
    }
  };

  const getRoleDescription = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return 'Manage your products, service network, and customer support operations.';
      case 'service_center':
        return 'View assigned service requests and manage repair operations.';
      default:
        return 'Track your products, warranties, and service requests.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary rounded-xl">
              {getRoleIcon(profile?.role)}
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              {getRoleTitle(profile?.role)}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {getRoleDescription(profile?.role)}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {profile?.role === 'consumer' && (
              <>
                <Link to="/products">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Product Vault</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Manage your products, warranties, and documentation in one place.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/service-requests">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Wrench className="w-5 h-5 text-warning" />
                        </div>
                        <CardTitle className="text-lg">Service Requests</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Book services, track repairs, and communicate with service centers.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/warranty-tracker">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-success" />
                        </div>
                        <CardTitle className="text-lg">Warranty Tracker</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Monitor warranty status and receive expiration notifications.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}

            {profile?.role === 'business_partner' && (
              <>
                <Link to="/service-queue">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Service Queue</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Manage incoming service requests and assign to service centers.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/product-catalog">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-success" />
                        </div>
                        <CardTitle className="text-lg">Product Catalog</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Manage your product lineup and warranty policies.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/analytics">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-warning" />
                        </div>
                        <CardTitle className="text-lg">Analytics</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        View service metrics, customer satisfaction, and ROI data.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}

            {profile?.role === 'service_center' && (
              <>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-warning" />
                      </div>
                      <CardTitle className="text-lg">Active Jobs</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      View and manage your current service assignments.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Customer Communication</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Communicate directly with customers about service status.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-success" />
                      </div>
                      <CardTitle className="text-lg">Service Reports</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Submit completion reports and service documentation.
                    </CardDescription>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
