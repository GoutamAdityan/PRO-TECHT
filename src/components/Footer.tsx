import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-transparent text-text py-8 mt-16">
      <div className="container mx-auto flex justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} ServiceBridge. All rights reserved.</p>
        <div className="flex space-x-4">
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <Link to="/privacy" className="hover:text-white">Privacy</Link>
          <Link to="/terms" className="hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
