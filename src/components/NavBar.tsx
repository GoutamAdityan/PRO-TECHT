import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NavBar = forwardRef<HTMLElement>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      ref={ref}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 py-4 px-8 bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border-b border-gray-800"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">ServiceBridge</Link>
        <div className="hidden md:flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Link to="/auth" className="bg-accent text-black py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">Login</Link>
          </motion.div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden mt-4"
        >
          <Link to="/auth" className="block text-white text-center py-2">Login</Link>
        </motion.div>
      )}
    </motion.nav>
  );
});

export default NavBar;
