import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Product } from '../../hooks/useConsumerDashboardData';
import { Package } from 'lucide-react'; // Import Package icon

interface RecentProductsCardProps {
  products: Product[];
  delay?: number;
}

const RecentProductsCard: React.FC<RecentProductsCardProps> = ({ products, delay = 0 }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 20px rgba(0,0,0,0.2), 0 0 30px rgba(34,197,94,0.15)",
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="col-span-full md:col-span-1 h-full rounded-2xl transition-all duration-300 ease-out"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <Package className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">Recent Products</h3>
        </div>
        {products.length > 0 ? (
          <ul className="space-y-3 flex-grow">
            {products.slice(-4).reverse().map((product, index) => (
              <li key={product.id} className={`flex items-center space-x-3 py-2 ${index < products.slice(-4).length - 1 ? 'border-b border-foreground/5' : ''}`}>
                <img src={product.product_image_url || 'https://placehold.co/600x400/0f1713/DBE9E0?text=No+Image'} alt={product.brand} className="w-10 h-10 rounded-md object-cover" />
                <div>
                  <p className="text-foreground/90 font-medium">{product.brand} ({product.model})</p>
                  <p className="text-foreground/70 text-sm">Warranty Expires: {new Date(product.warranty_expiry).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-center">
            <p className="text-foreground/70 mb-4">No products registered yet. Add one to see it here!</p>
            <Button 
              onClick={() => navigate('/products/new')} 
              size="sm"
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                         hover:translate-y-[-2px] transition-all duration-200 ease-out
                         shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            >
              Add your first product
            </Button>
          </div>
        )}
        {products.length > 0 && (
          <Button
            onClick={() => navigate('/products')}
            className="mt-6 px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full shadow-lg
                      hover:translate-y-[-2px] transition-all duration-200 ease-out
                      shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
          >
            View All Products
          </Button>
        )}
      </Card>
    </motion.div>
  );
}

export default RecentProductsCard;