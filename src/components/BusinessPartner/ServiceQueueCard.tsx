import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ServiceQueueCardProps {
  count: number;
}

export const ServiceQueueCard = ({ count }: ServiceQueueCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Service Requests</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">requests awaiting assignment</p>
          <Button asChild className="mt-4">
            <Link to="/service-queue">Open Queue</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
