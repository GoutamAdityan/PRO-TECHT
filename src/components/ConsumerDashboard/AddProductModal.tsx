import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Product } from '../../hooks/useConsumerDashboardData';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'thumbnail'>) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      name,
      brand,
      model,
      serialNumber,
      purchaseDate,
      warrantyExpiry,
    });
    // Clear form
    setName('');
    setBrand('');
    setModel('');
    setSerialNumber('');
    setPurchaseDate('');
    setWarrantyExpiry('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-labelledby="add-product-modal-title"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="bg-[rgba(18,26,22,0.8)] backdrop-blur-md border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 w-full max-w-md m-4"
          >
            <h2 id="add-product-modal-title" className="text-xl font-semibold text-white mb-6">Register New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="product-name" className="block text-gray-300 text-sm font-medium mb-1">Product Name</label>
                <input type="text" id="product-name" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="brand" className="block text-gray-300 text-sm font-medium mb-1">Brand</label>
                <input type="text" id="brand" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={brand} onChange={(e) => setBrand(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="model" className="block text-gray-300 text-sm font-medium mb-1">Model</label>
                <input type="text" id="model" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>
              <div>
                <label htmlFor="serial" className="block text-gray-300 text-sm font-medium mb-1">Serial Number</label>
                <input type="text" id="serial" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} />
              </div>
              <div>
                <label htmlFor="purchase-date" className="block text-gray-300 text-sm font-medium mb-1">Purchase Date</label>
                <input type="date" id="purchase-date" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="warranty-expiry" className="block text-gray-300 text-sm font-medium mb-1">Warranty Expiry</label>
                <input type="date" id="warranty-expiry" className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:ring-green-500 focus:border-green-500" value={warrantyExpiry} onChange={(e) => setWarrantyExpiry(e.target.value)} />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <Button type="button" onClick={onClose} className="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition-colors">
                  Cancel
                </Button>
                <Button type="submit" className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors">
                  Register
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddProductModal;
