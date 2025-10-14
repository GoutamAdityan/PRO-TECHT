import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
  id: string;
  brand: string;
  model: string;
}

interface ProductDropdownProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
}

export const ProductDropdown = ({ products, value, onChange }: ProductDropdownProps) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a product..." />
      </SelectTrigger>
      <SelectContent>
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id}>
            {product.brand} - {product.model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
