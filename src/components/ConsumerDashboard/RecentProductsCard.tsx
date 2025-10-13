import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Product } from '../../hooks/useConsumerDashboardData';

interface RecentProductsCardProps {
  products: Product[];
  delay?: number;
}

const RecentProductsCard: React.FC<RecentProductsCardProps> = ({ products, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, delay: delay, ease: "easeOut" }}
    whileHover={{ translateY: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
    className="col-span-full md:col-span-1 h-full"
  >
    <Card className="bg-[rgba(18,26,22,0.45)] backdrop-blur-sm border border-[rgba(255,255,255,0.03)] rounded-2xl p-5 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-200 mb-4">Recent Products</h3>
      {products.length > 0 ? (
        <ul className="space-y-3 flex-grow">
          {products.slice(-4).reverse().map((product) => ( // Display last 4 products, newest first
            <li key={product.id} className="flex items-center space-x-3">
              <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
              <div>
                <p className="text-gray-100 font-medium">{product.name} ({product.model})</p>
                <p className="text-gray-400 text-sm">Warranty: {product.warrantyExpiry}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 flex-grow">No products registered yet. Register one to see it here!</p>
      )}
      <Button className="mt-6 px-4 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
        View All Products
      </Button>
    </Card>
  </motion.div>
);

export default RecentProductsCard;