import { useState, useEffect, useRef } from "react";

type Page = "landing" | "register";
type Role = "farmer" | "buyer" | "transporter" | "admin";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────
const LeafLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <ellipse cx="13" cy="20" rx="9" ry="13" transform="rotate(-15 13 20)" fill="#22c55e" opacity="0.85"/>
    <ellipse cx="22" cy="18" rx="9" ry="13" transform="rotate(20 22 18)" fill="#16a34a"/>
    <line x1="18" y1="30" x2="18" y2="10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);
const CartIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const TruckIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <rect x="1" y="3" width="15" height="13"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const FarmerIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"/>
    <path d="M8 3.5C8 3.5 10 2 12 2s4 1.5 4 1.5"/>
  </svg>
);
const AdminIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 10-16 0"/>
    <path d="M12 14v7m-3-3h6"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18C.01 1.03.98 0 2.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);
const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const BankIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <rect x="9" y="12" width="6" height="8"/>
  </svg>
);
const CreditCardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);
const HashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const HeadphonesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 18v-6a9 9 0 0118 0v6"/>
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
  </svg>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SmartKissan() {
  const [page, setPage] = useState<Page>("landing");
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const d = dark;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      background: d ? "#0d1a0e" : "#f4f9f4",
      color: d ? "#e8f5e9" : "#1a2e1b",
      minHeight: "100vh",
      transition: "background 0.35s, color 0.35s",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:#22c55e44;border-radius:3px;}
        .nav-link{cursor:pointer;transition:color 0.2s;}
        .nav-link:hover{color:#22c55e!important;}
        .feature-card{transition:transform 0.25s,box-shadow 0.25s;}
        .feature-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px #22c55e22;}
        .path-card{transition:transform 0.25s,box-shadow 0.25s,border-color 0.25s;cursor:pointer;}
        .path-card:hover{transform:translateY(-3px);border-color:#22c55e!important;box-shadow:0 8px 32px #22c55e20;}
        .role-card{transition:all 0.2s;cursor:pointer;}
        .role-card:hover{transform:scale(1.04);}
        .btn-primary{transition:all 0.22s;cursor:pointer;}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 28px #22c55e44;filter:brightness(1.07);}
        .btn-outline{transition:all 0.2s;cursor:pointer;}
        .btn-outline:hover{background:#22c55e!important;color:#fff!important;}
        .input-field{transition:border-color 0.2s,box-shadow 0.2s;}
        .input-field:focus{outline:none;border-color:#22c55e!important;box-shadow:0 0 0 3px #22c55e20;}
        .stat-item{animation:fadeUp 0.6s ease forwards;opacity:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
        .float-anim{animation:floatY 3.5s ease-in-out infinite;}
        @keyframes floatY{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        .hero-glow{animation:glowPulse 2.5s ease-in-out infinite;}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 0 0 #22c55e30;}50%{box-shadow:0 0 0 10px #22c55e00;}}
        @media(max-width:900px){
          .hero-grid{flex-direction:column!important;}
          .features-right{flex-direction:row!important;flex-wrap:wrap!important;justify-content:center!important;}
          .stats-row{flex-wrap:wrap!important;gap:16px!important;}
          .footer-grid{flex-wrap:wrap!important;gap:32px!important;}
          .register-layout{flex-direction:column!important;}
          .register-left{display:none!important;}
          .nav-links-desktop{display:none!important;}
          .mob-btn{display:flex!important;}
        }
        @media(min-width:901px){
          .mob-btn{display:none!important;}
          .mobile-menu{display:none!important;}
        }
        .mobile-menu{position:fixed;top:64px;left:0;right:0;z-index:200;padding:12px;}
        .checkbox-box{width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;flex-shrink:0;}
        .sec-label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#22c55e;margin-bottom:6px;}
        .step-line{height:1.5px;border-radius:1px;transition:background 0.3s;}
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: d ? "rgba(13,26,14,0.93)" : "rgba(244,249,244,0.93)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${d ? "#1e3320" : "#d4ead4"}`,
        padding: "0 clamp(16px,4vw,40px)", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.35s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
          onClick={() => setPage("landing")}>
          <LeafLogo />
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: d ? "#e8f5e9" : "#1a2e1b" }}>Smart-Kissan</div>
            <div style={{ fontSize: 9.5, color: "#22c55e", fontWeight: 600, letterSpacing: 0.3 }}>Smart Farming. Better Future.</div>
          </div>
        </div>

        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Home","Features","How It Works","Marketplace","eNAM","About Us"].map(n => (
            <span key={n} className="nav-link" style={{
              fontSize: 14, fontWeight: 500,
              color: n === "Home" ? "#22c55e" : d ? "#a8c5a0" : "#4a6e4b",
              borderBottom: n === "Home" ? "2.5px solid #22c55e" : "none", paddingBottom: 2,
            }}>{n}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Toggle */}
          <div onClick={() => setDark(!d)} style={{
            width: 50, height: 27, borderRadius: 14, cursor: "pointer",
            background: d ? "#22c55e" : "#c8d8c8", position: "relative",
            display: "flex", alignItems: "center", padding: "0 4px",
            transition: "background 0.3s",
          }}>
            <div style={{
              position: "absolute", left: d ? 26 : 4, transition: "left 0.25s",
              width: 19, height: 19, borderRadius: "50%", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: d ? "#16a34a" : "#777",
            }}>
              {d ? <MoonIcon /> : <SunIcon />}
            </div>
          </div>

          <button className="btn-outline" onClick={() => setPage("register")} style={{
            padding: "7px 18px", borderRadius: 8,
            border: "1.5px solid #22c55e", background: "transparent",
            color: "#22c55e", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Login</button>
          <button className="btn-primary" onClick={() => setPage("register")} style={{
            padding: "7px 18px", borderRadius: 8, border: "none",
            background: "#22c55e", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Register</button>

          {/* Hamburger */}
          <button className="mob-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: d ? "#e8f5e9" : "#1a2e1b", display: "none",
            flexDirection: "column", gap: 5, padding: 4,
          }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: "currentColor", borderRadius: 1 }} />)}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" style={{
          background: d ? "#0f1f10" : "#f0f8f0",
          border: `1px solid ${d ? "#1e3320" : "#d4ead4"}`, borderRadius: 14, padding: 12,
        }}>
          {["Home","Features","How It Works","Marketplace","eNAM","About Us"].map(n => (
            <div key={n} onClick={() => setMenuOpen(false)} style={{
              padding: "11px 16px", borderRadius: 8, cursor: "pointer",
              color: d ? "#a8c5a0" : "#4a6e4b", fontWeight: 500, fontSize: 14,
              borderBottom: `1px solid ${d ? "#1a2e1a" : "#e0ede0"}`,
            }}>{n}</div>
          ))}
        </div>
      )}

      {page === "landing"
        ? <LandingPage dark={d} onNavigate={setPage} />
        : <RegisterPage dark={d} onNavigate={setPage} />}
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ dark: d, onNavigate }: { dark: boolean; onNavigate: (p: Page) => void }) {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const features = [
    { icon: <ShieldIcon />, title: "AI Price & Quality", sub: "Smart suggestions", color: "#22c55e" },
    { icon: <LockIcon />, title: "Secure Payments", sub: "Escrow Protection", color: "#3b82f6" },
    { icon: <MapPinIcon />, title: "Live Tracking", sub: "Real-time updates", color: "#8b5cf6" },
    { icon: <HeadphonesIcon />, title: "Dispute Resolution", sub: "AI Powered", color: "#f59e0b" },
  ];

  const stats = [
    { icon: <UserIcon />, val: "25K+", label: "Farmers", color: "#22c55e" },
    { icon: <CartIcon />, val: "18K+", label: "Buyers", color: "#8b5cf6" },
    { icon: <TruckIcon />, val: "4K+", label: "Transporters", color: "#3b82f6" },
    { icon: <TrendUpIcon />, val: "10K+", label: "Daily Orders", color: "#f59e0b" },
    { icon: <ShieldIcon />, val: "100%", label: "Safe & Secure", color: "#22c55e" },
  ];

  const paths = [
    { icon: <FarmerIcon color="#22c55e" />, title: "Sell Products", sub: "as a Farmer", border: "#22c55e" },
    { icon: <CartIcon color="#3b82f6" />, title: "Buy Products", sub: "as a Buyer", border: "#3b82f6" },
    { icon: <TruckIcon color="#8b5cf6" />, title: "Deliver Products", sub: "as a Transporter", border: "#8b5cf6" },
  ];

  const footerCols: Record<string, string[]> = {
    Platform: ["Features","How It Works","Marketplace","eNAM Integration","About Us"],
    Resources: ["Help Center","Blog","Guides","FAQs"],
    Company: ["About Us","Contact Us","Privacy Policy","Terms & Conditions"],
  };

  const cardBg = d ? "#0f1f10" : "#fff";
  const cardBorder = d ? "#1e3320" : "#e0ede0";

  return (
    <>
      {/* HERO */}
      <section style={{ padding: "56px clamp(16px,4vw,40px) 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: 32 }}>

          {/* Left */}
          <div style={{ flex: "0 0 320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: 2, textTransform: "uppercase" }}>
                India's #1 Agri Platform
              </span>
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(34px,4.5vw,52px)", fontWeight: 800, lineHeight: 1.15,
              color: d ? "#e8f5e9" : "#1a2e1b",
            }}>
              Grow Smart.<br />Sell Better.<br />
              <span style={{ color: "#22c55e" }}>Live Better.</span>
            </h1>
            <p style={{ fontSize: 14.5, color: d ? "#7aa87b" : "#5a7a5b", lineHeight: 1.75, marginTop: 18, marginBottom: 28 }}>
              Smart-Kissan is a digital bridge between<br />Farmers, Buyers & Transporters.<br />
              <span style={{ fontWeight: 700, color: d ? "#a8c5a0" : "#3a5a3b" }}>Fair. Transparent. Trusted.</span>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button className="btn-primary hero-glow" onClick={() => onNavigate("register")} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 22px", borderRadius: 50, border: "none",
                background: "#22c55e", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}>
                <span>🌱</span> I'm a Farmer
              </button>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                border: `1.5px solid ${d ? "#1e3320" : "#c0d8c0"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#22c55e", cursor: "pointer",
                transition: "all 0.2s",
              }}>▶</div>
            </div>
          </div>

          {/* Center */}
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <div className="float-anim" style={{
              width: "min(400px,90%)", aspectRatio: "1",
              borderRadius: "50%",
              background: d
                ? "radial-gradient(circle at 40% 40%, #1e4020 0%, #0a1a0b 70%)"
                : "radial-gradient(circle at 40% 40%, #c8e6c9 0%, #e8f5e9 70%)",
              border: d ? "2px solid #1e3320" : "2px solid #a5d6a7",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", overflow: "hidden",
              boxShadow: d ? "0 0 80px #22c55e12" : "0 0 80px #22c55e20",
            }}>
              <div style={{ textAlign: "center", padding: 32 }}>
                <div style={{ fontSize: 72, marginBottom: 4 }}>🌾</div>
                <div style={{ fontSize: 52, marginBottom: 4 }}>👨‍🌾</div>
                <div style={{ fontSize: 36 }}>🚜</div>
                <div style={{ marginTop: 12, fontSize: 12, color: "#22c55e", fontWeight: 700, letterSpacing: 1 }}>
                  SMART FARMING PLATFORM
                </div>
              </div>
              <div style={{ position: "absolute", bottom: 24, right: 28, fontSize: 28 }}>🥦</div>
              <div style={{ position: "absolute", bottom: 24, left: 28, fontSize: 28 }}>🍅</div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="features-right" style={{ display: "flex", flexDirection: "column", gap: 12, flex: "0 0 230px" }}>
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{
                background: cardBg, border: `1px solid ${cardBorder}`,
                borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: d ? "0 2px 12px #00000030" : "0 2px 12px #0000000a",
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: f.color + "20",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: f.color, flexShrink: 0,
                }}>{f.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: d ? "#e8f5e9" : "#1a2e1b" }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: d ? "#7aa87b" : "#7a9a7b", marginTop: 2 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section style={{ padding: "48px clamp(16px,4vw,40px)", maxWidth: 1280, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#22c55e", marginBottom: 8 }}>
          Get Started
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(24px,3vw,36px)", fontWeight: 800,
          color: d ? "#e8f5e9" : "#1a2e1b",
        }}>Choose Your Path</h2>
        <div style={{ width: 48, height: 3, background: "#22c55e", borderRadius: 2, margin: "12px auto 40px" }} />

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {paths.map((p, i) => (
            <div key={i} className="path-card" onClick={() => onNavigate("register")} style={{
              flex: "1 1 240px", maxWidth: 340,
              background: cardBg, border: `1.5px solid ${cardBorder}`,
              borderRadius: 20, padding: "26px 22px",
              display: "flex", alignItems: "center", gap: 20,
              boxShadow: d ? "0 2px 16px #00000028" : "0 2px 16px #0000000a",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 16,
                background: p.border + "18", border: `1.5px solid ${p.border}30`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>{p.icon}</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: d ? "#e8f5e9" : "#1a2e1b" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: d ? "#7aa87b" : "#7a9a7b", marginTop: 3 }}>{p.sub}</div>
              </div>
              <div style={{ marginLeft: "auto", color: "#22c55e", fontSize: 20 }}>→</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{ padding: "0 clamp(16px,4vw,40px)", maxWidth: 1280, margin: "0 auto 48px" }}>
        <div ref={statsRef} style={{
          background: d ? "#0f1f1070" : "#e8f5e980",
          borderRadius: 24, border: `1px solid ${cardBorder}`,
          padding: "36px 40px",
        }}>
          <div className="stats-row" style={{ display: "flex", justifyContent: "space-around", gap: 24 }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-item" style={{
                textAlign: "center", animationDelay: `${i * 0.12}s`,
                opacity: statsVisible ? undefined : 0,
                animation: statsVisible ? `fadeUp 0.6s ease ${i * 0.12}s forwards` : "none",
              }}>
                <div style={{ color: s.color, display: "flex", justifyContent: "center", marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: 30, color: d ? "#e8f5e9" : "#1a2e1b" }}>{s.val}</div>
                <div style={{ fontSize: 13, color: d ? "#7aa87b" : "#7a9a7b", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: d ? "#061208" : "#1a2e1b", color: "#a8c5a0", padding: "52px clamp(16px,4vw,40px) 24px" }}>
        <div className="footer-grid" style={{ display: "flex", gap: 40, maxWidth: 1280, margin: "0 auto", flexWrap: "wrap" }}>
          <div style={{ flex: "0 0 200px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <LeafLogo />
              <div>
                <div style={{ fontWeight: 800, color: "#e8f5e9", fontSize: 14 }}>Smart-Kissan</div>
                <div style={{ fontSize: 9.5, color: "#22c55e" }}>Smart Farming. Better Future.</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              {["f","w","ig","yt","tw"].map(s => (
                <div key={s} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#1e3320", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "#a8c5a0", cursor: "pointer",
                  transition: "background 0.2s",
                }}>{s}</div>
              ))}
            </div>
          </div>

          {Object.entries(footerCols).map(([sec, links]) => (
            <div key={sec} style={{ flex: "1 1 130px" }}>
              <div style={{ fontWeight: 700, color: "#e8f5e9", marginBottom: 16, fontSize: 13 }}>{sec}</div>
              {links.map(l => (
                <div key={l} style={{ fontSize: 12.5, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseOver={e => (e.currentTarget.style.color = "#22c55e")}
                  onMouseOut={e => (e.currentTarget.style.color = "#a8c5a0")}>{l}</div>
              ))}
            </div>
          ))}

          <div style={{ flex: "1 1 220px" }}>
            <div style={{ fontWeight: 700, color: "#e8f5e9", marginBottom: 14, fontSize: 13 }}>Contact</div>
            <div style={{ fontSize: 12.5, marginBottom: 8 }}>📞 +91 1234 567 890</div>
            <div style={{ fontSize: 12.5, marginBottom: 8 }}>✉️ support@smart-kissan.com</div>
            <div style={{ fontSize: 12.5, marginBottom: 20 }}>📍 India</div>
            <div style={{ fontWeight: 700, color: "#e8f5e9", marginBottom: 10, fontSize: 13 }}>Stay Updated</div>
            <div style={{ display: "flex" }}>
              <input placeholder="Enter your email" style={{
                flex: 1, padding: "9px 12px", borderRadius: "8px 0 0 8px",
                background: "#1e3320", border: "1px solid #2d4d2d", color: "#e8f5e9",
                fontSize: 12.5, outline: "none",
              }} />
              <button style={{
                padding: "9px 14px", borderRadius: "0 8px 8px 0",
                background: "#22c55e", border: "none", cursor: "pointer", color: "#fff",
                display: "flex", alignItems: "center",
              }}><SendIcon /></button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid #1e3320", marginTop: 40, paddingTop: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          maxWidth: 1280, margin: "40px auto 0", flexWrap: "wrap", gap: 10, fontSize: 12,
        }}>
          <span>© 2024 Smart-Kissan. All rights reserved.</span>
          <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>🔒 Admin Access</span>
        </div>
      </footer>
    </>
  );
}

// ─── Register Page ─────────────────────────────────────────────────────────────
function RegisterPage({ dark: d, onNavigate }: { dark: boolean; onNavigate: (p: Page) => void }) {
  const [role, setRole] = useState<Role>("farmer");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [step, setStep] = useState<1|2>(1);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", confirm: "",
    bankName: "", accountNo: "", ifsc: "", accountType: "savings", upi: "", branch: "",
  });

  const upd = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const cardBg = d ? "#0f1f10" : "#fff";
  const cardBorder = d ? "#1e3320" : "#e0ede0";
  const inputBg = d ? "#0d1a0e" : "#f7fdf7";
  const inputBorder = d ? "#1e3320" : "#d4e8d4";
  const textMuted = d ? "#7aa87b" : "#7a9a7b";
  const textMain = d ? "#e8f5e9" : "#1a2e1b";

  const roles: { key: Role; label: string; icon: JSX.Element; color: string }[] = [
    { key: "farmer",      label: "Farmer",      icon: <FarmerIcon />, color: "#22c55e" },
    { key: "buyer",       label: "Buyer",        icon: <CartIcon />,   color: "#3b82f6" },
    { key: "transporter", label: "Transporter",  icon: <TruckIcon />,  color: "#8b5cf6" },
    { key: "admin",       label: "Admin",        icon: <AdminIcon />,  color: "#f59e0b" },
  ];

  const Input = ({
    icon, ph, val, onChange, type = "text", right = null,
  }: {
    icon: JSX.Element; ph: string; val: string;
    onChange: (v: string) => void; type?: string; right?: any;
  }) => (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: textMuted }}>{icon}</div>
      <input className="input-field" type={type} value={val} onChange={e => onChange(e.target.value)}
        placeholder={ph} style={{
          width: "100%", padding: "12px 13px 12px 40px",
          borderRadius: 10, border: `1.5px solid ${inputBorder}`,
          background: inputBg, color: textMain, fontSize: 13.5,
        }} />
      {right && (
        <div style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: textMuted }}
          onClick={right.onClick}>{right.icon}</div>
      )}
    </div>
  );

  const Divider = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 14, marginTop: 20 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#22c55e", marginBottom: 6 }}>{label}</div>
      <div style={{ height: 1, background: d ? "#1e3320" : "#e0ede0" }} />
    </div>
  );

  return (
    <div className="register-layout" style={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>

      {/* LEFT */}
      <div className="register-left" style={{
        flex: "0 0 460px",
        background: d
          ? "linear-gradient(155deg, #061208 0%, #0d2010 60%, #071510 100%)"
          : "linear-gradient(155deg, #e8f5e9 0%, #c8e6c9 60%, #dcedc8 100%)",
        padding: "52px 40px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 420, height: 420, borderRadius: "50%", background: "#22c55e06", border: "1px solid #22c55e12" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "#22c55e05" }} />

        <div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 38, fontWeight: 800, lineHeight: 1.2,
            color: d ? "#e8f5e9" : "#1a2e1b", marginBottom: 14,
          }}>
            Join <span style={{ color: "#22c55e" }}>Smart-Kissan</span><br />and Grow Together
          </h2>
          <div style={{ width: 44, height: 3, background: "#22c55e", borderRadius: 2, marginBottom: 18 }} />
          <p style={{ fontSize: 14.5, color: textMuted, lineHeight: 1.75 }}>
            A trusted digital platform connecting<br />Farmers, Buyers & Transporters.
          </p>

          {/* Illustration */}
          <div style={{
            background: d ? "#0f1f1060" : "#c8e6c950",
            borderRadius: 24, padding: "32px 24px", marginTop: 32,
            border: d ? "1px solid #1e3320" : "1px solid #a5d6a740",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 72, marginBottom: 6 }}>👨‍🌾</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              <span style={{ fontSize: 28 }}>🛒</span>
              <span style={{ fontSize: 28 }}>🚛</span>
              <span style={{ fontSize: 28 }}>🏦</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: 1.5 }}>
              DIGITAL AGRI ECOSYSTEM
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div style={{
          background: d ? "rgba(15,31,16,0.85)" : "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: 18, padding: "22px 24px",
          border: `1px solid ${cardBorder}`,
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14,
        }}>
          {[["🛡️","Secure Payments"],["📍","Live Tracking"],["📈","AI Price Suggestions"],["👥","Fair & Transparent"]].map(([ic, lb]) => (
            <div key={lb} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{ic}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: textMain }}>{lb}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT FORM */}
      <div style={{
        flex: 1, padding: "40px clamp(16px,4vw,40px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        background: d ? "#0d1a0e" : "#f4f9f4", overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 540 }}>
          <div style={{
            background: cardBg, borderRadius: 24,
            border: `1px solid ${cardBorder}`,
            padding: "36px 36px 32px",
            boxShadow: d ? "0 8px 40px #00000045" : "0 8px 40px #0000000e",
          }}>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: "#22c55e18", border: "1px solid #22c55e30",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <LeafLogo />
              </div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 25, fontWeight: 800, color: d ? "#e8f5e9" : "#1a2e1b",
              }}>
                Create Your <span style={{ color: "#22c55e" }}>Account</span>
              </h1>
              <p style={{ fontSize: 13, color: textMuted, marginTop: 5 }}>Get started with Smart-Kissan</p>
            </div>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 26 }}>
              {[1, 2].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: step >= s ? "#22c55e" : d ? "#1e3320" : "#e0ede0",
                    color: step >= s ? "#fff" : textMuted,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, transition: "all 0.3s",
                  }}>
                    {step > s ? <CheckIcon /> : s}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: step >= s ? "#22c55e" : textMuted, whiteSpace: "nowrap" }}>
                    {s === 1 ? "Personal Info" : "Bank Details"}
                  </span>
                  {s < 2 && (
                    <div className="step-line" style={{
                      width: 36, background: step > 1 ? "#22c55e" : d ? "#1e3320" : "#e0ede0",
                    }} />
                  )}
                </div>
              ))}
            </div>

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                {/* Role */}
                <div style={{ marginBottom: 22 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 600, color: textMuted, textAlign: "center", marginBottom: 12 }}>Register As</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                    {roles.map(r => (
                      <div key={r.key} className="role-card" onClick={() => setRole(r.key)} style={{
                        padding: "14px 8px", borderRadius: 14, textAlign: "center",
                        border: `2px solid ${role === r.key ? r.color : cardBorder}`,
                        background: role === r.key ? r.color + "15" : "transparent",
                      }}>
                        <div style={{ color: r.color, display: "flex", justifyContent: "center", marginBottom: 7 }}>{r.icon}</div>
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: role === r.key ? r.color : textMuted }}>{r.label}</div>
                        <div style={{
                          width: 16, height: 16, borderRadius: "50%",
                          border: `2px solid ${role === r.key ? r.color : d ? "#2d4d2d" : "#c0d8c0"}`,
                          margin: "8px auto 0",
                          background: role === r.key ? r.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {role === r.key && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Divider label="Personal Information" />
                <Input icon={<UserIcon />} ph="Full Name" val={form.name} onChange={v => upd("name", v)} />
                <Input icon={<PhoneIcon />} ph="Mobile Number" val={form.phone} onChange={v => upd("phone", v)} type="tel" />
                <Input icon={<MailIcon />} ph="Email Address" val={form.email} onChange={v => upd("email", v)} type="email" />

                <Divider label="Security" />
                <Input icon={<LockIcon />} ph="Password" val={form.password} onChange={v => upd("password", v)}
                  type={showPwd ? "text" : "password"}
                  right={{ icon: showPwd ? <EyeOffIcon /> : <EyeIcon />, onClick: () => setShowPwd(!showPwd) }} />
                <Input icon={<LockIcon />} ph="Confirm Password" val={form.confirm} onChange={v => upd("confirm", v)}
                  type={showConfirm ? "text" : "password"}
                  right={{ icon: showConfirm ? <EyeOffIcon /> : <EyeIcon />, onClick: () => setShowConfirm(!showConfirm) }} />

                {/* Checkbox */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 22, marginTop: 10 }}>
                  <div className="checkbox-box" onClick={() => setAgreed(!agreed)} style={{
                    border: `2px solid ${agreed ? "#22c55e" : d ? "#2d4d2d" : "#c0d8c0"}`,
                    background: agreed ? "#22c55e" : "transparent", marginTop: 2,
                    color: "#fff",
                  }}>
                    {agreed && <CheckIcon />}
                  </div>
                  <p style={{ fontSize: 12.5, color: textMuted, lineHeight: 1.65 }}>
                    I agree to the{" "}
                    <span style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Terms & Conditions</span>
                    {" "}and{" "}
                    <span style={{ color: "#22c55e", cursor: "pointer", fontWeight: 600 }}>Privacy Policy.</span>
                  </p>
                </div>

                <button className="btn-primary" onClick={() => setStep(2)} style={{
                  width: "100%", padding: "14px", borderRadius: 12,
                  background: "#22c55e", border: "none", color: "#fff",
                  fontSize: 15, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}>
                  Next: Bank Details <ArrowRightIcon />
                </button>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <Divider label="Bank Account Details" />
                <p style={{ fontSize: 13, color: textMuted, marginBottom: 18, lineHeight: 1.65 }}>
                  Required for receiving payments. Your data is encrypted with 256-bit AES.
                </p>

                <Input icon={<BankIcon />} ph="Bank Name (e.g. SBI, HDFC, ICICI)" val={form.bankName} onChange={v => upd("bankName", v)} />
                <Input icon={<CreditCardIcon />} ph="Account Number" val={form.accountNo} onChange={v => upd("accountNo", v)} />
                <Input icon={<HashIcon />} ph="IFSC Code (e.g. SBIN0001234)" val={form.ifsc} onChange={v => upd("ifsc", v)} />
                <Input icon={<MapPinIcon />} ph="Branch Name" val={form.branch} onChange={v => upd("branch", v)} />

                {/* Account Type */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11.5, color: textMuted, marginBottom: 8, fontWeight: 600 }}>Account Type</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {["savings","current","jan-dhan"].map(t => (
                      <div key={t} onClick={() => upd("accountType", t)} style={{
                        padding: "10px 8px", borderRadius: 10, textAlign: "center",
                        border: `1.5px solid ${form.accountType === t ? "#22c55e" : cardBorder}`,
                        background: form.accountType === t ? "#22c55e18" : "transparent",
                        cursor: "pointer", fontSize: 12, fontWeight: 600,
                        color: form.accountType === t ? "#22c55e" : textMuted,
                        textTransform: "capitalize", transition: "all 0.2s",
                      }}>{t}</div>
                    ))}
                  </div>
                </div>

                <Divider label="UPI Details (Optional)" />
                <Input icon={<PhoneIcon />} ph="UPI ID (e.g. name@paytm)" val={form.upi} onChange={v => upd("upi", v)} />

                {/* Security Note */}
                <div style={{
                  background: "#22c55e0e", border: "1px solid #22c55e22",
                  borderRadius: 10, padding: "12px 16px", marginBottom: 22,
                  display: "flex", gap: 10, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16 }}>🔐</span>
                  <p style={{ fontSize: 12, color: d ? "#7aa87b" : "#5a7a5b", lineHeight: 1.65 }}>
                    Bank details are stored securely and only used for payment settlements. We follow RBI-compliant data practices.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(1)} style={{
                    flex: "0 0 110px", padding: "14px", borderRadius: 12,
                    border: `1.5px solid ${cardBorder}`, background: "transparent",
                    color: textMuted, fontSize: 14, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.2s",
                  }}>← Back</button>
                  <button className="btn-primary" style={{
                    flex: 1, padding: "14px", borderRadius: 12,
                    background: "#22c55e", border: "none", color: "#fff",
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  }}>
                    Create Account <ArrowRightIcon />
                  </button>
                </div>
              </>
            )}

            <p style={{ textAlign: "center", fontSize: 13, color: textMuted, marginTop: 20 }}>
              Already have an account?{" "}
              <span onClick={() => onNavigate("landing")} style={{
                color: "#22c55e", fontWeight: 700, cursor: "pointer",
                textDecoration: "underline", textUnderlineOffset: 3,
              }}>Login</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
