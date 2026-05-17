import { useState, useEffect, useRef } from "react";

// ─── Icons (inline SVGs to avoid import issues) ───────────────────────────────
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>,
    search: <><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    box: <><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
    msg: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    pay: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>,
    cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    check: <polyline points="20 6 9 12 4 9"/>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>,
    truck: <><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
    mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></>,
    star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    alert: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    phone: <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.27 9.09 19.79 19.79 0 01.22 .4 2 2 0 012.18 2.18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    menu: <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    refresh: <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name]}
    </svg>
  );
};

// ─── Theme & color tokens ──────────────────────────────────────────────────────
const useTheme = () => {
  const [dark, setDark] = useState(true);
  return { dark, toggle: () => setDark(d => !d) };
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ value, max = 5 }) => (
  <span className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => {
      const full = i < Math.floor(value);
      const half = !full && i < value;
      return (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={full ? "#f59e0b" : half ? "url(#half)" : "none"} stroke="#f59e0b" strokeWidth="2">
          {half && <defs><linearGradient id="half"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>}
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    })}
  </span>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ label, color = "green" }) => {
  const colors = {
    green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
    gray: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-300",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>{label}</span>;
};

// ─── Sidebar nav item ─────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, badge, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
      ${active
        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
        : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-white"
      }`}
  >
    <Icon name={icon} size={18} />
    <span className="flex-1 text-left">{label}</span>
    {badge && (
      <span className="min-w-5 h-5 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold px-1">{badge}</span>
    )}
  </button>
);

// ─── Product card (marketplace) ───────────────────────────────────────────────
const gradeColors = { "A+": "green", A: "blue", B: "amber", "B+": "amber" };
const cropEmojis = { Wheat: "🌾", Rice: "🍚", Chickpea: "🫘", Mustard: "🌻", Moong: "🫛" };

const ProductCard = ({ p, onView, dark }) => (
  <div className={`rounded-2xl border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group
    ${dark ? "bg-gray-800/60 border-gray-700/60 hover:border-emerald-500/50" : "bg-white border-gray-200 hover:border-emerald-400/60"}`}>
    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-6xl select-none">
      {cropEmojis[p.crop] || "🌱"}
      <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 transition-colors">
        <Icon name="heart" size={14} />
      </button>
      <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold
        ${p.grade === "A+" ? "bg-emerald-500 text-white" : p.grade === "A" ? "bg-blue-500 text-white" : "bg-amber-500 text-white"}`}>
        {p.grade} Grade
      </span>
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</h3>
          <p className="text-xs text-gray-500">{p.supplier} • {p.location}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mt-2 mb-3">
        <span>Moisture: {p.moisture}</span>
        <span>Protein: {p.protein}</span>
        <span>FM: {p.fm}</span>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-lg font-bold text-emerald-600">₹{p.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500"> /Quintal</span>
        </div>
        <div className="text-right text-xs text-gray-500">
          <div>Min: {p.minQty} Qtl</div>
          <div>📦 {p.delivery}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onView(p)} className="flex-1 py-2 text-xs font-semibold border rounded-xl transition-colors
          border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
          View Details
        </button>
        <button className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
          Contact
        </button>
      </div>
    </div>
  </div>
);

// ─── QR Code SVG ──────────────────────────────────────────────────────────────
const QRCode = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full" fill="currentColor">
    {/* Simplified QR pattern */}
    {[0,1,2,3,4,5,6].map(r => [0,1,2,3,4,5,6].map(c => {
      const corner = (r < 7 && c < 7) || (r < 7 && c > 93) || (r > 93 && c < 7);
      return <rect key={`${r}-${c}`} x={c*14+1} y={r*14+1} width={12} height={12} rx={1}
        opacity={Math.random() > 0.5 || (r <= 1 || r >= 5) && (c <= 1 || c >= 5) ? 1 : 0.15}/>;
    }))}
  </svg>
);

// ─── Timeline Step ────────────────────────────────────────────────────────────
const TimelineStep = ({ icon, label, desc, time, status, dark }) => {
  const isDone = status === "done";
  const isActive = status === "active";
  const isPending = status === "pending";
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
          ${isDone ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            : isActive ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 border-2 border-emerald-500 animate-pulse"
            : "bg-gray-100 dark:bg-gray-700 text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600"}`}>
          {isDone ? <Icon name="checkCircle" size={18} /> : <Icon name={icon} size={16} />}
        </div>
        <div className={`w-0.5 h-10 ${isDone ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
      </div>
      <div className="pb-6 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{label}</span>
          {isActive && <Badge label="Active" color="green" />}
        </div>
        <p className="text-xs text-gray-500">{desc}</p>
        <p className={`text-xs mt-1 ${isDone || isActive ? "text-emerald-500 font-medium" : "text-gray-400"}`}>{time}</p>
      </div>
    </div>
  );
};

// ─── Dispute Timeline ────────────────────────────────────────────────────────
const DisputeTimeline = ({ steps, dark }) => (
  <div className="flex items-center gap-0 mt-3">
    {steps.map((s, i) => (
      <div key={i} className="flex items-center flex-1">
        <div className={`flex flex-col items-center`}>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
            ${s.done ? "bg-emerald-500 text-white" : s.active ? "bg-amber-400 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}>
            {s.done ? "✓" : s.active ? <Icon name="clock" size={12} /> : "○"}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 text-center whitespace-nowrap">{s.label}</span>
          <span className="text-[9px] text-gray-400 text-center">{s.time}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-0.5 mb-5 mx-1 ${s.done ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
        )}
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function SmartKissan() {
  const { dark, toggle } = useTheme();
  const [page, setPage] = useState("dashboard");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("Wheat");
  const [activeTab, setActiveTab] = useState("disputes");
  const [bidQty, setBidQty] = useState(100);
  const [bidPrice, setBidPrice] = useState(2150);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState({ quality: 5, delivery: 4.5, comm: 5, pack: 4 });
  const [demandForm, setDemandForm] = useState({ product: "Wheat", grade: "", qty: "", location: "Jaipur, Rajasthan", date: "", notes: "", delivery: "Anytime" });
  const [bidTabActive, setBidTabActive] = useState("bid");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const products = [
    { id: 1, name: "Wheat (HD-2967)", crop: "Wheat", grade: "A+", price: 2150, supplier: "Ramesh Kumar", location: "Jaipur, Rajasthan", moisture: "12%", protein: "11.5%", fm: "1%", damage: "0.5%", minQty: 50, delivery: "2-3 Days", stock: 500, rating: 4.7, reviews: 128, orders: 128, ontime: "98%", products: 4 },
    { id: 2, name: "Wheat (Lok-1)", crop: "Wheat", grade: "A", price: 2080, supplier: "Kisan Co-op", location: "Kota, Rajasthan", moisture: "12.5%", protein: "11%", fm: "1.5%", damage: "0.8%", minQty: 100, delivery: "3-4 Days", stock: 300, rating: 4.5, reviews: 95, orders: 95, ontime: "96%", products: 3 },
    { id: 3, name: "Wheat (HD-3086)", crop: "Wheat", grade: "A", price: 2060, supplier: "Agro Foods Pvt.", location: "Alwar, Rajasthan", moisture: "13%", protein: "10.8%", fm: "2%", damage: "1%", minQty: 75, delivery: "2-4 Days", stock: 450, rating: 4.8, reviews: 210, orders: 210, ontime: "99%", products: 6 },
    { id: 4, name: "Wheat (PBW-343)", crop: "Wheat", grade: "B+", price: 1980, supplier: "Shyam Traders", location: "Indore, MP", moisture: "13.5%", protein: "10%", fm: "2%", damage: "1.2%", minQty: 50, delivery: "4-5 Days", stock: 200, rating: 4.3, reviews: 67, orders: 67, ontime: "93%", products: 2 },
    { id: 5, name: "Wheat (Raj-4037)", crop: "Wheat", grade: "B", price: 1920, supplier: "Rajasthan Farms", location: "Bharatpur, RJ", moisture: "14%", protein: "9.5%", fm: "2.5%", damage: "1.5%", minQty: 50, delivery: "5-6 Days", stock: 180, rating: 4.1, reviews: 45, orders: 45, ontime: "91%", products: 2 },
  ];

  const marketplaceProducts = [
    { id: 1, name: "Wheat (HD-2967)", crop: "Wheat", grade: "A+", price: 2150, supplier: "Ramesh Kumar", location: "Rajarh, MP", minQty: 50, delivery: "2-3 Days", rating: 4.7 },
    { id: 2, name: "Chickpea (Desi)", crop: "Chickpea", grade: "A+", price: 5450, supplier: "Shyam Traders", location: "Kota, Rajasthan", minQty: 40, delivery: "2-3 Days", rating: 4.6 },
    { id: 3, name: "Mustard Seed", crop: "Mustard", grade: "A", price: 4200, supplier: "Kisan Co-op", location: "Sikar, Rajasthan", minQty: 30, delivery: "3-4 Days", rating: 4.8 },
    { id: 4, name: "Basmati Rice (1121)", crop: "Rice", grade: "A", price: 6850, supplier: "Agro Foods Pvt.", location: "Alwar, Rajasthan", minQty: 25, delivery: "2-3 Days", rating: 4.9 },
    { id: 5, name: "Moong Dal (Green)", crop: "Moong", grade: "A", price: 6100, supplier: "Rajasthan Farms", location: "Udaipur, Rajasthan", minQty: 50, delivery: "3-4 Days", rating: 4.5 },
  ];

  const bg = dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900";
  const card = dark ? "bg-gray-800/70 border-gray-700/60" : "bg-white border-gray-200";
  const sidebar = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const inputCls = dark
    ? "bg-gray-700/60 border-gray-600 text-white placeholder-gray-400 focus:border-emerald-500"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-emerald-500";

  const navItems = [
    { icon: "home", label: "Dashboard", id: "dashboard" },
    { icon: "search", label: "Search Produce", id: "search" },
    { icon: "plus", label: "Create Demand", id: "demand" },
    { icon: "list", label: "My Demands", id: "demands" },
    { icon: "box", label: "My Orders", id: "orders", badge: 2 },
    { icon: "users", label: "Suppliers", id: "suppliers" },
    { icon: "msg", label: "Messages", id: "messages", badge: 3 },
    { icon: "file", label: "Contracts", id: "contracts" },
    { icon: "pay", label: "Payments", id: "payments" },
    { icon: "bookmark", label: "Saved Searches", id: "saved" },
    { icon: "settings", label: "Settings", id: "settings" },
  ];

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl" : "hidden lg:flex flex-col w-60 flex-shrink-0"} 
      flex flex-col h-full border-r transition-all duration-300 ${sidebar}`}>
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-600/30">
          🌿
        </div>
        <div>
          <div className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Smart-Kissan</div>
          <div className="text-xs text-gray-500">Agri Marketplace</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto text-gray-400 hover:text-gray-600">
            <Icon name="x" size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.id} {...item} active={page === item.id}
            onClick={() => { setPage(item.id); setSidebarOpen(false); }} />
        ))}
      </nav>

      {/* Help card */}
      <div className="p-3">
        <div className={`rounded-2xl p-4 ${dark ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"}`}>
          <p className={`text-xs font-semibold mb-1 ${dark ? "text-white" : "text-gray-800"}`}>Need Help?</p>
          <p className="text-xs text-gray-500 mb-3">Our support team is here to assist you.</p>
          <button className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
            <Icon name="msg" size={13} /> Chat with Support
          </button>
        </div>
        {/* Tractor illustration placeholder */}
        <div className="mt-3 h-16 rounded-xl bg-gradient-to-r from-emerald-900/30 to-green-900/20 flex items-center justify-center text-3xl">🚜</div>
      </div>
    </aside>
  );

  // ── Top Navbar ────────────────────────────────────────────────────────────────
  const Topbar = () => (
    <header className={`h-16 flex items-center gap-3 px-4 lg:px-6 border-b flex-shrink-0 ${sidebar}`}>
      <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setSidebarOpen(true)}>
        <Icon name="menu" size={20} />
      </button>

      {/* Logo mobile */}
      <div className="flex items-center gap-2 lg:hidden">
        <span className="text-xl">🌿</span>
        <span className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Smart-Kissan</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && setPage("search")}
            placeholder="Search for crops, pulses, spices and more..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none transition-colors ${inputCls}`}
          />
          <button onClick={() => setPage("search")} className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            Search
          </button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme */}
        <button onClick={toggle} className={`p-2 rounded-xl transition-colors ${dark ? "text-amber-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>
          <Icon name={dark ? "sun" : "moon"} size={18} />
        </button>
        {/* Wishlist */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => showToast("Wishlist opened")}>
          <Icon name="heart" size={18} />
          {wishlistCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>}
        </button>
        {/* Cart */}
        <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => showToast("Cart opened")}>
          <Icon name="cart" size={18} />
          {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
        </button>
        {/* User */}
        <div className={`flex items-center gap-2 ml-1 pl-3 border-l ${dark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">A</div>
          <div className="hidden md:block">
            <div className={`text-xs font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Amit Verma</div>
            <div className="text-[10px] text-gray-500">Business Buyer</div>
          </div>
          <Icon name="chevronDown" size={14} className="text-gray-400 hidden md:block" />
        </div>
      </div>
    </header>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE: DASHBOARD / MARKETPLACE
  // ══════════════════════════════════════════════════════════════════════════════
  const PageDashboard = () => {
    const cats = ["🌾 Wheat", "🍚 Rice", "🫘 Pulses", "🌻 Oilseeds", "🌶 Spices", "🌾 Millets", "🥦 Vegetables", "🍊 Fruits", "••• More"];
    const features = [
      { icon: "shield", label: "Verified Sellers", sub: "Trusted & Verified" },
      { icon: "checkCircle", label: "Quality Assured", sub: "Graded & Tested" },
      { icon: "pay", label: "Secure Payments", sub: "100% Safe & Secure" },
      { icon: "truck", label: "On-time Delivery", sub: "Pan India Delivery" },
    ];
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
        {/* Hero banner */}
        <div className={`rounded-2xl overflow-hidden border ${card}`}>
          <div className={`relative p-6 lg:p-10 ${dark ? "bg-gradient-to-r from-amber-900/20 via-stone-800/30 to-gray-800" : "bg-gradient-to-r from-amber-50 via-stone-50 to-white"}`}>
            <div className="max-w-sm">
              <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Good Produce.<br />Strong Relationships.</h1>
              <p className="text-sm text-gray-500 mb-5">Buy directly from verified farmers and trusted sellers across India.</p>
              <button onClick={() => setPage("search")} className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95">
                Shop Now
              </button>
            </div>
            <div className="absolute right-4 bottom-0 text-7xl hidden sm:block select-none">🛒</div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {cats.map((c, i) => (
            <button key={i} onClick={() => setPage("search")} className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all hover:-translate-y-1`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 transition-colors
                ${dark ? "bg-gray-800 border-gray-700 hover:border-emerald-500" : "bg-white border-gray-200 hover:border-emerald-400"}`}>
                {c.split(" ")[0]}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{c.split(" ").slice(1).join(" ")}</span>
            </button>
          ))}
        </div>

        {/* Best Deals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-gray-900"}`}>Best Deals for You</h2>
            <button className="text-sm text-emerald-600 font-medium hover:underline">View all →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {marketplaceProducts.map(p => (
              <ProductCard key={p.id} p={p} dark={dark} onView={prod => { setSelectedProduct(prod); setPage("productDetail"); }} />
            ))}
          </div>
        </div>

        {/* Trust features */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border p-4 ${card}`}>
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Icon name={f.icon} size={18} />
              </div>
              <div>
                <div className={`text-xs font-semibold ${dark ? "text-white" : "text-gray-800"}`}>{f.label}</div>
                <div className="text-[11px] text-gray-500">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE: SEARCH & DEMAND CREATION
  // ══════════════════════════════════════════════════════════════════════════════
  const PageSearch = () => {
    const [activeFilter, setActiveFilter] = useState(null);
    const filters = ["Location", "Quality Grade", "Price Range", "Quantity", "Delivery Time"];
    const tabs = ["All Results (128)", "Products (112)", "Suppliers (16)"];
    const [activeResultTab, setActiveResultTab] = useState(0);

    return (
      <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row h-full">
        {/* Results */}
        <div className="flex-1 p-4 lg:p-6 min-w-0 overflow-y-auto lg:overflow-hidden">
          {/* Tabs */}
          <div className={`flex items-center gap-4 border-b mb-4 ${dark ? "border-gray-700" : "border-gray-200"}`}>
            {tabs.map((t, i) => (
              <button key={i} onClick={() => setActiveResultTab(i)}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${activeResultTab === i
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {t}
              </button>
            ))}
            <button className="ml-auto flex items-center gap-2 px-3 py-1.5 text-xs border rounded-xl font-medium text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Icon name="filter" size={13} /> Filters
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {filters.map((f, i) => (
              <button key={i} onClick={() => setActiveFilter(activeFilter === i ? null : i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all flex-shrink-0
                  ${activeFilter === i
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : dark ? "border-gray-700 text-gray-300 hover:border-gray-500" : "border-gray-300 text-gray-600 hover:border-gray-400"}`}>
                {f} <Icon name="chevronDown" size={11} />
              </button>
            ))}
            <button className="px-3 py-1.5 text-xs text-emerald-600 font-medium hover:underline whitespace-nowrap flex-shrink-0">Clear All</button>
          </div>

          {/* Product list */}
          <div className="space-y-3">
            {products.map(p => (
              <div key={p.id} className={`rounded-2xl border p-4 flex gap-4 transition-all hover:shadow-md ${card}`}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-4xl flex-shrink-0">
                  {cropEmojis[p.crop] || "🌱"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-1">
                    <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</span>
                    <Badge label={`${p.grade} Grade`} color={gradeColors[p.grade] || "blue"} />
                  </div>
                  <p className="text-xs text-gray-500 mb-1.5">
                    <span className="text-emerald-600 font-medium">✓</span> {p.supplier} • {p.location}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 mb-2">
                    <span>Moisture: {p.moisture}</span>
                    <span>Protein: {p.protein}</span>
                    <span>FM: {p.fm}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span>📦 Min: {p.minQty} Qtl</span>
                    <span>🚚 {p.delivery}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-emerald-600">₹{p.price.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mb-3">₹{(p.price * 100).toLocaleString()} for 100 Qtl</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { setSelectedProduct(p); setPage("productDetail"); }}
                      className="px-4 py-1.5 text-xs font-semibold border border-emerald-500 text-emerald-600 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-sm text-gray-500 hover:text-emerald-600 font-medium flex items-center justify-center gap-2 transition-colors">
              Load More Results ↓
            </button>
          </div>
        </div>

        {/* Demand creation panel */}
        <div className={`w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l flex-shrink-0 p-4 lg:p-5 overflow-y-auto ${dark ? "border-gray-700" : "border-gray-200"} ${dark ? "bg-gray-900/50" : "bg-gray-50/80"}`}>
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
              <Icon name="file" size={18} />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Create New Demand</h3>
              <p className="text-xs text-gray-500">Tell us what you need. We'll notify suppliers.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Product</label>
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${inputCls} text-sm`}>
                <span>🌾</span>
                <span className="flex-1">{demandForm.product}</span>
                <Icon name="chevronDown" size={14} className="text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Quality Grade</label>
              <select value={demandForm.grade} onChange={e => setDemandForm({ ...demandForm, grade: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`}>
                <option value="">Select Grade</option>
                <option>A+ Grade</option><option>A Grade</option><option>B+ Grade</option><option>B Grade</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Required Quantity</label>
              <div className="flex gap-2">
                <input type="number" placeholder="e.g. 100" value={demandForm.qty} onChange={e => setDemandForm({ ...demandForm, qty: e.target.value })}
                  className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`} />
                <span className={`px-3 py-2.5 rounded-xl border text-sm ${dark ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"}`}>Quintal</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Delivery Location</label>
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${inputCls} text-sm`}>
                <Icon name="mapPin" size={14} className="text-gray-400" />
                <input value={demandForm.location} onChange={e => setDemandForm({ ...demandForm, location: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm" placeholder="Jaipur, Rajasthan" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Required Delivery Date</label>
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${inputCls} text-sm`}>
                <Icon name="clock" size={14} className="text-gray-400" />
                <input type="date" value={demandForm.date} onChange={e => setDemandForm({ ...demandForm, date: e.target.value })}
                  className="flex-1 bg-transparent outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-gray-500">Additional Requirements <span className="text-gray-400">(Optional)</span></label>
              <textarea rows={3} placeholder="e.g. Moisture < 12%, Protein > 11%, etc." value={demandForm.notes}
                onChange={e => setDemandForm({ ...demandForm, notes: e.target.value })}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none ${inputCls}`} />
              <div className="text-right text-[10px] text-gray-400 mt-0.5">{demandForm.notes.length}/200</div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-2 text-gray-500">Delivery Preference</label>
              <div className="flex flex-wrap gap-2">
                {["Anytime", "Within 3 Days", "Within a Week", "Custom"].map(opt => (
                  <button key={opt} onClick={() => setDemandForm({ ...demandForm, delivery: opt })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                      ${demandForm.delivery === opt
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : dark ? "border-gray-600 text-gray-400 hover:border-emerald-500" : "border-gray-300 text-gray-600 hover:border-emerald-400"}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Supplier notify */}
            <div className={`rounded-xl p-3 flex items-start gap-3 ${dark ? "bg-blue-900/20 border border-blue-800/40" : "bg-blue-50 border border-blue-100"}`}>
              <Icon name="bell" size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-600">Suppliers will send you their best offers</p>
                <p className="text-[11px] text-gray-500">You'll get notified via email & SMS</p>
              </div>
            </div>

            <button onClick={() => { showToast("Demand created! Suppliers will be notified."); setPage("demands"); }}
              className="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95">
              Create Demand
            </button>
            <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
              <Icon name="shield" size={11} /> Your information is safe and secure
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE: PRODUCT DETAIL + BID + ESCROW
  // ══════════════════════════════════════════════════════════════════════════════
  const PageProductDetail = () => {
    const p = selectedProduct || products[0];
    const [activeImg, setActiveImg] = useState(0);
    const imgs = ["🌾", "🌾", "🌿", "🌱", "🌾"];
    const totalAmount = bidQty * bidPrice;
    const recentBids = [
      { user: "Amit Verma (You)", qty: 100, price: 2150, status: "Pending", time: "2 mins ago" },
      { user: "Agro Foods Pvt. Ltd.", qty: 200, price: 2120, status: "Accepted", time: "1 day ago" },
      { user: "Shyam Traders", qty: 150, price: 2100, status: "Rejected", time: "2 days ago" },
    ];
    const statusColor = { Pending: "amber", Accepted: "green", Rejected: "red" };

    return (
      <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row h-full">
        {/* Main */}
        <div className="flex-1 p-4 lg:p-6 min-w-0 overflow-y-auto lg:overflow-hidden">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
            <button onClick={() => setPage("dashboard")} className="hover:text-emerald-600 transition-colors">Home</button>
            <Icon name="chevronRight" size={12} />
            <button onClick={() => setPage("search")} className="hover:text-emerald-600 transition-colors">Search</button>
            <Icon name="chevronRight" size={12} />
            <span className={dark ? "text-white" : "text-gray-900"}>{p.name}</span>
          </div>

          <div className={`rounded-2xl border p-5 ${card}`}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image gallery */}
              <div className="flex-shrink-0">
                <div className="relative w-full md:w-72 h-52 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-7xl mb-3">
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">{p.grade}+ Grade</span>
                  {imgs[activeImg]}
                  <button className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-400 hover:text-red-500 transition-colors">
                    <Icon name="heart" size={14} />
                  </button>
                </div>
                <div className="flex gap-2">
                  {imgs.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl border-2 transition-all
                        ${activeImg === i ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                      {img}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className={`text-xl font-bold ${dark ? "text-white" : "text-gray-900"}`}>{p.name}</h1>
                  <Badge label={`${p.grade}+ Grade`} color="green" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span>by</span>
                  <span className="font-medium text-emerald-600">{p.supplier}</span>
                  <span className="text-emerald-500">✓</span>
                  <Stars value={p.rating} />
                  <span>{p.rating}</span>
                  <span>•</span>
                  <Icon name="mapPin" size={13} />
                  <span>{p.location}</span>
                </div>

                {/* Quality stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[["Moisture", p.moisture], ["Protein", p.protein], ["Foreign Matter", p.fm], ["Damage", p.damage]].map(([k, v]) => (
                    <div key={k} className={`p-2 rounded-xl text-center ${dark ? "bg-gray-700/50" : "bg-gray-50"}`}>
                      <div className="text-xs text-gray-500">{k}</div>
                      <div className={`font-bold text-sm mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{v}</div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <span className="text-2xl font-bold text-emerald-600">₹{p.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-500"> /Quintal</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">Minimum Order Quantity: {p.minQty} Quintal</p>
                <p className="text-xs text-gray-500 mb-1">Available Quantity: {p.stock} Quintal</p>
                <p className="text-xs text-gray-500 mb-4">🚚 Delivery: {p.delivery}</p>

                <div className="flex gap-3">
                  <button onClick={() => showToast("Chat opened with supplier")}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors
                      ${dark ? "border-gray-600 text-gray-300 hover:border-emerald-500 hover:text-emerald-400" : "border-gray-300 text-gray-700 hover:border-emerald-400 hover:text-emerald-600"}`}>
                    <Icon name="msg" size={15} /> Chat with Supplier
                  </button>
                  <button onClick={() => setBidTabActive("bid")}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95">
                    Place Bid
                  </button>
                </div>
              </div>
            </div>

            {/* Product Overview */}
            <div className={`mt-6 pt-5 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className={`font-bold text-sm mb-2 ${dark ? "text-white" : "text-gray-900"}`}>Product Overview</h3>
              <p className="text-sm text-gray-500 mb-3">High quality wheat ({p.name.split("(")[1]?.replace(")", "")}) procured directly from farm. Cleaned and properly packed to maintain best quality.</p>
              <div className="flex flex-wrap gap-3">
                {["🤚 Hand Picked", "✨ Clean & Sorted", "⚙️ Good Milling Quality", "🌿 Natural & Safe"].map((f, i) => (
                  <span key={i} className={`text-xs px-3 py-1.5 rounded-full ${dark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>{f}</span>
                ))}
              </div>
            </div>

            {/* Cert + Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <div className={`p-4 rounded-xl border ${dark ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="file" size={16} className="text-emerald-600" />
                  <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Quality Certificate</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">Verified by Smart-Kissan</p>
                <button className="text-xs px-3 py-1.5 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  View Certificate
                </button>
              </div>
              <div className={`p-4 rounded-xl border ${dark ? "border-gray-700 bg-gray-700/30" : "border-gray-200 bg-gray-50"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="mapPin" size={16} className="text-emerald-600" />
                  <span className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Product Location</span>
                </div>
                <p className="text-xs text-gray-500 mb-2">📍 {p.location}</p>
                <button className="text-xs px-3 py-1.5 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  🗺️ View on Map
                </button>
              </div>
            </div>

            {/* Supplier info */}
            <div className={`mt-5 pt-5 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
              <h3 className={`font-bold text-sm mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Supplier Information</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">👨‍🌾</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{p.supplier}</span>
                    <span className="text-emerald-500">✓</span>
                    <Stars value={p.rating} />
                    <span className="text-xs text-gray-500">({p.reviews} Reviews)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {[["Total Orders", p.orders], ["On-time Delivery", p.ontime], ["Products Listed", p.products]].map(([k, v]) => (
                      <div key={k}>
                        <div className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>{v}</div>
                        <div className="text-[11px] text-gray-500">{k}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>👤 Member since Apr 2021</span>
                    <span>⏱ Typically replies within 30 mins</span>
                  </div>
                </div>
                <button onClick={() => showToast("Viewing supplier store")}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                  View Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bid & Escrow Panel */}
        <div className={`w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l flex-shrink-0 p-5 overflow-y-auto ${dark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50/80"}`}>
          {/* Tabs */}
          <div className={`flex rounded-xl border mb-5 overflow-hidden ${dark ? "border-gray-700" : "border-gray-200"}`}>
            {["bid", "escrow"].map(tab => (
              <button key={tab} onClick={() => setBidTabActive(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors
                  ${bidTabActive === tab ? "bg-emerald-600 text-white" : dark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {tab === "bid" ? "Place Bid" : "Escrow Protection"}
              </button>
            ))}
          </div>

          {bidTabActive === "bid" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-500">Quantity</label>
                <div className="flex gap-2">
                  <input type="number" value={bidQty} onChange={e => setBidQty(Number(e.target.value))}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`} />
                  <span className={`px-3 py-2.5 rounded-xl border text-sm ${dark ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"}`}>Quintal</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-500">Your Bid Price</label>
                <div className="flex gap-2">
                  <input type="number" value={bidPrice} onChange={e => setBidPrice(Number(e.target.value))}
                    className={`flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none ${inputCls}`} />
                  <span className={`px-3 py-2.5 rounded-xl border text-sm whitespace-nowrap ${dark ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-600"}`}>/ Quintal</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">Total Amount</span>
                <span className="text-xl font-bold text-emerald-600">₹{totalAmount.toLocaleString()}</span>
              </div>
              <div className={`rounded-xl p-3 ${dark ? "bg-amber-900/20 border border-amber-800/30" : "bg-amber-50 border border-amber-100"}`}>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  💡 Your bid will be sent to the supplier. You can negotiate on price, quantity and delivery terms.
                </p>
              </div>
              <button onClick={() => { showToast("Bid sent to supplier! Awaiting response."); setPage("orders"); }}
                className="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-2">
                <Icon name="send" size={16} /> Send Bid
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                <Icon name="shield" size={24} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <p className={`text-sm font-semibold ${dark ? "text-white" : "text-gray-900"}`}>Escrow Protection</p>
                  <p className="text-xs text-gray-500">Your payment is safe with Smart-Kissan Escrow</p>
                </div>
              </div>
              {[
                ["checkCircle", "You place a bid and agree on terms"],
                ["checkCircle", "Payment is held securely in escrow"],
                ["checkCircle", "Supplier ships the product"],
                ["checkCircle", "You confirm delivery & release payment"],
              ].map(([icon, text], i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={icon} size={12} className="text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Recent bids */}
          <div className={`mt-6 pt-5 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`text-xs font-bold ${dark ? "text-white" : "text-gray-900"}`}>Recent Bids on this Product</h4>
              <button className="text-xs text-emerald-600 hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {recentBids.map((b, i) => (
                <div key={i} className={`p-3 rounded-xl ${dark ? "bg-gray-800/50" : "bg-white"} border ${dark ? "border-gray-700" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{b.user}</span>
                    <Badge label={b.status} color={statusColor[b.status]} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>₹{b.price}/Qtl • {b.qty} Quintal</span>
                    <span>{b.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE: ORDER TRACKING + QR
  // ══════════════════════════════════════════════════════════════════════════════
  const PageOrderTracking = () => {
    const steps = [
      { icon: "checkCircle", label: "Order Confirmed", desc: "Your order has been confirmed by the supplier.", time: "25 May 2024, 10:30 AM", status: "done" },
      { icon: "shield", label: "Payment Secured", desc: "Payment is held securely in escrow.", time: "25 May 2024, 10:45 AM", status: "done" },
      { icon: "truck", label: "Dispatched", desc: "Order has been picked up and shipped.", time: "26 May 2024, 09:20 AM", status: "done" },
      { icon: "mapPin", label: "In Transit", desc: "Your order is on the way to Jaipur, Rajasthan.", time: "27 May 2024, 02:15 PM", status: "active" },
      { icon: "checkCircle", label: "Delivered", desc: "Item will be delivered and payment released.", time: "Expected by 28 May 2024", status: "pending" },
    ];

    return (
      <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row h-full">
        {/* Main */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <button onClick={() => setPage("orders")} className="hover:text-emerald-600">My Orders</button>
            <Icon name="chevronRight" size={12} />
            <span className={dark ? "text-white" : "text-gray-900"}>Order Details</span>
          </div>

          {/* Order header */}
          <div className={`rounded-2xl border p-5 mb-5 ${card}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-4xl flex-shrink-0">🌾</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>Wheat (HD-2967)</h2>
                  <Badge label="A+ Grade" color="green" />
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    🚛 In Transit
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  Order ID: <span className="font-medium text-gray-700 dark:text-gray-300">#SKO-2024-05-0112</span>
                  <button onClick={() => showToast("Order ID copied!")} className="ml-1 text-gray-400 hover:text-gray-600"><Icon name="copy" size={11} /></button>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  {[["Supplier", "Ramesh Kumar ✓"], ["Quantity", "100 Quintal"], ["Order Date", "25 May 2024"], ["Total Amount", "₹2,15,000"]].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs text-gray-500">{k}</div>
                      <div className={`font-semibold text-sm mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tracking timeline */}
          <div className={`rounded-2xl border p-5 mb-5 ${card}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Order Tracking</h3>
                <p className="text-xs text-gray-500">Real-time updates of your order from pickup to delivery.</p>
              </div>
              <button onClick={() => showToast("Viewing full history")} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors">
                <Icon name="clock" size={13} /> View History
              </button>
            </div>
            {steps.map((s, i) => (
              <TimelineStep key={i} {...s} dark={dark} />
            ))}
          </div>

          {/* Escrow notice */}
          <div className={`rounded-2xl border p-5 flex items-center gap-4 ${dark ? "bg-emerald-900/10 border-emerald-800/30" : "bg-emerald-50 border-emerald-200"}`}>
            <Icon name="shield" size={28} className="text-emerald-600 flex-shrink-0" />
            <div className="flex-1">
              <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Your Payment is Secured</p>
              <p className="text-xs text-gray-500 mt-0.5">₹2,15,000 is held in escrow. It will be released to the supplier after you confirm safe delivery and quality.</p>
            </div>
            <button onClick={() => showToast("Escrow details opened")} className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors flex-shrink-0">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Panel: QR + Summary */}
        <div className={`w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l p-5 flex-shrink-0 overflow-y-auto ${dark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50/80"}`}>
          {/* QR Code */}
          <div className={`rounded-2xl border p-5 mb-5 ${card}`}>
            <h3 className={`font-bold text-sm mb-1 ${dark ? "text-white" : "text-gray-900"}`}>Shipment QR Code</h3>
            <p className="text-xs text-gray-500 mb-4">Scan to view real-time tracking details</p>
            <div className={`w-full aspect-square rounded-xl p-4 flex items-center justify-center mb-3 ${dark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}>
              {/* QR SVG */}
              <svg viewBox="0 0 210 210" className="w-full h-full max-w-48 max-h-48" xmlns="http://www.w3.org/2000/svg">
                <rect width="210" height="210" fill={dark ? "#1f2937" : "#f9fafb"} rx="8"/>
                {/* Corner squares */}
                <rect x="10" y="10" width="60" height="60" rx="4" fill={dark ? "#10b981" : "#065f46"} opacity="0.9"/>
                <rect x="17" y="17" width="46" height="46" rx="2" fill={dark ? "#1f2937" : "#f9fafb"}/>
                <rect x="24" y="24" width="32" height="32" rx="1" fill={dark ? "#10b981" : "#065f46"}/>
                <rect x="140" y="10" width="60" height="60" rx="4" fill={dark ? "#10b981" : "#065f46"} opacity="0.9"/>
                <rect x="147" y="17" width="46" height="46" rx="2" fill={dark ? "#1f2937" : "#f9fafb"}/>
                <rect x="154" y="24" width="32" height="32" rx="1" fill={dark ? "#10b981" : "#065f46"}/>
                <rect x="10" y="140" width="60" height="60" rx="4" fill={dark ? "#10b981" : "#065f46"} opacity="0.9"/>
                <rect x="17" y="147" width="46" height="46" rx="2" fill={dark ? "#1f2937" : "#f9fafb"}/>
                <rect x="24" y="154" width="32" height="32" rx="1" fill={dark ? "#10b981" : "#065f46"}/>
                {/* Center logo */}
                <circle cx="105" cy="105" r="20" fill={dark ? "#10b981" : "#065f46"}/>
                <text x="105" y="112" textAnchor="middle" fontSize="18" fill="white">🌿</text>
                {/* Data dots */}
                {[80,90,100,120,130].map(x => [80,90,100,120,130].map(y => (
                  Math.sin(x * y) > 0.3 && !(x >= 85 && x <= 125 && y >= 85 && y <= 125) &&
                  <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1" fill={dark ? "#10b981" : "#065f46"} opacity="0.7"/>
                )))}
                {[75,85,95,115,125,135].map(x => [75,115,135].map(y => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" rx="1" fill={dark ? "#6ee7b7" : "#047857"} opacity="0.5"/>
                )))}
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Order ID: SKO-2024-05-0112</p>
              <p className="text-xs text-gray-500">Scan this QR code to track your shipment</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className={`rounded-2xl border p-5 mb-5 ${card}`}>
            <h3 className={`font-bold text-sm mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Order Summary</h3>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-2xl">🌾</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>Wheat (HD-2967)</p>
                <Badge label="A+ Grade" color="green" />
              </div>
              <span className="text-sm text-gray-500">100 Quintal</span>
            </div>
            {[["Price", "₹2,150 / Quintal"], ["Subtotal", "₹2,15,000"], ["Delivery Charges", "₹1,500"]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{k}</span>
                <span className={dark ? "text-gray-300" : "text-gray-700"}>{v}</span>
              </div>
            ))}
            <div className={`flex justify-between items-center pt-3 border-t mt-1 ${dark ? "border-gray-700" : "border-gray-200"}`}>
              <span className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Total Amount</span>
              <span className="font-bold text-emerald-600 text-lg">₹2,16,500</span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className={`rounded-2xl border p-5 ${card}`}>
            <h3 className={`font-bold text-sm mb-4 ${dark ? "text-white" : "text-gray-900"}`}>Delivery Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">📍 Delivery Address</p>
                <p className={`text-xs font-medium ${dark ? "text-white" : "text-gray-900"}`}>Amit Verma</p>
                <p className="text-xs text-gray-500">123, Vaishali Nagar,</p>
                <p className="text-xs text-gray-500">Jaipur, Rajasthan - 302021</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">🚛 Transporter</p>
                <p className={`text-xs font-medium ${dark ? "text-white" : "text-gray-900"}`}>Shreeji Logistics</p>
                <p className="text-xs text-gray-500">RJ14 GH 1234</p>
                <button onClick={() => showToast("Tracking vehicle location...")} className="mt-2 text-xs px-3 py-1.5 border border-emerald-500 text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                  Track Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // PAGE: DISPUTES & RATINGS
  // ══════════════════════════════════════════════════════════════════════════════
  const PageDisputes = () => {
    const [hoverRating, setHoverRating] = useState({});
    const disputeSteps = [
      { label: "Dispute Raised", time: "29 May, 11:20 AM", done: true, active: false },
      { label: "Supplier Response", time: "30 May, 09:15 AM", done: true, active: false },
      { label: "Under Review", time: "30 May, 02:30 PM", done: false, active: true },
      { label: "Resolved", time: "Pending", done: false, active: false },
    ];
    const ratingItems = [
      { label: "Product Quality", key: "quality", val: 5 },
      { label: "On-time Delivery", key: "delivery", val: 4.5 },
      { label: "Communication", key: "comm", val: 5 },
      { label: "Packaging", key: "pack", val: 4 },
    ];
    const overallRating = Object.values(rating).reduce((a, b) => a + b, 0) / Object.values(rating).length;
    const ratingLabel = overallRating >= 4.5 ? "Excellent" : overallRating >= 4 ? "Very Good" : overallRating >= 3 ? "Good" : "Average";

    return (
      <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row h-full">
        {/* Main */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 flex-wrap">
            <button onClick={() => setPage("orders")} className="hover:text-emerald-600">My Orders</button>
            <Icon name="chevronRight" size={12} />
            <button onClick={() => setPage("orders")} className="hover:text-emerald-600">Order Details</button>
            <Icon name="chevronRight" size={12} />
            <span className={dark ? "text-white" : "text-gray-900"}>Disputes & Ratings</span>
          </div>

          {/* Order header */}
          <div className={`rounded-2xl border p-5 mb-5 ${card}`}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-4xl flex-shrink-0">🌾</div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className={`font-bold text-lg ${dark ? "text-white" : "text-gray-900"}`}>Wheat (HD-2967)</h2>
                  <Badge label="A+ Grade" color="green" />
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    ✅ Delivered
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                  Order ID: <span className="font-medium text-gray-700 dark:text-gray-300">SKO-2024-05-0112</span>
                  <button onClick={() => showToast("Copied!")} className="ml-1 text-gray-400 hover:text-gray-600"><Icon name="copy" size={11} /></button>
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[["Supplier", "Ramesh Kumar ✓"], ["Quantity", "100 Quintal"], ["Order Date", "25 May 2024"], ["Total Amount", "₹2,15,000"]].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs text-gray-500">{k}</div>
                      <div className={`font-semibold text-sm mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>{v}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Delivered on <span className="text-gray-600 dark:text-gray-300 font-medium">28 May 2024</span></p>
              </div>
            </div>
          </div>

          {/* Disputes / Ratings tabs */}
          <div className={`flex border-b mb-5 ${dark ? "border-gray-700" : "border-gray-200"}`}>
            {["disputes", "ratings"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-3 px-5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                  ${activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                {tab === "disputes" ? "Disputes" : "Ratings & Reviews"}
              </button>
            ))}
          </div>

          {activeTab === "disputes" ? (
            <div className="space-y-5">
              {/* Raise dispute */}
              <div className={`rounded-2xl border p-5 flex items-center gap-4 ${dark ? "bg-blue-900/10 border-blue-800/30" : "bg-blue-50 border-blue-200"}`}>
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon name="shield" size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Raise a Dispute</p>
                  <p className="text-xs text-gray-500">Facing an issue with this order? Raise a dispute and our team will help you resolve it.</p>
                </div>
                <button onClick={() => showToast("Dispute form opened")}
                  className="px-4 py-2 border border-blue-400 text-blue-600 text-xs font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex-shrink-0">
                  Raise Dispute
                </button>
              </div>

              <h3 className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Your Disputes</h3>

              {/* Active dispute */}
              <div className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <Badge label="Under Review" color="amber" />
                  <span className="text-xs text-gray-500">Dispute ID: DSP-2024-05-0021</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">📦</div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Quality Issue</p>
                    <p className="text-xs text-gray-500">Received quantity has higher moisture content than agreed.</p>
                  </div>
                  <button onClick={() => showToast("Viewing dispute details")}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                    View Details
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4 text-xs text-gray-500">
                  <div><div>Raised On</div><div className={`font-medium mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>29 May 2024</div></div>
                  <div><div>Raised By</div><div className={`font-medium mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>You</div></div>
                  <div><div>Amount In Dispute</div><div className="font-medium mt-0.5 text-red-500">₹21,500</div></div>
                </div>
                <DisputeTimeline steps={disputeSteps} dark={dark} />
              </div>

              <h3 className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Resolved Disputes</h3>

              {/* Resolved dispute */}
              <div className={`rounded-2xl border p-5 ${card}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <Badge label="Resolved" color="green" />
                  <span className="text-xs text-gray-500">Dispute ID: DSP-2024-05-0015</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">📦</div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Short Quantity</p>
                    <p className="text-xs text-gray-500">Delivered quantity was less than confirmed.</p>
                  </div>
                  <button onClick={() => showToast("Viewing resolved dispute")}
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                    View Details
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-gray-500">
                  <div><div>Raised On</div><div className={`font-medium mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>20 May 2024</div></div>
                  <div><div>Resolved On</div><div className={`font-medium mt-0.5 ${dark ? "text-white" : "text-gray-900"}`}>22 May 2024</div></div>
                  <div><div>Refund/Adjustment</div><div className="font-medium mt-0.5 text-emerald-500">₹5,000 Refunded</div></div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Switch to Ratings tab on the right panel →</p>
          )}
        </div>

        {/* Right: Rating panel */}
        <div className={`w-full lg:w-80 xl:w-96 border-t lg:border-t-0 lg:border-l p-5 flex-shrink-0 overflow-y-auto ${dark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50/80"}`}>
          <h3 className={`font-bold text-sm mb-1 ${dark ? "text-white" : "text-gray-900"}`}>Rate Your Experience</h3>
          <p className="text-xs text-gray-500 mb-5">Share your experience with the supplier</p>

          <div className="space-y-4 mb-5">
            {ratingItems.map(item => {
              const val = rating[item.key];
              const label = val >= 4.5 ? "Excellent" : val >= 4 ? "Very Good" : val >= 3 ? "Good" : "Average";
              const labelColor = val >= 4.5 ? "text-emerald-600" : val >= 4 ? "text-blue-500" : "text-amber-500";
              return (
                <div key={item.key} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-28 flex-shrink-0">{item.label}</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star}
                        onMouseEnter={() => setHoverRating({ ...hoverRating, [item.key]: star })}
                        onMouseLeave={() => setHoverRating({})}
                        onClick={() => setRating({ ...rating, [item.key]: star })}
                        className="transition-transform hover:scale-110">
                        <svg width="16" height="16" viewBox="0 0 24 24"
                          fill={star <= (hoverRating[item.key] || val) ? "#f59e0b" : "none"}
                          stroke="#f59e0b" strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 w-8">{val}/5</span>
                  <span className={`text-xs font-semibold ml-auto ${labelColor}`}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Overall */}
          <div className={`rounded-2xl border p-4 mb-5 ${dark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Overall Rating</span>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">{overallRating.toFixed(1)}<span className="text-sm text-gray-400">/5</span></div>
                <div className="text-xs text-emerald-500 font-medium">{ratingLabel}</div>
              </div>
            </div>
          </div>

          {/* Review text */}
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5 text-gray-500">Write your review <span className="text-gray-400">(optional)</span></label>
            <textarea rows={4} placeholder="Share your overall experience..."
              value={reviewText} onChange={e => setReviewText(e.target.value.slice(0, 500))}
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none ${inputCls}`} />
            <div className="text-right text-[10px] text-gray-400 mt-0.5">{reviewText.length}/500</div>
          </div>

          <button onClick={() => showToast("Rating submitted! Thank you for your feedback.")}
            className="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95 mb-6">
            Submit Rating
          </button>

          {/* Why ratings matter */}
          <div>
            <h4 className={`font-bold text-sm mb-3 ${dark ? "text-white" : "text-gray-900"}`}>Why Ratings Matter?</h4>
            <div className="space-y-2">
              {[["🏪", "Help other buyers make better decisions"], ["🛡️", "Build trust in the Smart-Kissan community"], ["⭐", "Encourage suppliers to maintain quality"]].map(([icon, text], i) => (
                <div key={i} className="flex items-start gap-3 text-xs text-gray-500">
                  <span className="text-base">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Need more help */}
          <div className={`mt-5 pt-5 border-t ${dark ? "border-gray-700" : "border-gray-200"}`}>
            <h4 className={`font-bold text-sm mb-1 ${dark ? "text-white" : "text-gray-900"}`}>Need More Help?</h4>
            <p className="text-xs text-gray-500 mb-3">Our support team is here to help you resolve any issue.</p>
            <button onClick={() => showToast("Connecting to support...")}
              className="w-full py-2.5 border border-emerald-500 text-emerald-600 text-sm font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center justify-center gap-2">
              <Icon name="phone" size={14} /> Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ── Placeholder pages ─────────────────────────────────────────────────────────
  const PagePlaceholder = ({ title, icon }) => (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
          {icon}
        </div>
        <h2 className={`text-xl font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>{title}</h2>
        <p className="text-gray-500 text-sm mb-4">This section is coming soon</p>
        <button onClick={() => setPage("dashboard")} className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <PageDashboard />;
      case "search": case "demand": return <PageSearch />;
      case "productDetail": return <PageProductDetail />;
      case "orders": return <PageOrderTracking />;
      case "tracking": return <PageOrderTracking />;
      case "disputes": return <PageDisputes />;
      case "demands": return <PagePlaceholder title="My Demands" icon="📋" />;
      case "suppliers": return <PagePlaceholder title="Suppliers" icon="👨‍🌾" />;
      case "messages": return <PagePlaceholder title="Messages" icon="💬" />;
      case "contracts": return <PagePlaceholder title="Contracts" icon="📄" />;
      case "payments": return <PagePlaceholder title="Payments" icon="💳" />;
      case "saved": return <PagePlaceholder title="Saved Searches" icon="🔖" />;
      case "settings": return <PagePlaceholder title="Settings" icon="⚙️" />;
      default: return <PageDashboard />;
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-sans ${dark ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"}`}
      style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif" }}>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      {sidebarOpen && <Sidebar mobile />}

      <Topbar />

      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {renderPage()}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-3 transition-all duration-300
          ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-500 text-white"}`}
          style={{ animation: "slideUp 0.3s ease" }}>
          <Icon name={toast.type === "success" ? "checkCircle" : "alert"} size={16} />
          {toast.msg}
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100"><Icon name="x" size={14} /></button>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
