import React, { useState } from 'react';
import { 
  Settings, Shield, Users, Bell, Database, Globe, Lock, CreditCard,
  CheckCircle, Save, RotateCcw, AlertCircle, Zap, Activity,
  ArrowRight, Cpu, Layers, Target, Workflow, ArrowUpRight,
  Fingerprint, MoreHorizontal, ChevronRight, Toggle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('System parameters committed to ledger.');
    }, 1500);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'escrow', label: 'Escrow', icon: CreditCard },
    { id: 'dispute', label: 'Dispute Rules', icon: Lock },
    { id: 'platform', label: 'Platform Config', icon: Globe },
  ];

  const FieldGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-4 group/field">
      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 ml-2 italic group-focus-within/field:text-primary transition-colors leading-none">{label}</label>
      {children}
    </div>
  );

  const inputClass = "w-full px-8 py-8 bg-gray-50 border-none rounded-[2rem] focus:ring-12 focus:ring-primary/5 outline-none font-black text-[13px] text-gray-950 uppercase tracking-[0.1em] italic placeholder:text-gray-200 shadow-inner transition-all";

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* System Config Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            System_Config_Terminal v1.0 [ROOT_ACCESS]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            System <span className="not-italic text-primary">Config.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Configure <span className="text-gray-950 font-black italic uppercase">platform-wide parameters</span>, escrow rails, and neural governance rules.
          </p>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <button className="px-10 py-6 bg-white border border-gray-100 rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-gray-200/50 hover:bg-gray-50 transition-all text-gray-400 group">
            <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-1000" /> RESET_DEFAULTS
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-6 bg-primary text-white rounded-[2rem] flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.4em] italic shadow-2xl shadow-primary/20 hover:bg-gray-950 transition-all group relative overflow-hidden disabled:opacity-60"
          >
            <span className="relative z-10 flex items-center gap-5">
              <Save size={20} />
              {loading ? 'COMMITTING...' : 'COMMIT_CHANGES'}
            </span>
            <div className="absolute inset-0 bg-gray-950 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">ROOT</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 px-4">
        {/* Tab Navigation */}
        <div className="lg:col-span-3 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300 italic px-2 leading-none mb-8">COMMAND_MODULES</p>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2rem] transition-all duration-500 font-black text-[11px] uppercase tracking-[0.3em] italic group relative overflow-hidden border border-transparent ${
                activeTab === tab.id 
                  ? 'bg-gray-950 text-white shadow-2xl shadow-gray-950/20 translate-x-4' 
                  : 'bg-white text-gray-400 hover:text-gray-950 hover:bg-white shadow-2xl shadow-gray-200/50 hover:translate-x-2'
              }`}
            >
              <tab.icon size={22} className={`shrink-0 transition-transform duration-700 ${activeTab === tab.id ? 'rotate-12' : ''}`} />
              {tab.label}
              {activeTab === tab.id && <div className="absolute left-0 top-0 h-full w-1.5 bg-primary rounded-r-full"></div>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-16">
                <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-14 relative overflow-hidden group">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><Settings size={36} /></div>
                    <div className="space-y-1.5"><h3 className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Platform <span className="text-primary not-italic">Identity.</span></h3><p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">GLOBAL_CONFIGURATION_MATRIX</p></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <FieldGroup label="PLATFORM_DESIGNATION">
                      <input type="text" defaultValue="SmartKissan" className={inputClass} />
                    </FieldGroup>
                    <FieldGroup label="SUPPORT_RELAY_EMAIL">
                      <input type="email" defaultValue="support@smartkissan.com" className={inputClass} />
                    </FieldGroup>
                    <FieldGroup label="COMMISSION_RATE_BPS">
                      <div className="relative">
                        <input type="number" defaultValue="2.5" className={inputClass + ' pr-24'} />
                        <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">%</span>
                      </div>
                    </FieldGroup>
                    <FieldGroup label="BASE_CURRENCY">
                      <select className={inputClass}>
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </FieldGroup>
                  </div>
                  <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]"><Cpu size={250} /></div>
                </div>

                <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-14 relative overflow-hidden group">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><Activity size={36} /></div>
                    <div className="space-y-1.5"><h3 className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">System <span className="text-primary not-italic">Health.</span></h3><p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">SERVICE_TELEMETRY_MATRIX</p></div>
                  </div>
                  <div className="space-y-8 relative z-10">
                    {[
                      { label: 'CORE_SERVICES', sub: 'ALL_SYSTEMS_NOMINAL', status: 'HEALTHY', color: 'text-success bg-success/5', Icon: CheckCircle },
                      { label: 'BLOCKCHAIN_INDEXER', sub: 'Polygon Amoy Testnet · Last Block: 42,881,102', status: 'CONNECTED', color: 'text-secondary bg-secondary/5', Icon: Database },
                    ].map((s, i) => (
                      <div key={i} className={`flex items-center justify-between p-10 rounded-[2.5rem] border border-current/10 group/status ${s.color}`}>
                        <div className="flex items-center gap-8">
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-current/10 group-hover/status:rotate-12 transition-transform duration-700 ${s.color}`}>
                            <s.Icon size={28} strokeWidth={1.5} />
                          </div>
                          <div className="space-y-1.5">
                            <p className="font-black text-gray-950 italic tracking-tighter text-2xl leading-none uppercase">{s.label}</p>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">{s.sub}</p>
                          </div>
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-[0.4em] italic px-6 py-3 rounded-2xl border border-current/10 ${s.color}`}>{s.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]"><Globe size={250} /></div>
                </div>
              </motion.div>
            )}

            {activeTab === 'escrow' && (
              <motion.div key="escrow" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-16">
                <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-16 relative overflow-hidden group">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><CreditCard size={36} /></div>
                    <div className="space-y-1.5"><h3 className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Escrow <span className="text-primary not-italic">Vault.</span></h3><p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">FINANCIAL_CLEARING_MATRIX</p></div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 relative z-10">
                    {[
                      { label: 'TOTAL_ESCROW_VOLUME', value: '₹4.2 Cr', bg: 'bg-secondary' },
                      { label: 'LOCKED_FUNDS_ACTIVE', value: '₹18.7 Lakh', bg: 'bg-warning' },
                      { label: 'RELEASED_TODAY', value: '₹12.4 Lakh', bg: 'bg-success' }
                    ].map((m, i) => (
                      <div key={i} className={`p-10 ${m.bg} rounded-[3rem] text-white relative overflow-hidden shadow-2xl group/m`}>
                        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 italic mb-4 leading-none">{m.label}</p>
                        <p className="text-4xl font-black italic tracking-tighter leading-none">{m.value}</p>
                        <div className="absolute top-0 right-0 p-8 text-white/5"><Database size={80} /></div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-8 relative z-10">
                    {[
                      { label: 'AUTO_RELEASE_PERIOD', sub: 'Days before escrow auto-releases post-delivery', default: '3', unit: 'DAYS' },
                      { label: 'MINIMUM_PAYOUT_THRESHOLD', sub: 'Min wallet balance for withdrawal eligibility', default: '500', unit: 'INR' }
                    ].map((f, i) => (
                      <div key={i} className="flex items-center justify-between p-10 bg-gray-50 rounded-[2.5rem] shadow-inner border border-gray-100 group/r hover:bg-white hover:shadow-2xl transition-all">
                        <div className="space-y-2">
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none group-hover/r:text-primary transition-colors">{f.label}</p>
                          <p className="text-lg text-gray-400 font-medium italic">{f.sub}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <input type="number" defaultValue={f.default} className="w-28 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-black text-gray-950 text-center shadow-inner text-lg outline-none focus:ring-4 focus:ring-primary/5" />
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">{f.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none group-hover:rotate-12 transition-transform duration-[2s]"><CreditCard size={250} /></div>
                </div>
              </motion.div>
            )}

            {activeTab === 'dispute' && (
              <motion.div key="dispute" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-16">
                <div className="stitch-card p-12 md:p-16 bg-white border-none shadow-2xl shadow-gray-200/50 space-y-14 relative overflow-hidden group">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-gray-950 rounded-[1.8rem] text-white shadow-2xl group-hover:rotate-6 transition-transform duration-700"><Lock size={36} /></div>
                    <div className="space-y-1.5"><h3 className="text-4xl font-black text-gray-950 italic tracking-tighter leading-none uppercase">Dispute <span className="text-primary not-italic">Protocol.</span></h3><p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">ARBITRATION_GOVERNANCE_RULES</p></div>
                  </div>
                  
                  <div className="p-10 bg-error/5 rounded-[2.5rem] border border-error/10 flex items-start gap-8 relative z-10">
                    <AlertCircle size={36} className="text-error shrink-0 mt-1" strokeWidth={1.5} />
                    <p className="text-xl font-medium text-gray-400 italic leading-relaxed"><span className="text-gray-950 font-black uppercase">CRITICAL:</span> Rules defined here directly affect platform trust scores and financial settlements. Proceed with caution.</p>
                  </div>

                  <div className="space-y-6 relative z-10">
                    {['QUALITY_MISMATCH', 'WEIGHT_SHORTAGE', 'DELAYED_DELIVERY', 'DAMAGED_PRODUCE'].map((reason, i) => (
                      <div key={reason} className="flex items-center justify-between p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-inner group/r hover:bg-white hover:shadow-2xl transition-all">
                        <p className="text-xl font-black text-gray-950 italic uppercase tracking-tighter leading-none group-hover/r:text-primary transition-colors">{reason.replace(/_/g, ' ')}</p>
                        <button className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] italic text-gray-400 hover:text-primary transition-colors group/btn px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl">
                          EDIT_RULES <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 right-0 p-12 text-gray-50 opacity-[0.03] pointer-events-none"><Lock size={250} /></div>
                </div>
              </motion.div>
            )}

            {(activeTab === 'security' || activeTab === 'platform') && (
              <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="stitch-card py-48 text-center space-y-10 bg-white border-none shadow-2xl">
                <div className="w-48 h-48 bg-gray-50 rounded-[4rem] flex items-center justify-center mx-auto shadow-inner">
                  {activeTab === 'security' ? <Shield size={90} className="text-gray-200" strokeWidth={1} /> : <Globe size={90} className="text-gray-200" strokeWidth={1} />}
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-gray-950 italic uppercase">{activeTab.toUpperCase()}_MODULE</h3>
                  <p className="text-xl text-gray-400 italic">Advanced configuration panel coming in next release cycle.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsPage;
