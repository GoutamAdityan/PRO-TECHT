import { motion } from 'framer-motion';
import { Shield, Package, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-12"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden py-20 text-center bg-gradient-to-br from-primary/10 via-background to-background rounded-b-3xl shadow-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"
        ></motion.div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-5xl md:text-6xl font-heading font-bold text-foreground tracking-tight mb-4"
          >
            Welcome to ServiceBridge
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            The Future of Product Care and Service Management. Seamlessly connecting every link in the product lifecycle chain.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex justify-center"
          >
            <Shield className="h-16 w-16 text-primary opacity-70" />
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Our Mission */}
        <motion.div variants={itemVariants}>
          <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50 p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading font-bold mb-4">Our Mission</CardTitle>
              <CardDescription className="text-xl text-muted-foreground">
                To empower product owners and creators with a centralized, intelligent platform that simplifies service management, enhances product value, and fosters lasting relationships built on trust and exceptional care.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* For Every Role, A Revolution */}
        <motion.div variants={containerVariants}>
          <motion.h2 variants={itemVariants} className="text-3xl font-heading font-bold text-center pt-4 mb-8">For Every Role, A Revolution</motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50 p-6 hover:shadow-lg transition-shadow duration-300" whileHover={{ scale: 1.02, y: -5 }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-heading">For Consumers</CardTitle>
                  </div>
                  <CardDescription>Your Personal Product Hub</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">
                    Say goodbye to lost receipts and warranty cards. With your personal <strong>Product Vault</strong>, you can effortlessly store all your product information, track warranty periods, and initiate service requests in seconds. Experience product ownership without the hassle.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50 p-6 hover:shadow-lg transition-shadow duration-300" whileHover={{ scale: 1.02, y: -5 }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-heading">For Business Partners</CardTitle>
                  </div>
                  <CardDescription>Command Your Brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">
                    Gain a competitive edge with a complete overview of your product ecosystem. Manage your entire <strong>Product Catalog</strong>, oversee your service network, and access powerful <strong>Analytics</strong> to drive customer satisfaction and inform future product development. Elevate your brand's promise of quality and support.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-card/50 backdrop-blur-sm shadow-md border border-border/50 p-6 hover:shadow-lg transition-shadow duration-300" whileHover={{ scale: 1.02, y: -5 }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Wrench className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl font-heading">For Service Centers</CardTitle>
                  </div>
                  <CardDescription>Streamline Your Workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-relaxed">
                    Focus on what you do best: providing expert service. Receive and manage jobs through a clear and organized <strong>Service Queue</strong>. Communicate directly with customers and partners, and simplify your reporting. We handle the logistics, so you can handle the repairs.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* The ServiceBridge Difference */}
        <motion.div variants={itemVariants} className="text-center pt-8">
          <h2 className="text-3xl font-heading font-bold">The ServiceBridge Difference</h2>
          <p className="text-xl text-muted-foreground mt-2">
            Join us in building a world where every product is backed by a seamless service experience.
          </p>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default About;