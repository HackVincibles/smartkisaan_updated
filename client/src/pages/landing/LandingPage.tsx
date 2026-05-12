import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  TrendingUp, 
  Shield, 
  Truck, 
  Users, 
  Sparkles, 
  Award,
  ArrowRight,
  CheckCircle2,
  Leaf,
  Scale,
  Zap,
  Globe,
  Database,
  ShieldCheck,
  Activity,
  ChevronRight,
  ArrowUpRight,
  MousePointer2,
  Fingerprint,
  Cpu,
  Lock,
  Workflow
} from 'lucide-react';

const LandingPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const heroImage = "/home/pineapple/.gemini/antigravity/brain/f0a2836f-531e-4f17-828e-932994a44758/smart_kissan_hero_visual_1778587208207.png";
  
  return (
    <div className="bg-white font-sans selection:bg-tertiary-100 selection:text-tertiary-900 overflow-x-hidden">
      {/* Premium Navigation (Landing) */}
      <nav className="fixed top-0 left-0 w-full z-[1000] px-12 py-8 flex justify-between items-center pointer-events-none">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 pointer-events-auto group cursor-pointer"
        >
            <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Zap size={24} fill="white" className="text-tertiary" />
            </div>
            <span className="text-2xl font-black text-white italic tracking-tighter mix-blend-difference">Smart<span className="text-tertiary not-italic">Kissan</span></span>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 pointer-events-auto"
        >
            <Link to="/login" className="px-10 py-5 bg-white/10 backdrop-blur-3xl border border-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-gray-900 transition-all shadow-2xl">
                Nexus Access
            </Link>
            <Link to="/register" className="px-10 py-5 bg-tertiary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-tertiary-600 transition-all shadow-2xl shadow-tertiary-900/20">
                Initialize Protocol
            </Link>
        </motion.div>
      </nav>

      {/* Hero Section: Cinematic Visuals */}
      <section className="relative min-h-screen flex items-center bg-gray-950 overflow-hidden">
        {/* Background Visual Layer */}
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Agricultural Nexus" 
            className="w-full h-full object-cover opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
        </motion.div>

        <div className="container-custom relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl"
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <span className="inline-flex items-center gap-4 px-8 py-3 rounded-full bg-tertiary/10 backdrop-blur-2xl border border-tertiary/20 text-tertiary text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl">
                <Activity className="w-5 h-5 animate-pulse" />
                Agricultural Protocol v4.0 Active
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-7xl md:text-[8.5rem] font-black mb-12 text-white leading-[0.85] tracking-tighter italic"
            >
              The New <br/> <span className="not-italic text-tertiary underline decoration-tertiary/20 underline-offset-[2rem]">Authority</span> in Trade.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-2xl text-gray-400 mb-16 max-w-2xl font-medium leading-relaxed italic">
              Decentralized commerce engineered for traditional integrity. A high-trust, AI-secured bridge for Farmers, Buyers, and Logistics.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-8">
              <Link to="/register" className="px-14 py-8 bg-tertiary text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.4em] hover:bg-tertiary-600 transition-all shadow-2xl shadow-tertiary-900/40 flex items-center gap-6 group">
                Begin Onboarding
                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </Link>
              <button className="px-14 py-8 bg-white/5 backdrop-blur-2xl border border-white/10 text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.4em] hover:bg-white hover:text-gray-900 transition-all flex items-center gap-6 group">
                Explore Nodes <ChevronRight className="w-6 h-6 group-hover:rotate-90 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Global Stats Overlay */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 hidden xl:flex gap-12 text-white container-custom justify-end">
            {[
                { label: 'Active Clusters', value: '542+', icon: Globe },
                { label: 'Verified Nodes', value: '1.2M', icon: ShieldCheck },
                { label: 'Settlement Volume', value: '₹8.4B', icon: TrendingUp }
            ].map((stat, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 + (i * 0.15) }}
                    className="flex items-center gap-6 p-10 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 group hover:bg-white/10 transition-colors"
                >
                    <div className="w-14 h-14 bg-white/10 rounded-[1.2rem] flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                        <stat.icon size={28} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2 italic">{stat.label}</p>
                        <h4 className="text-4xl font-black italic tracking-tighter">{stat.value}</h4>
                    </div>
                </motion.div>
            ))}
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-10 z-20 flex flex-col items-center gap-4"
        >
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-tertiary to-transparent"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-500 vertical-text italic">Protocol Explorer</span>
        </motion.div>
      </section>
      
      {/* Premium Trust Architecture */}
      <section ref={ref} className="py-60 bg-white relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
            className="text-center mb-40 space-y-6"
          >
            <motion.p variants={fadeInUp} className="text-tertiary text-[11px] font-black uppercase tracking-[0.4em] italic">System Architecture</motion.p>
            <motion.h2 variants={fadeInUp} className="text-6xl md:text-[7.5rem] font-black text-gray-950 tracking-tighter italic leading-[0.85]">
                Engineered for <br/> <span className="not-italic text-tertiary">Absolute Authority.</span>
            </motion.h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Fingerprint, title: 'Cryptographic Identity', description: 'Zero-knowledge verification for every network participant ensuring total anonymity and trust.' },
              { icon: Lock, title: 'Escrow Sovereignty', description: 'Institutional-grade asset locking until logistics telemetry confirms handover completion.' },
              { icon: Activity, title: 'Regional Pulse', description: 'AI-driven mandi telemetry monitoring 500+ regional nodes for dynamic price discovery.' },
              { icon: Cpu, title: 'Yield Forecasting', description: 'Geospatial AI predicting crop maturity and market demand cycles with 94% accuracy.' },
              { icon: Globe, title: 'Logistics Rails', description: 'Automated regional route optimization with real-time condition monitoring of payloads.' },
              { icon: Award, title: 'Asset Certification', description: 'Visual AI grading at origin, establishing a new global standard for agricultural quality.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-16 rounded-[4rem] bg-gray-50/50 border border-transparent hover:border-tertiary/10 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] transition-all duration-700"
              >
                <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-tertiary shadow-sm border border-gray-100 mb-12 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <feature.icon size={36} />
                </div>
                <h3 className="text-3xl font-black text-gray-950 mb-6 italic leading-tight group-hover:text-tertiary transition-colors">{feature.title}</h3>
                <p className="text-gray-400 font-medium text-xl leading-relaxed italic">{feature.description}</p>
                <div className="mt-12 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <div className="flex items-center gap-3 text-tertiary font-black text-[10px] uppercase tracking-widest">
                        Protocol Details <ArrowUpRight size={16} />
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Background Mesh */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none -z-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
      </section>
      
      {/* Immersive Path Selection */}
      <section className="py-60 bg-gray-950 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-32">
            <div className="space-y-6">
                <p className="text-tertiary text-[11px] font-black uppercase tracking-[0.4em] italic">Participant Tiers</p>
                <h2 className="text-7xl md:text-[8.5rem] font-black text-white tracking-tighter italic leading-[0.85]">
                    Select Your <br/> <span className="not-italic text-tertiary">Access Point.</span>
                </h2>
            </div>
            <p className="text-gray-400 max-w-sm text-2xl font-medium leading-relaxed italic">Initialize your role within the pan-India agricultural network.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { role: 'Farmer', icon: Leaf, color: 'tertiary', path: '/register', description: 'Direct marketplace sovereignty, precision forecasting, and instant asset settlement.' },
              { role: 'Buyer', icon: Users, color: 'blue', path: '/register', description: 'Institutional procurement from verified clusters with automated fulfillment rails.' },
              { role: 'Transporter', icon: Truck, color: 'orange', path: '/register', description: 'Payload assignment with IoT-verified tracking and route optimization rails.' }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -30 }}
                className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[5rem] p-20 text-center cursor-pointer group transition-all duration-700"
                onClick={() => window.location.href = item.path}
              >
                <div className={`w-28 h-28 bg-${item.color}-500/20 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-${item.color}-500/30`}>
                  <item.icon className={`w-14 h-14 text-${item.color}-400`} />
                </div>
                <h3 className="text-4xl font-black text-white mb-8 italic tracking-tighter">{item.role}</h3>
                <p className="text-gray-400 text-xl font-medium mb-16 leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">{item.description}</p>
                <div className="flex justify-center items-center gap-4 text-white font-black text-[11px] uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 group-hover:text-tertiary transition-all">
                  Initialize Link <ArrowRight className="w-6 h-6" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Dynamic Background Element */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-tertiary/20 rounded-full blur-[150px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-10"></div>
        </div>
      </section>
      
      {/* Final Protocol CTA */}
      <section className="py-80 bg-white text-center relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-20"
          >
            <h2 className="text-7xl md:text-[10rem] font-black text-gray-950 tracking-tighter italic leading-[0.8]">
              Join the <br/> <span className="not-italic text-tertiary">Nexus.</span>
            </h2>
            <div className="flex flex-col items-center gap-10">
                <Link to="/register" className="px-24 py-10 bg-gray-950 text-white rounded-[3.5rem] text-xs font-black uppercase tracking-[0.6em] hover:bg-tertiary transition-all shadow-2xl shadow-gray-200 hover:shadow-tertiary-900/20 flex items-center gap-8 group">
                    Initialize Protocol <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                </Link>
                <div className="flex items-center gap-6">
                    <p className="text-gray-400 font-black text-[11px] uppercase tracking-[0.3em] italic">Verified Participants Only</p>
                    <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                    <p className="text-gray-400 font-black text-[11px] uppercase tracking-[0.3em] italic">ISO 27001 Certified</p>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Massive Background Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 opacity-[0.02] pointer-events-none select-none">
            <h1 className="text-[40rem] font-black text-gray-950 tracking-tighter">SMARTKISSAN</h1>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-50 py-32 px-12 border-t border-gray-100">
        <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-center gap-20 mb-20">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-950 rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl">
                        <Zap size={24} fill="white" className="text-tertiary" />
                    </div>
                    <span className="text-3xl font-black text-gray-950 italic tracking-tighter">Smart<span className="text-tertiary not-italic">Kissan</span></span>
                </div>
                <div className="flex flex-wrap justify-center gap-16 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                    <a href="#" className="hover:text-tertiary transition-colors italic">System Protocol</a>
                    <a href="#" className="hover:text-tertiary transition-colors italic">Regional Nodes</a>
                    <a href="#" className="hover:text-tertiary transition-colors italic">Security Ledger</a>
                    <a href="#" className="hover:text-tertiary transition-colors italic">Nexus Command</a>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-10 border-t border-gray-200/50">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-300 italic">
                    © 2026 Smart-Kissan Protocol. Regional Data Sovereignty Enforced.
                </div>
                <div className="flex gap-8">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-tertiary hover:border-tertiary transition-all cursor-pointer">
                        <Globe size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-tertiary hover:border-tertiary transition-all cursor-pointer">
                        <ShieldCheck size={18} />
                    </div>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
