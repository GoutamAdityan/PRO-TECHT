import { AppCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ActiveAssignmentsCardProps {
  count: number;
}

export const ActiveAssignmentsCard = ({ count }: ActiveAssignmentsCardProps) => {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <AppCard>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-muted-text">Active Assignments</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-text" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text-main">{count}</div>
          <p className="text-xs text-muted-text">jobs currently in progress</p>
          <Button asChild variant="primary" size="pill" className="mt-4">
            <Link to="/active-jobs">View Assignments</Link>
          </Button>
        </CardContent>
      </AppCard>
    </motion.div>
  );
};
