const About = () => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-primary tracking-tight">Welcome to ServiceBridge</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          The Future of Product Care and Service Management. Seamlessly connecting every link in the product lifecycle chain.
        </p>
      </div>

      <div className="space-y-6 text-lg">
        <p className="leading-relaxed">
          In today's fast-paced world, managing product warranties, repairs, and service requests can be a fragmented and frustrating experience. ServiceBridge was born from a simple yet powerful idea: to create a unified ecosystem where consumers, businesses, and service professionals can connect with ease and transparency. We are dedicated to transforming the post-purchase experience, making it as smooth and satisfying as the purchase itself.
        </p>

        <div className="p-6 bg-secondary/50 rounded-xl">
          <h2 className="text-3xl font-bold text-center mb-4">Our Mission</h2>
          <p className="text-center text-xl text-muted-foreground">
            To empower product owners and creators with a centralized, intelligent platform that simplifies service management, enhances product value, and fosters lasting relationships built on trust and exceptional care.
          </p>
        </div>

        <h2 className="text-3xl font-bold pt-4">For Every Role, A Revolution</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-2">For Consumers: Your Personal Product Hub</h3>
            <p>
              Say goodbye to lost receipts and warranty cards. With your personal <strong>Product Vault</strong>, you can effortlessly store all your product information, track warranty periods, and initiate service requests in seconds. Experience product ownership without the hassle.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-2">For Business Partners: Command Your Brand</h3>
            <p>
              Gain a competitive edge with a complete overview of your product ecosystem. Manage your entire <strong>Product Catalog</strong>, oversee your service network, and access powerful <strong>Analytics</strong> to drive customer satisfaction and inform future product development. Elevate your brand's promise of quality and support.
            </p>
          </div>
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold mb-2">For Service Centers: Streamline Your Workflow</h3>
            <p>
              Focus on what you do best: providing expert service. Receive and manage jobs through a clear and organized <strong>Service Queue</strong>. Communicate directly with customers and partners, and simplify your reporting. We handle the logistics, so you can handle the repairs.
            </p>
          </div>
        </div>

        <div className="text-center pt-8">
          <h2 className="text-3xl font-bold">The ServiceBridge Difference</h2>
          <p className="text-xl text-muted-foreground mt-2">
            Join us in building a world where every product is backed by a seamless service experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
