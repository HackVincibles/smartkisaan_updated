import React, { useState, useEffect } from 'react';
import { 
  User, Search, Filter, ShieldCheck, 
  Slash, CheckCircle2, MoreVertical,
  ChevronRight, ArrowUpRight, Phone,
  Mail, Award, MapPin, Database,
  Activity, Target, Cpu, Layers,
  MoreHorizontal, Fingerprint, Globe,
  Download, Workflow, AlertTriangle,
  CheckCircle, Clock, Star, Zap
} from 'lucide-react';
// @ts-ignore
import adminService from '../../services/adminService';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagementPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers();
      const data = response.data?.data || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([
        { _id: '1', name: 'Rajesh Kumar', role: 'farmer', phone: '9876543210', isVerified: true, trustScore: 95, createdAt: new Date() },
        { _id: '2', name: 'Amit Chandak', role: 'buyer', email: 'amit@example.com', isVerified: false, trustScore: 80, createdAt: new Date(Date.now() - 86400000) },
        { _id: '3', name: 'Express Logistics Ltd', role: 'transport', phone: '9000011111', isVerified: true, trustScore: 100, createdAt: new Date(Date.now() - 172800000) },
        { _id: '4', name: 'Priya Sharma', role: 'farmer', phone: '8812345678', isVerified: true, trustScore: 87, createdAt: new Date(Date.now() - 259200000) }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'farmer': return { color: 'text-success bg-success/5', label: 'FARMER_NODE' };
      case 'buyer': return { color: 'text-secondary bg-secondary/5', label: 'BUYER_NODE' };
      case 'transport': return { color: 'text-warning bg-warning/5', label: 'TRANSPORT_NODE' };
      default: return { color: 'text-gray-400 bg-gray-50', label: 'UNKNOWN' };
    }
  };

  const filtered = users.filter(u => {
    const roleMatch = filter === 'all' || u.role === filter;
    const searchMatch = search === '' ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return roleMatch && searchMatch;
  });

  const pendingCount = users.filter(u => !u.isVerified).length;

  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-32 fade-in">
      {/* Participant Registry Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative overflow-hidden p-4">
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
            Node_Registry v6.0 [ADMIN_ELEVATED]
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-gray-950 tracking-tighter italic leading-none uppercase">
            Participant <span className="not-italic text-primary">Registry.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-xl text-xl leading-relaxed italic">
            Audit, verify and manage <span className="text-gray-950 font-black italic">{users.length} network participants</span> across the SmartKissan agricultural lattice.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-8 relative z-10">
          <div className="stitch-card p-8 bg-white shadow-2xl shadow-gray-200/50 flex items-center gap-6 group hover:rotate-1 transition-transform">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Database size={28} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">TOTAL_NODES</p>
              <p className="text-3xl font-black text-gray-950 italic tracking-tighter leading-none">{users.length}</p>
            </div>
          </div>
          {pendingCount > 0 && (
            <div className="stitch-card p-8 bg-warning/10 shadow-2xl shadow-warning/10 flex items-center gap-6 group hover:-rotate-1 transition-transform border border-warning/10">
              <div className="w-14 h-14 bg-warning/10 text-warning rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <AlertTriangle size={28} />
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">KYC_PENDING</p>
                <p className="text-3xl font-black text-warning italic tracking-tighter leading-none">{pendingCount}</p>
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none -mr-40 -mt-10">
          <h1 className="text-[20rem] font-black italic tracking-tighter uppercase leading-none">KYC</h1>
        </div>
      </div>

      {/* Control Surface */}
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        <div className="relative flex-1 group">
          <Search size={24} className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="SCAN BY NAME, PHONE, EMAIL, OR NODE_ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-20 pr-10 py-10 bg-white border border-gray-100 rounded-[3rem] focus:ring-12 focus:ring-primary/5 focus:border-primary/20 outline-none font-black text-[11px] text-gray-950 uppercase tracking-[0.2em] italic placeholder:text-gray-200 shadow-2xl shadow-gray-200/50"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex p-3 bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-200/30 gap-2">
            {['all', 'farmer', 'buyer', 'transport'].map((r) => (
              <button 
                key={r}
                onClick={() => setFilter(r)}
                className={`px-8 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic transition-all whitespace-nowrap ${
                  filter === r ? 'bg-gray-950 text-white shadow-2xl shadow-gray-950/20' : 'text-gray-400 hover:text-gray-950'
                }`}
              >
                {r === 'all' ? 'ALL_NODES' : r === 'transport' ? 'TRANSPORT' : r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Participant Registry Table */}
      <div className="px-4">
        <div className="stitch-card bg-white border-none shadow-2xl shadow-gray-200/50 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] gap-6 px-12 py-8 bg-gray-50 border-b border-gray-50">
            {['PARTICIPANT_IDENTITY', 'NODE_TYPE', 'KYC_STATUS', 'TRUST_INDEX', 'GENESIS_DATE', ''].map((h, i) => (
              <p key={i} className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] italic leading-none">{h}</p>
            ))}
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-50">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] gap-6 px-12 py-10 animate-pulse">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem]" />
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-50 rounded-xl w-32" />
                      <div className="h-3 bg-gray-50 rounded-xl w-24" />
                    </div>
                  </div>
                  {[1,2,3,4,5].map(j => <div key={j} className="h-6 bg-gray-50 rounded-xl self-center" />)}
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="py-32 text-center space-y-6">
                <User size={80} className="text-gray-100 mx-auto" strokeWidth={1} />
                <p className="text-2xl font-black text-gray-300 italic uppercase">NO_NODES_FOUND</p>
              </div>
            ) : (
              filtered.map((user, index) => {
                const roleConf = getRoleConfig(user.role);
                return (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_0.5fr] gap-6 px-12 py-10 hover:bg-gray-50/50 transition-all group cursor-pointer items-center"
                  >
                    {/* Identity */}
                    <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center font-black text-2xl italic shrink-0 shadow-inner border border-current/10 group-hover:rotate-12 transition-transform duration-700 ${roleConf.color}`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <p className="font-black text-gray-950 italic tracking-tighter text-xl leading-none uppercase group-hover:text-primary transition-colors truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em] italic truncate">{user.phone || user.email || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <span className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] italic border border-current/10 shadow-sm w-fit ${roleConf.color}`}>
                      {roleConf.label}
                    </span>

                    {/* Status */}
                    {user.isVerified ? (
                      <div className="flex items-center gap-3 text-success text-[11px] font-black uppercase tracking-[0.3em] italic">
                        <CheckCircle size={18} /> KYC_CLEAR
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-warning text-[11px] font-black uppercase tracking-[0.3em] italic">
                        <Clock size={18} className="animate-pulse" /> KYC_PENDING
                      </div>
                    )}

                    {/* Trust Score */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-[60px] h-2 bg-gray-50 rounded-full overflow-hidden shadow-inner border border-gray-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${user.trustScore}%` }}
                          transition={{ delay: index * 0.05 + 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full rounded-full ${user.trustScore > 90 ? 'bg-success' : 'bg-warning'}`}
                        />
                      </div>
                      <span className={`text-[13px] font-black italic tracking-tighter ${user.trustScore > 90 ? 'text-success' : 'text-warning'}`}>{user.trustScore}%</span>
                    </div>

                    {/* Date */}
                    <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em] italic">
                      {new Date(user.createdAt).toLocaleDateString().toUpperCase()}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                      <button className="p-4 bg-gray-50 rounded-2xl text-gray-200 hover:text-primary hover:bg-white hover:shadow-2xl hover:border-gray-100 transition-all border border-transparent shadow-inner group/btn">
                        <MoreHorizontal size={20} className="group-hover/btn:rotate-90 transition-transform" />
                      </button>
                      <div className="p-4 text-gray-200 group-hover:text-primary transition-colors">
                        <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-4">
        <div className="stitch-card p-14 bg-secondary text-white flex justify-between items-center group cursor-pointer shadow-2xl shadow-secondary/20 relative overflow-hidden hover:translate-y-[-5px] transition-all duration-700">
          <div className="space-y-6 relative z-10">
            <h3 className="text-4xl font-black italic tracking-tighter leading-none uppercase">Export <span className="not-italic">Census.</span></h3>
            <p className="text-secondary-100/60 text-lg font-medium italic">Download full participant registry in CSV/JSON format for compliance reporting.</p>
          </div>
          <div className="w-20 h-20 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner shrink-0 border border-white/5 relative z-10 group-hover:rotate-12 transition-transform duration-700">
            <Download size={36} />
          </div>
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
            <Database size={200} />
          </div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="stitch-card p-14 bg-error text-white flex justify-between items-center group cursor-pointer shadow-2xl shadow-error/20 relative overflow-hidden hover:translate-y-[-5px] transition-all duration-700">
          <div className="space-y-6 relative z-10">
            <h3 className="text-4xl font-black italic tracking-tighter leading-none uppercase">Blocklist <span className="not-italic">Nodes.</span></h3>
            <p className="text-red-100/60 text-lg font-medium italic">View and manage 4 active platform-wide participant bans and suspensions.</p>
          </div>
          <div className="w-20 h-20 rounded-[2.5rem] bg-white/10 backdrop-blur-3xl flex items-center justify-center group-hover:bg-white/20 transition-all shadow-inner shrink-0 border border-white/5 relative z-10 group-hover:rotate-12 transition-transform duration-700">
            <Slash size={36} />
          </div>
          <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
            <AlertTriangle size={200} />
          </div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
