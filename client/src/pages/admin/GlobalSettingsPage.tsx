import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Users, 
  Bell, 
  Database, 
  Globe, 
  Lock, 
  CreditCard,
  CheckCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const GlobalSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Global settings updated successfully');
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'escrow', label: 'Escrow & Finance', icon: CreditCard },
    { id: 'dispute', label: 'Dispute Rules', icon: Lock },
    { id: 'platform', label: 'Platform Config', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global System Settings</h1>
          <p className="text-sm text-gray-500">Configure platform-wide parameters and rules</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary py-2 text-sm flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Defaults
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-primary py-2 text-sm flex items-center gap-2 px-6"
          >
            {loading ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                  : 'bg-white dark:bg-dark-200 text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-6">Platform Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Platform Name</label>
                    <input type="text" defaultValue="SmartKissan" className="input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Support Email</label>
                    <input type="email" defaultValue="support@smartkissan.com" className="input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Commission Rate (%)</label>
                    <input type="number" defaultValue="2.5" className="input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400">Platform Currency</label>
                    <select className="input">
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold mb-6">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-green-900">Core Services</p>
                        <p className="text-xs text-green-700">All systems operational</p>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase text-green-600">Healthy</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Database className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">Blockchain Indexer</p>
                        <p className="text-xs text-blue-700">Polygon Amoy Testnet • Last Block: 42,881,102</p>
                      </div>
                    </div>
                    <span className="text-xs font-black uppercase text-blue-600">Connected</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6">Escrow & Wallet Rules</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-xl shadow-blue-100">
                    <p className="text-[10px] uppercase font-black opacity-80">Total Escrow Volume</p>
                    <p className="text-2xl font-black mt-1">₹4.2 Cr</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-xl shadow-orange-100">
                    <p className="text-[10px] uppercase font-black opacity-80">Locked Funds</p>
                    <p className="text-2xl font-black mt-1">₹18.7 Lakh</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl text-white shadow-xl shadow-green-100">
                    <p className="text-[10px] uppercase font-black opacity-80">Released Today</p>
                    <p className="text-2xl font-black mt-1">₹12.4 Lakh</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold">Auto-Release Period</p>
                      <p className="text-xs text-gray-500">Days to wait after delivery before auto-releasing escrow</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue="3" className="input w-20" />
                      <span className="text-xs font-bold text-gray-400">Days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                    <div>
                      <p className="font-bold">Minimum Payout</p>
                      <p className="text-xs text-gray-500">Minimum wallet balance required for withdrawal</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="number" defaultValue="500" className="input w-20" />
                      <span className="text-xs font-bold text-gray-400">INR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dispute' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-6">Dispute Resolution Rules</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 mb-6">
                  <p className="text-xs text-red-800 dark:text-red-300 font-bold leading-relaxed flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Careful: Rules defined here directly affect platform trust and financial settlements.
                  </p>
                </div>
                <div className="space-y-4">
                   {['Quality Mismatch', 'Weight Shortage', 'Late Delivery', 'Damaged Produce'].map((reason) => (
                     <div key={reason} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                       <p className="font-bold">{reason}</p>
                       <button className="text-xs font-black text-primary-600 uppercase tracking-widest hover:underline">Edit Rules</button>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { AlertCircle } from 'lucide-react';

export default GlobalSettingsPage;
