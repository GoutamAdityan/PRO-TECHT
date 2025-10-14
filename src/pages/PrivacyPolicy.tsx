import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
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
              <Shield className="w-16 h-16 mx-auto text-primary mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-heading">Privacy Policy</h1>
              <p className="text-lg text-muted-foreground mt-2">Last updated: October 14, 2025</p>
            </div>

            <div className="space-y-8 text-text">
              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">1. Introduction</h2>
                <p>
                  Welcome to Pro-Techt ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">2. Information We Collect</h2>
                <p>
                  We may collect information about you in a variety of ways. The information we may collect via the Application includes:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>
                    <strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily give to us when you register with the Application.
                  </li>
                  <li>
                    <strong>Product Information:</strong> Information about your products, including purchase date, warranty details, and service history, that you provide to us.
                  </li>
                  <li>
                    <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Application, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Application.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">3. Use of Your Information</h2>
                <p>
                  Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Create and manage your account.</li>
                  <li>Email you regarding your account or order.</li>
                  <li>Notify you of updates to your warranties and services.</li>
                  <li>Monitor and analyze usage and trends to improve your experience with the Application.</li>
                  <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                  <li>Request feedback and contact you about your use of the Application.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">4. Disclosure of Your Information</h2>
                <p>
                  We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>
                    <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                  </li>
                  <li>
                    <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">5. Security of Your Information</h2>
                <p>
                  We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">6. Contact Us</h2>
                <p>
                  If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <p className="mt-2">
                  Pro-Techt Inc.<br />
                  123 Tech Street<br />
                  Your City, Your State 12345<br />
                  Email: privacy@pro-techt.com
                </p>
              </section>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
