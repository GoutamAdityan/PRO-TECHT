import { Badge } from "@/components/ui/badge";

interface WarrantyStatusBadgeProps {
  warrantyExpiry: string | Date;
}

export function WarrantyStatusBadge({ warrantyExpiry }: WarrantyStatusBadgeProps) {
  const now = new Date();
  const expiryDate = new Date(warrantyExpiry);
  const timeDiff = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  let status: "Active" | "Expiring Soon" | "Expired";
  let variant: "default" | "secondary" | "destructive";

  if (daysRemaining < 0) {
    status = "Expired";
    variant = "destructive";
  } else if (daysRemaining <= 30) {
    status = "Expiring Soon";
    variant = "secondary";
  } else {
    status = "Active";
    variant = "default";
  }

  return (
    <Badge variant={variant}>{status}</Badge>
  );
}
