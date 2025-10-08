import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Package, Users, Wrench, ListChecks, Boxes, BarChart3, LifeBuoy, Rocket, Zap } from 'lucide-react';
import { DashboardCard } from '@/components/custom/DashboardCard';

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'business_partner':
        return <Shield className="w-8 h-8 text-primary-foreground" />;
      case 'service_center':
        return <Wrench className="w-8 h-8 text-primary-foreground" />;
      default:
        return <Users className="w-8 h-8 text-primary-foreground" />;
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
    <div className="min-h-screen bg-gradient-to-b from-secondary via-background to-background">
      <main className="px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4 animate-fade-in-down">
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-primary rounded-full shadow-lg">
              {getRoleIcon(profile?.role)}
            </div>
            <h1 className="text-5xl font-bold text-foreground tracking-tight">
              {getRoleTitle(profile?.role)}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {getRoleDescription(profile?.role)}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {profile?.role === 'consumer' && (
              <>
                <Link to="/products">
                  <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">Product Vault</CardTitle>
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
                  <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                          <Wrench className="w-6 h-6 text-accent" />
                        </div>
                        <CardTitle className="text-xl">Service Requests</CardTitle>
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
                  <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                          <Shield className="w-6 h-6 text-success" />
                        </div>
                        <CardTitle className="text-xl">Warranty Tracker</CardTitle>
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
                <DashboardCard
                  title="Service Queue"
                  description="Manage incoming service requests and assign to service centers."
                  href="/service-queue"
                  icon={ListChecks}
                  kpi="42"
                  kpiLabel="Pending Requests"
                  colorClassName="bg-primary/10 text-primary border-primary/20"
                />
                <DashboardCard
                  title="Product Catalog"
                  description="Manage your product lineup and warranty policies."
                  href="/product-catalog"
                  icon={Boxes}
                  kpi="1,200+"
                  kpiLabel="Active Products"
                  colorClassName="bg-success/10 text-success border-success/20"
                />
                <DashboardCard
                  title="Analytics"
                  description="View service metrics, customer satisfaction, and ROI data."
                  href="/analytics"
                  icon={BarChart3}
                  kpi="89%"
                  kpiLabel="Customer Satisfaction"
                  colorClassName="bg-accent/10 text-accent border-accent/20"
                />
              </>
            )}

            {profile?.role === 'service_center' && (
              <>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <Zap className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">Active Jobs</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      View and manage your current service assignments.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <LifeBuoy className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Customer Communication</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Communicate directly with customers about service status.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-success" />
                      </div>
                      <CardTitle className="text-xl">Service Reports</CardTitle>
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
