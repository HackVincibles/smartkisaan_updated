import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  TrendingUp, 
  Shield, 
  Truck, 
  Users, 
  Sparkles, 
  Award,
  ArrowRight,
  CheckCircle,
  Leaf,
  Scale
} from 'lucide-react';

const LandingPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const features = [
    { icon: TrendingUp, title: 'AI Price & Quality', description: 'Smart suggestions for better pricing and quality assessment' },
    { icon: Shield, title: 'Secure Payments', description: '100% safe with escrow protection for all transactions' },
    { icon: Truck, title: 'Live Tracking', description: 'Real-time updates on your orders from pickup to delivery' },
    { icon: Scale, title: 'Dispute Resolution', description: 'AI-powered fair dispute resolution system' },
    { icon: Users, title: 'Trusted Community', description: '10K+ daily orders from verified farmers and buyers' },
    { icon: Award, title: 'Quality Assured', description: 'Graded and tested products from trusted sellers' }
  ];
  
  const stats = [
    { value: '10K+', label: 'Daily Orders', icon: Truck },
    { value: '50K+', label: 'Happy Farmers', icon: Users },
    { value: '₹100Cr+', label: 'GMV', icon: TrendingUp },
    { value: '99.9%', label: 'Successful Delivery', icon: CheckCircle }
  ];
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-dark-200 dark:via-dark-100 dark:to-dark-200">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-custom relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                India's Most Trusted Agri Marketplace
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent"
            >
              Grow Smart. Sell Better. Live Better.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
              Smart-Kissan is a digital bridge between Farmers, Buyers & Transporters. Fair. Transparent. Trusted.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 justify-center">
              <Link to="/register" className="btn-primary px-8 py-3 text-lg">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3 text-lg">
                Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-dark-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary-600" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section ref={ref} className="py-20 bg-gray-50 dark:bg-dark-100">
        <div className="container-custom">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Smart-Kissan?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400">
              We provide everything you need for successful agri-trading
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card p-6 hover:shadow-lg transition-all"
              >
                <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Role Selection Section */}
      <section className="py-20 bg-white dark:bg-dark-200">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Choose Your Path
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { role: 'Farmer', icon: Leaf, color: 'bg-green-500', path: '/register', description: 'Sell your produce directly to buyers at fair prices' },
              { role: 'Buyer', icon: Users, color: 'bg-blue-500', path: '/register', description: 'Buy fresh, quality produce from verified farmers' },
              { role: 'Transporter', icon: Truck, color: 'bg-orange-500', path: '/register', description: 'Deliver products and earn with reliable loads' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-8 text-center cursor-pointer group"
                onClick={() => window.location.href = item.path}
              >
                <div className={`w-20 h-20 ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.role}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                <span className="text-primary-600 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Agri-Business?
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers, buyers, and transporters already using Smart-Kissan
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
