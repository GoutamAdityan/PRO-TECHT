import { AppCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const RecentRequestsCard = () => {
  return (
    <motion.div whileHover={{ y: -6, boxShadow: '0 14px 40px rgba(0,0,0,0.48)' }} whileTap={{ scale: 0.98 }}>
      <AppCard>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for recent requests list */}
          <div className="text-muted-text">No recent requests.</div>
          <Button variant="primary" size="pill" className="mt-4">View All Requests</Button>
        </CardContent>
      </AppCard>
    </motion.div>
  );
};
