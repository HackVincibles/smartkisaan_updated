"use client";

import { motion } from "framer-motion";
import { Plus, LayoutDashboard, Package, TrendingUp, BadgeCheck, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 premium-gradient rounded-lg" />
          <span className="font-bold text-xl">Smart Kissan</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <SidebarItem icon={<LayoutDashboard />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
          <SidebarItem icon={<Package />} label="My Listings" active={activeTab === "listings"} onClick={() => setActiveTab("listings")} />
          <SidebarItem icon={<TrendingUp />} label="Market Trends" active={activeTab === "trends"} onClick={() => setActiveTab("trends")} />
        </nav>

        <div className="mt-auto glass-card p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <BadgeCheck className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-bold">Gold Farmer</p>
              <p className="text-xs text-gray-400">Soulbound Token #821</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 break-all">0x71C...4f21</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Farmer Portal</h1>
            <p className="text-gray-400">Welcome back, Aditya. Your harvest is looking great.</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Listing
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard label="Total Sales" value="₹24,500" change="+12%" />
          <StatCard label="Active Orders" value="5" />
          <StatCard label="Avg Quality Score" value="94%" />
          <StatCard label="Reputation" value="4.9/5" />
        </div>

        {/* Gray Zone Alerts */}
        <div className="bg-accent/10 border border-accent/20 rounded-3xl p-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
              <AlertCircle className="text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Kisan Panchayat Review</h3>
              <p className="text-gray-400">Order #882 is in the gray zone (Score: 74%). Community voting has started.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-accent text-black font-bold rounded-xl hover:brightness-110 transition">
            View Images
          </button>
        </div>

        {/* Active Orders Table */}
        <div className="glass-card overflow-hidden !p-0">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold">Active Transactions</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-surface/50 text-gray-400 text-sm">
              <tr>
                <th className="p-6">Product</th>
                <th className="p-6">Buyer</th>
                <th className="p-6">Status</th>
                <th className="p-6">Trust Proof</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow product="Tomato (Hybrid)" buyer="Reliance Fresh" status="In Transit" proof="Polygon Tx" />
              <OrderRow product="Onion (Nasik)" buyer="Zomato Hyperpure" status="Picked Up" proof="IPFS CID" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: any }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-2xl transition duration-300 ${active ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-400 hover:bg-surface"}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function StatCard({ label, value, change }: { label: string, value: string, change?: string }) {
  return (
    <div className="glass-card">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold">{value}</h3>
        {change && <span className="text-primary text-xs font-bold">{change}</span>}
      </div>
    </div>
  );
}

function OrderRow({ product, buyer, status, proof }: { product: string, buyer: string, status: string, proof: string }) {
  return (
    <tr className="border-t border-border hover:bg-surface/30 transition">
      <td className="p-6 font-medium">{product}</td>
      <td className="p-6 text-gray-400">{buyer}</td>
      <td className="p-6">
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          {status}
        </span>
      </td>
      <td className="p-6">
        <button className="text-accent text-sm hover:underline font-medium">{proof}</button>
      </td>
    </tr>
  );
}
