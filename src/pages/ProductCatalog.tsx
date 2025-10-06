
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

// TypeScript Types
type Product = {
  id: string;
  name: string;
  modelNumber: string;
  warrantyLength: string;
  description: string;
};

// Dummy Data
const dummyProducts: Product[] = [
  {
    id: "PROD001",
    name: "Laptop Pro X",
    modelNumber: "LPX-2025",
    warrantyLength: "2 years",
    description: "High-performance laptop for professionals.",
  },
  {
    id: "PROD002",
    name: "Smartphone Z",
    modelNumber: "SPZ-2025",
    warrantyLength: "1 year",
    description: "Latest generation smartphone with AI features.",
  },
  {
    id: "PROD003",
    name: "Wireless Headphones",
    modelNumber: "WH-1000",
    warrantyLength: "18 months",
    description: "Noise-cancelling over-ear headphones.",
  },
];

const ProductCatalog = () => {
  const [products, setProducts] = useState<Product[]>(dummyProducts);

  // TODO: Implement add, edit, and delete functionality

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Catalog</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Managed Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Model Number</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.modelNumber}</TableCell>
                  <TableCell>{product.warrantyLength}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCatalog;
