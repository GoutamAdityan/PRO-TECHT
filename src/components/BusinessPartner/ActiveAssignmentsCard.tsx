import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ActiveAssignmentsCardProps {
  count: number;
}

export const ActiveAssignmentsCard = ({ count }: ActiveAssignmentsCardProps) => {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{count}</div>
          <p className="text-xs text-muted-foreground">jobs currently in progress</p>
          <Button asChild className="mt-4">
            <Link to="/active-jobs">View Assignments</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
