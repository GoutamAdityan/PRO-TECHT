import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WarrantyStatusBadge } from '@/components/custom/WarrantyStatusBadge';

interface ProductWarrantyInfo {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  warranty_expiry: string;
  service_counts: {
    submitted?: number;
    in_progress?: number;
    completed?: number;
  };
}

const WarrantyTracker = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductWarrantyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchWarrantyData();
    }
  }, [user]);

  const fetchWarrantyData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_products_with_service_counts', {
        user_id_param: user.id,
      });

      if (error) {
        console.error('Error fetching warranty data:', error);
      } else {
        setProducts(data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - now.getTime();
    if (diff < 0) return null;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatus = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days === null) return 'expired';
    if (days <= 30) return 'expiring-soon';
    return 'active';
  };

  const filteredProducts = products
    .filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(filter.toLowerCase()))
    .filter(p => {
      if (statusFilter === 'all') return true;
      return getStatus(p.warranty_expiry) === statusFilter;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Warranty Tracker</CardTitle>
          <CardDescription>An overview of your product warranties and service history.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <Input
              placeholder="Filter by brand or model..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Warranty Status</TableHead>
                  <TableHead>Days to Expiry</TableHead>
                  <TableHead>Services (In Progress)</TableHead>
                  <TableHead>Services (Completed)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center">No products found.</TableCell></TableRow>
                ) : (
                  filteredProducts.map(p => {
                    const daysUntilExpiry = getDaysUntilExpiry(p.warranty_expiry);
                    return (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="font-medium">{p.brand} {p.model}</div>
                          <div className="text-sm text-muted-foreground">{p.serial_number}</div>
                        </TableCell>
                        <TableCell><WarrantyStatusBadge warrantyExpiry={p.warranty_expiry} /></TableCell>
                        <TableCell>{daysUntilExpiry !== null ? `${daysUntilExpiry} days` : '-'}</TableCell>
                        <TableCell>{p.service_counts?.in_progress || 0}</TableCell>
                        <TableCell>{p.service_counts?.completed || 0}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WarrantyTracker;