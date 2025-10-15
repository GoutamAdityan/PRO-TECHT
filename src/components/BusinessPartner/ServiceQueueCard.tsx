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
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <Card variant="app">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-muted-foreground">Pending Service Requests</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{count}</div>
          <p className="text-xs text-muted-foreground">requests awaiting assignment</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
