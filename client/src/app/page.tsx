"use client";

import { motion } from "framer-motion";
import { Leaf, ShieldCheck, Truck, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Smart Kissan</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-xl hover:bg-surface transition">Login</Link>
          <Link href="/register" className="btn-primary py-2 px-6">Join Now</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 inline-block">
            Investment-Ready Agri-Marketplace v2.0
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
            Connecting Farmers with <br />
            <span className="text-gradient underline decoration-accent/30 decoration-8 underline-offset-8">Blockchain Trust.</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
            AI-verified quality, automated Polygon escrow, and decentralized dispute resolution. 
            Empowering the ground reality of Indian agriculture.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-lg">
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="px-8 py-4 bg-surface border border-border rounded-2xl hover:border-primary/50 transition">
              Explore Live Mandi
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-primary" />}
            title="Polygon Escrow"
            desc="Funds locked in smart contracts. Automatic release based on AI verification."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-accent" />}
            title="Kisan Panchayat"
            desc="Decentralized dispute resolution by verified community elders."
          />
          <FeatureCard 
            icon={<Truck className="w-8 h-8 text-emerald-400" />}
            title="Passive Tracking"
            desc="No app required for transporters. WhatsApp geo-tagging & GPS tracking."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-card group cursor-default">
      <div className="w-16 h-16 bg-background border border-border rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}
