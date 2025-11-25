import { forwardRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { SoundToggle } from '@/components/SoundToggle';

const NavBar = forwardRef<HTMLElement>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const { playHoverSound } = useSound();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Hide navbar when scrolling down (and past 100px)
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      // Show navbar when scrolling up
      setHidden(false);
    }
  });

  return (
    <motion.nav
      ref={ref}
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-[999] py-4 px-8 bg-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" onMouseEnter={playHoverSound} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400 drop-shadow-[0_0_8px_rgba(0,204,102,0.6)] hover:drop-shadow-[0_0_12px_rgba(0,204,102,0.8)] transition-all duration-300">Pro-Techt</Link>
        <div className="hidden md:flex items-center space-x-6">
          <SoundToggle />

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Link to="/auth" onMouseEnter={playHoverSound} className="border border-foreground/20 text-foreground py-2 px-4 rounded-full hover:bg-green-700 hover:text-white hover:border-green-700 transition-colors duration-300">Login</Link>
            </motion.div>
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
          className="md:hidden mt-4 space-y-2"
        >

          <Link to="/auth" onMouseEnter={playHoverSound} className="block text-white text-center py-2">Login</Link>
          <div className="flex justify-center py-2">
            <SoundToggle />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
});

export default NavBar;
