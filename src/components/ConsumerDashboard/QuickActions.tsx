import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PlusCircle, Wrench, ShieldCheck } from 'lucide-react';

interface QuickActionsProps {
  onAddProduct: () => void;
  delay?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAddProduct, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay: delay, ease: "easeOut" }}
    whileHover={{ translateY: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    className="col-span-full md:col-span-1 h-full"
  >
    <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5 h-full">
      <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-3">
        <motion.div
          whileHover={{
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)", // Green glow
            transition: { duration: 0.3 }
          }}
          className="rounded-full"
        >
          <Button
            onClick={onAddProduct}
            className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Register New Product
          </Button>
        </motion.div>
        <motion.div
          whileHover={{
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)", // Green glow
            transition: { duration: 0.3 }
          }}
          className="rounded-full"
        >
          <Button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center">
            <Wrench className="mr-2 h-5 w-5" /> Request Service
          </Button>
        </motion.div>
        <motion.div
          whileHover={{
            boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)", // Green glow
            transition: { duration: 0.3 }
          }}
          className="rounded-full"
        >
          <Button className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center">
            <ShieldCheck className="mr-2 h-5 w-5" /> View Warranty Tracker
          </Button>
        </motion.div>
      </div>
    </Card>
  </motion.div>
);

export default QuickActions;