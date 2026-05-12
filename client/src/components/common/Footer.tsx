import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Globe, Send, Briefcase, Video, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-200 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-8 h-8 text-primary-500" />
              <span className="text-xl font-bold text-white">Smart-Kissan</span>
            </div>
            <p className="text-sm mb-4">
              Smart Farming. Better Future. Digital bridge between Farmers, Buyers & Transporters.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Briefcase className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/blog" className="hover:text-primary-500 transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-primary-500 transition-colors">FAQs</Link></li>
              <li><Link to="/help" className="hover:text-primary-500 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/guides" className="hover:text-primary-500 transition-colors">Guides</Link></li>
              <li><Link to="/privacy" className="hover:text-primary-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/kyc" className="hover:text-primary-500 transition-colors">KYC Policy</Link></li>
              <li><Link to="/commission" className="hover:text-primary-500 transition-colors">Commission Policy</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-500" />
                <span>+91 1234 567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500" />
                <span>support@smart-kissan.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Jaipur, Rajasthan, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 Smart-Kissan. All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-500">
            नमस्ते किसान भाई! मैं आपका साथी हूँ, पूछें कोई भी सवाल।
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
