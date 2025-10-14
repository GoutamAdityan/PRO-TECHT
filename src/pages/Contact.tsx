import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <main className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Mail className="w-16 h-16 mx-auto text-primary mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-heading">Contact Us</h1>
              <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-heading">Our Office</h2>
                  <p className="text-text">123 Tech Street, Your City, Your State 12345</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-heading">Email</h2>
                  <p className="text-text">contact@pro-techt.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h2 className="text-xl font-semibold text-heading">Phone</h2>
                  <p className="text-text">(123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
