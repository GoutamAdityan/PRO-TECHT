import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroIllustration from '@/components/HeroIllustration';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';

const HomePage = () => {
  const navbarRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const targetId = href.replace(/.*#/, "");
    const elem = document.getElementById(targetId);
    elem?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-bg min-h-screen text-white overflow-x-hidden">
      <NavBar ref={navbarRef} />
      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen text-center flex flex-col items-center justify-center relative"
          style={{ minHeight: `calc(100vh - ${navbarHeight}px)` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroIllustration />
          <h1 className="text-4xl md:text-6xl font-bold text-heading mb-4 -mt-12 md:-mt-20 relative z-10">Manage warranties & service requests — in one calm place.</h1>
          <p className="text-lg md:text-xl text-text max-w-2xl mx-auto mb-8 relative z-10">Track, protect, and get help for your devices. Quick setup, smart reminders.</p>
          <div className="flex space-x-4 relative z-10">
            <Link to="/auth" className="bg-accent text-black py-3 px-6 rounded-full font-semibold hover:bg-opacity-80 transition-colors duration-300 flex items-center">Get Started <ArrowRight className="ml-2" /></Link>
            <a href="#features" onClick={handleScroll} className="bg-gray-800 text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-700 transition-colors duration-300">Learn More</a>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="mt-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-heading mb-12">Why you'll love ServiceBridge</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck size={32} />} 
              title="Centralized Tracking" 
              description="Keep all your warranties in one place, never lose a proof of purchase again."
            />
            <FeatureCard 
              icon={<Clock size={32} />} 
              title="Smart Reminders" 
              description="Get notified before a warranty expires, so you can take action in time."
            />
            <FeatureCard 
              icon={<Zap size={32} />} 
              title="Effortless Service" 
              description="Initiate service requests directly from the app with just a few clicks."
            />
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-heading mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
            <div className="flex flex-col items-center">
              <motion.div className="w-16 h-16 bg-card-bg rounded-full flex items-center justify-center text-accent text-2xl font-bold border-2 border-accent mb-4" whileHover={{ scale: 1.1 }}>1</motion.div>
              <h3 className="text-xl font-bold text-heading">Add Products</h3>
              <p className="text-text max-w-xs">Upload receipts and warranty details for your devices.</p>
            </div>
            <div className="flex flex-col items-center">
              <motion.div className="w-16 h-16 bg-card-bg rounded-full flex items-center justify-center text-accent text-2xl font-bold border-2 border-accent mb-4" whileHover={{ scale: 1.1 }}>2</motion.div>
              <h3 className="text-xl font-bold text-heading">Get Reminders</h3>
              <p className="text-text max-w-xs">Receive alerts for expiring warranties and maintenance.</p>
            </div>
            <div className="flex flex-col items-center">
              <motion.div className="w-16 h-16 bg-card-bg rounded-full flex items-center justify-center text-accent text-2xl font-bold border-2 border-accent mb-4" whileHover={{ scale: 1.1 }}>3</motion.div>
              <h3 className="text-xl font-bold text-heading">Request Service</h3>
              <p className="text-text max-w-xs">Easily start a service request when things go wrong.</p>
            </div>
          </div>
        </motion.section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
