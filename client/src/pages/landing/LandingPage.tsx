import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf,
  ArrowRight,
  Shield,
  MapPin,
  BarChart3,
  Users,
  Truck,
  CheckCircle,
  TrendingUp,
  Menu,
  X,
  MessageCircle,
  Package,
  Moon,
  Sun
} from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const features = [
    { icon: Shield, title: 'Secure Payments', description: 'Escrow-based transactions protect both farmers and buyers' },
    { icon: MapPin, title: 'Live Tracking', description: 'Real-time monitoring of agricultural products in transit' },
    { icon: BarChart3, title: 'AI Price Insights', description: 'Intelligent pricing recommendations based on market data' },
    { icon: CheckCircle, title: 'Fair & Transparent', description: 'Blockchain-powered trust and verification system' }
  ];

  const roles = [
    { 
      title: 'Farmer', 
      icon: Leaf, 
      description: 'List your products and connect with buyers directly',
      path: '/register'
    },
    { 
      title: 'Buyer', 
      icon: Users, 
      description: 'Source quality products from verified farmers',
      path: '/register'
    },
    { 
      title: 'Transporter', 
      icon: Truck, 
      description: 'Join the logistics network and earn',
      path: '/register'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Active Farmers' },
    { number: '50,000+', label: 'Products Listed' },
    { number: '25,000+', label: 'Successful Transactions' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Smart<span className="text-green-600">Kissan</span></span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Features
              </Link>
              <Link to="/how-it-works" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                How it Works
              </Link>
              <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Marketplace
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Contact
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors">
                Register
              </Link>
              <a 
                href="https://enam.gov.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-orange-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-orange-700 transition-colors"
              >
                eNAM
              </a>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-green-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-b border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 space-y-4">
              <Link to="/login" className="block text-gray-600 hover:text-green-600 font-medium transition-colors">Login</Link>
              <Link to="/register" className="block bg-green-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-green-700 transition-colors text-center">Get Started</Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section - Full Width Design */}
      <section className="pt-24 pb-16 min-h-screen flex items-center">
        <div className="w-full">
          <div className="relative h-screen bg-gradient-to-br from-green-50 via-green-100 to-white">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-8 left-8 w-32 h-32 bg-yellow-300 rounded-full blur-3xl"></div>
              <div className="absolute top-16 right-8 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 left-16 w-48 h-48 bg-green-300 rounded-full blur-3xl"></div>
              <div className="absolute bottom-8 right-16 w-64 h-64 bg-purple-300 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-green-100/50 to-transparent"></div>
            </div>
            
            {/* Central Content */}
            <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
              <div className="max-w-4xl mx-auto">
                <div className="w-32 h-32 bg-green-600 rounded-full flex items-center justify-center mb-12 mx-auto shadow-2xl">
                  <Leaf className="w-16 h-16 text-white" />
                </div>
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 mb-6">
                  Smart<span className="text-green-600">Kissan</span>
                </h1>
                <p className="text-3xl sm:text-4xl text-gray-600 mb-12 max-w-4xl mx-auto">
                  India's Trusted Agricultural Marketplace
                </p>
                
                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                  <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-4">
                      <Shield className="w-8 h-8 text-green-600" />
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">Secure Payments</h3>
                        <p className="text-sm text-gray-600">Blockchain escrow protection</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">Verified Quality</h3>
                        <p className="text-sm text-gray-600">AI-powered verification</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all">
                    <div className="flex items-center space-x-4">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      <div className="text-left">
                        <h3 className="font-bold text-gray-900 text-lg">Smart Pricing</h3>
                        <p className="text-sm text-gray-600">Market intelligence insights</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/register" 
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="inline-block ml-2 w-5 h-5" />
                  </Link>
                  <Link 
                    to="/marketplace" 
                    className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
          </div>
        </div>
          </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-gray-600">Join the growing network of agricultural professionals</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose SmartKissan?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Built specifically for India's agricultural ecosystem</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join as</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choose your role in the agricultural ecosystem</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
              >
                <Link to={role.path} className="block">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <role.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{role.title}</h3>
                  <p className="text-gray-600 text-center mb-6">{role.description}</p>
                  <div className="flex items-center justify-center text-green-600 font-medium">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 bg-green-600">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Agricultural Business?</h2>
            <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">Join thousands of farmers and buyers already using SmartKissan</p>
            <Link 
              to="/register" 
              className="inline-flex items-center bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started Now <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Chatbot Section */}
      <section className="py-16 px-6 sm:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="mb-12">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Agricultural Assistant</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Get instant help with farming, pricing, and market insights from our AI-powered chatbot</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
                <p className="text-gray-600 mb-4">Get instant answers to your farming questions</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Crop disease identification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Market price analysis</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Weather forecasts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Best selling practices</span>
                  </div>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition-colors mt-6">
                  Start Chatting with AI Assistant
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Analytics</h3>
                <p className="text-gray-600 mb-4">AI-powered insights for better decision making</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Yield prediction</span>
                    <span className="text-green-600 font-bold">+15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Price optimization</span>
                    <span className="text-green-600 font-bold">+8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Risk assessment</span>
                    <span className="text-green-600 font-bold">Low</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mt-6">
                  View Analytics Dashboard
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Smart<span className="text-green-400">Kissan</span></span>
              </div>
              <p className="text-gray-400">India's trusted agricultural marketplace</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SmartKissan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
