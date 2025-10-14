import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
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
              <FileText className="w-16 h-16 mx-auto text-primary mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-heading">Terms of Service</h1>
              <p className="text-lg text-muted-foreground mt-2">Last updated: October 14, 2025</p>
            </div>

            <div className="space-y-8 text-text">
              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">1. Agreement to Terms</h2>
                <p>
                  By using our application, you agree to be bound by these Terms of Service. If you do not agree to these Terms, do not use the application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">2. Changes to Terms or Services</h2>
                <p>
                  We may modify the Terms at any time, in our sole discretion. If we do so, we’ll let you know either by posting the modified Terms on the Site or through other communications. It’s important that you review the Terms whenever we modify them because if you continue to use the Services after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">3. Who May Use the Services</h2>
                <p>
                  You may use the Services only if you are 18 years or older and are not barred from using the Services under applicable law.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">4. Content and Content Rights</h2>
                <p>
                  For purposes of these Terms, “Content” means text, graphics, images, music, software, audio, video, works of authorship of any kind, and information or other materials that are posted, generated, provided or otherwise made available through the Services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">5. General Prohibitions</h2>
                <p>
                  You agree not to do any of the following:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2">
                  <li>Post, upload, publish, submit or transmit any Content that: (i) infringes, misappropriates or violates a third party’s patent, copyright, trademark, trade secret, moral rights or other intellectual property rights, or rights of publicity or privacy; (ii) violates, or encourages any conduct that would violate, any applicable law or regulation or would give rise to civil liability; (iii) is fraudulent, false, misleading or deceptive; (iv) is defamatory, obscene, pornographic, vulgar or offensive; (v) promotes discrimination, bigotry, racism, hatred, harassment or harm against any individual or group; (vi) is violent or threatening or promotes violence or actions that are threatening to any person or entity; or (vii) promotes illegal or harmful activities or substances.</li>
                  <li>Use, display, mirror or frame the Services or any individual element within the Services, Pro-Techt’s name, any Pro-Techt trademark, logo or other proprietary information, or the layout and design of any page or form contained on a page, without Pro-Techt’s express written consent;</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-heading mb-4">6. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at: terms@pro-techt.com.
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

export default TermsOfService;
