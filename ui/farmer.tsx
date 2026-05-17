import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page = "dashboard" | "listings" | "product-detail" | "bids" | "demand" | "chatbot" | "disputes" | "payments" | "messages";

// ─── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = {
  home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  listings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  bids: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  orders: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8"/></svg>,
  payments: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  disputes: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  messages: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  demand: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  prices: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  ai: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  support: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg>,
  settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  arrow: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  star: (filled=true) => filled ? <svg viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" className="w-4 h-4"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" className="w-4 h-4"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  truck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20,6 9,17 4,12"/></svg>,
  eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  back: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/></svg>,
  dots: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/></svg>,
  edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  chat: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  attach: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>,
  refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  trend: (up=true) => up ? <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-3 h-3"><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="w-3 h-3"><polyline points="23,18 13.5,8.5 8.5,13.5 1,6"/><polyline points="17,18 23,18 23,12"/></svg>,
  map: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  robot: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ current, navigate }: { current: Page; navigate: (p: Page) => void }) {
  const items = [
    { id: "dashboard" as Page, label: "Home", icon: Icon.home },
    { id: "listings" as Page, label: "My Listings", icon: Icon.listings },
    { id: "bids" as Page, label: "Bids & Offers", icon: Icon.bids },
    { id: null, label: "Orders", icon: Icon.orders },
    { id: "payments" as Page, label: "Payments", icon: Icon.payments },
    { id: "disputes" as Page, label: "Disputes & Ratings", icon: Icon.disputes },
    { id: "messages" as Page, label: "Messages", icon: Icon.messages },
    { id: "demand" as Page, label: "Demand + Mandi Insights", icon: Icon.demand },
    { id: null, label: "Market Prices", icon: Icon.prices },
    { id: "chatbot" as Page, label: "AI Crop Advisor", icon: Icon.ai },
    { id: null, label: "Support", icon: Icon.support },
    { id: null, label: "Settings", icon: Icon.settings },
  ];

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-4 flex-shrink-0">
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">Smart-Kissan</div>
            <div className="text-xs text-gray-400">Smart Farming. Better Future.</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-2">
        {items.map((item, i) => {
          const active = item.id === current;
          return (
            <button
              key={i}
              onClick={() => item.id && navigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all ${
                active
                  ? "bg-green-50 text-green-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className={active ? "text-green-600" : "text-gray-400"}>
                <item.icon />
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="mx-3 p-3 bg-green-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 mb-1">
          <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-4 h-4"><path d="M12 22V12M12 12C12 7 7 5 3 7M12 12C12 7 17 5 21 7"/></svg>
          <span className="text-xs font-semibold text-green-700">We're here to help!</span>
        </div>
        <p className="text-xs text-gray-500 mb-2">Facing an issue? Our support team is ready to assist you.</p>
        <button className="w-full bg-green-600 text-white text-xs py-2 rounded-lg font-medium flex items-center justify-center gap-1">
          <Icon.chat /> Contact Support
        </button>
      </div>
    </aside>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, back, onBack }: { title: string; subtitle: string; back?: boolean; onBack?: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-3">
        {back && (
          <button onClick={onBack} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <Icon.back />
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <Icon.bell />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-green-200 bg-orange-100 flex items-center justify-center text-lg">👨‍🌾</div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Ramesh Kumar</div>
            <div className="text-xs text-gray-400">Farmer</div>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-400"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 1: Dashboard ────────────────────────────────────────────────────────
function DashboardPage({ navigate }: { navigate: (p: Page) => void }) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Good Morning, Ramesh 🌱" subtitle="Here's your farm activity overview" />
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Main hub area */}
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: "Active Listings", value: "12", sub: "2 new this week", color: "text-green-600", icon: "🛒", page: "listings" as Page },
              { label: "Bids Received", value: "18", sub: "+5 today", color: "text-blue-500", icon: "👥", page: "bids" as Page },
              { label: "Orders", value: "7", sub: "2 in transit", color: "text-orange-500", icon: "🚚", page: null },
              { label: "Total Earnings", value: "₹48,750", sub: "This Month", color: "text-purple-600", icon: "₹", page: null },
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => card.page && navigate(card.page)}
                className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-sm ${card.page ? "cursor-pointer hover:shadow-md transition" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{card.icon}</span>
                  <button className="text-gray-300 hover:text-gray-500"><Icon.arrow /></button>
                </div>
                <div className={`text-2xl font-bold mb-1 ${card.color}`}>{card.value}</div>
                <div className="text-sm text-gray-500 font-medium">{card.label}</div>
                <div className={`text-xs mt-1 ${card.color}`}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* Farm Hub Center Graphic */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-center mb-4">
            <div className="relative flex items-center justify-center" style={{width:220,height:120}}>
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-green-100" style={{borderRadius:"50%",width:200,height:200,top:-40,left:10}}/>
              <div className="text-center z-10">
                <div className="w-14 h-14 bg-green-50 rounded-full border-2 border-green-200 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="font-bold text-gray-800 text-sm">Your Farm Hub</div>
                <div className="text-xs text-gray-400">Manage, Track & Grow</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "🛒", title: "New bid received for Wheat (50 Quintal)", time: "10 min ago", color: "bg-green-50" },
                { icon: "🚚", title: "Order #SK1234 is in transit", time: "1 hour ago", color: "bg-blue-50" },
                { icon: "💰", title: "Payment of ₹18,600 released", time: "3 hours ago", color: "bg-orange-50" },
                { icon: "💬", title: "New message from Buyer", time: "5 hours ago", color: "bg-purple-50" },
              ].map((a, i) => (
                <div key={i} className={`${a.color} rounded-xl p-3 text-center`}>
                  <div className="text-2xl mb-2">{a.icon}</div>
                  <div className="text-xs text-gray-700 font-medium leading-tight mb-1">{a.title}</div>
                  <div className="text-xs text-gray-400">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          {/* Weather */}
          <div className="bg-green-700 rounded-2xl p-5 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">Today's Weather</div>
            <div className="text-xs opacity-60 mb-3">Jaipur, Rajasthan</div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">☀️</span>
              <div>
                <div className="text-3xl font-bold">32°C</div>
                <div className="text-sm opacity-80">Sunny</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[["41%","Humidity"],["12 km/h","Wind"],["0%","Rain Chance"]].map(([v,l]) => (
                <div key={l} className="bg-white/10 rounded-xl p-2">
                  <div className="text-sm font-bold">{v}</div>
                  <div className="text-xs opacity-70">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Farm Tip */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 font-bold text-sm">Farm Tip of the Day</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">Apply organic compost to improve soil fertility and increase yield.</p>
            <button className="text-sm text-green-600 font-medium flex items-center gap-1">View More Tips <Icon.arrow /></button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { icon: "➕", label: "Add Listing", page: "listings" as Page },
                { icon: "📊", label: "Check Prices", page: "demand" as Page },
                { icon: "📦", label: "View Orders", page: null },
              ].map((a, i) => (
                <button key={i} onClick={() => a.page && navigate(a.page)} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-gray-50 transition">
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-xs text-gray-600 text-center leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => navigate("messages" as any)} className="w-full text-sm text-green-600 font-medium flex items-center gap-1 px-2">
              Write to Buyer <Icon.arrow />
            </button>
          </div>

          {/* CTA */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <div className="text-sm font-bold text-gray-800 mb-1">Let's grow better together!</div>
            <p className="text-xs text-gray-500 mb-3">Smart tools for smarter farming.</p>
            <button className="w-full bg-green-600 text-white text-sm py-2.5 rounded-xl font-medium flex items-center justify-center gap-1">
              Explore Features <Icon.arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 2: My Listings ──────────────────────────────────────────────────────
function ListingsPage({ navigate }: { navigate: (p: Page) => void }) {
  const products = [
    { name: "Wheat", qty: "50 Quintal", price: "₹2,150", bids: 8, views: 124, status: "Active", emoji: "🌾" },
    { name: "Basmati Rice", qty: "100 Quintal", price: "₹3,200", bids: 10, views: 156, status: "Active", emoji: "🍚" },
    { name: "Mustard", qty: "30 Quintal", price: "₹5,400", bids: 6, views: 98, status: "Active", emoji: "🌻" },
    { name: "Chickpea (Chana)", qty: "40 Quintal", price: "₹4,600", bids: null, views: null, status: "Draft", emoji: "🫘" },
    { name: "Groundnut", qty: "25 Quintal", price: "₹4,200", bids: 5, views: 87, status: "In Review", emoji: "🥜" },
    { name: "Moong Dal", qty: "20 Quintal", price: "₹6,800", bids: 7, views: 110, status: "Active", emoji: "🫛" },
    { name: "Cotton", qty: "35 Quintal", price: "₹6,200", bids: null, views: null, status: "Sold Out", emoji: "🌿" },
    { name: "Maize", qty: "60 Quintal", price: "₹1,850", bids: 2, views: 32, status: "Inactive", emoji: "🌽" },
  ];

  const statusColor: Record<string, string> = {
    "Active": "bg-green-100 text-green-700",
    "Draft": "bg-blue-100 text-blue-700",
    "In Review": "bg-yellow-100 text-yellow-700",
    "Sold Out": "bg-red-100 text-red-700",
    "Inactive": "bg-gray-100 text-gray-600",
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="My Listings 🌱" subtitle="Manage your farm produce listings" />
      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: "🌱", label: "Active Listings", value: "12", sub: "2 new this week", color: "text-green-600" },
            { icon: "👁️", label: "Total Views", value: "245", sub: "+18 this week", color: "text-blue-500" },
            { icon: "🛒", label: "Total Orders", value: "18", sub: "+3 this week", color: "text-orange-500" },
            { icon: "₹", label: "Total Earnings", value: "₹48,750", sub: "This Month", color: "text-purple-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">{s.icon}</div>
              <div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className={`text-xs ${s.color}`}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
            <Icon.search />
            <input className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400" placeholder="Search your products..." />
          </div>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none">
            <option>All Products</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none">
            <option>All Status</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 outline-none">
            <option>Sort by: Latest</option>
          </select>
          <button className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 hover:bg-green-700 transition">
            <Icon.plus /> Add New Listing
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div
              key={i}
              onClick={() => p.name === "Wheat" && navigate("product-detail")}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="relative h-36 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                <span className="text-5xl group-hover:scale-110 transition-transform">{p.emoji}</span>
                <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status]}`}>{p.status}</span>
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><Icon.dots /></button>
              </div>
              <div className="p-3">
                <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
                <div className="text-xs text-gray-400 mb-1">{p.qty}</div>
                <div className="text-sm font-bold text-gray-900 mb-2">{p.price} <span className="font-normal text-gray-400">/ Quintal</span></div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1">🏷️ {p.bids != null ? `${p.bids} Bids` : "-"}</span>
                  <span className="flex items-center gap-1">👁️ {p.views != null ? `${p.views} Views` : "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {["‹", "1", "2", "3", "…", "5", "›"].map((p, i) => (
            <button key={i} className={`w-8 h-8 rounded-lg text-sm font-medium transition ${p === "1" ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{p}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3: Product Detail ───────────────────────────────────────────────────
function ProductDetailPage({ navigate }: { navigate: (p: Page) => void }) {
  const qualities = [
    { label: "Moisture Content", value: "12.5% (Ideal)" },
    { label: "Grain Size", value: "Above Average" },
    { label: "Purity", value: "98% (Excellent)" },
    { label: "Damage %", value: "2% (Low)" },
    { label: "Protein Content", value: "Good" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Back to Listings" subtitle="" back onBack={() => navigate("listings")} />
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Left: Image + details */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-2">
              {/* Image */}
              <div className="bg-amber-50 p-6 flex flex-col gap-3">
                <div className="h-52 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center text-8xl">🌾</div>
                <div className="flex gap-2">
                  {["🌾","🌿","🫘","🌱","🌾"].map((e,i) => (
                    <div key={i} className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center text-xl cursor-pointer border-2 ${i===0?"border-green-400":"border-transparent"}`}>{e}</div>
                  ))}
                </div>
              </div>
              {/* Info */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">Wheat</h2>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="text-sm text-gray-400 mb-3">50 Quintal &nbsp;|&nbsp; Listing ID: #SK12345</div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹2,150</span>
                  <span className="text-gray-400 text-sm">/ Quintal</span>
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded border border-green-200">Your Price</span>
                </div>
                <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">🕒 Listed on 20 May 2024, 10:30 AM</div>
                <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">📍 Village Rampura, Jaipur, Rajasthan</div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-4 py-2 border border-green-600 text-green-600 rounded-xl text-sm font-medium hover:bg-green-50 transition">
                    <Icon.edit /> Edit Listing
                  </button>
                  <button className="flex items-center gap-1 px-4 py-2 border border-red-400 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition">
                    <Icon.trash /> Deactivate
                  </button>
                </div>
                <div className="mt-3 bg-green-50 border border-green-100 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-green-600">🔒</span>
                  <div>
                    <div className="text-xs font-semibold text-green-700">Secure & Trusted Listing</div>
                    <div className="text-xs text-gray-500">Your listing is visible to verified buyers only.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Product Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Product Details</h3>
              <div className="space-y-2.5">
                {[
                  ["Crop Type","Wheat"],["Variety","HD-2967"],["Production Year","2023-2024"],
                  ["Quantity","50 Quintal"],["Quality","Farm Fresh"],["Storage","In Good Condition"],["Delivery","Buyer Arranges"],
                ].map(([k,v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 flex items-center gap-1.5">✦ {k}</span>
                    <span className="font-semibold text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Snapshot */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Quality Snapshot</h3>
              {/* Pentagon chart approximation */}
              <div className="flex items-center justify-center mb-2">
                <svg viewBox="0 0 200 180" className="w-40 h-36">
                  <polygon points="100,10 170,60 145,145 55,145 30,60" fill="rgba(22,163,74,0.15)" stroke="#16a34a" strokeWidth="2"/>
                  <polygon points="100,30 150,68 130,130 70,130 50,68" fill="rgba(22,163,74,0.08)" stroke="#16a34a" strokeWidth="1" strokeDasharray="4"/>
                  <text x="100" y="6" textAnchor="middle" fontSize="10" fill="#374151">Moisture</text>
                  <text x="100" y="14" textAnchor="middle" fontSize="9" fill="#6b7280">12.5%</text>
                  <text x="172" y="60" textAnchor="start" fontSize="9" fill="#374151">Purity</text>
                  <text x="172" y="70" textAnchor="start" fontSize="9" fill="#6b7280">98%</text>
                  <text x="148" y="158" textAnchor="middle" fontSize="9" fill="#374151">Grain Size</text>
                  <text x="148" y="168" textAnchor="middle" fontSize="9" fill="#6b7280">8.2mm</text>
                  <text x="52" y="158" textAnchor="middle" fontSize="9" fill="#374151">Protein</text>
                  <text x="52" y="168" textAnchor="middle" fontSize="9" fill="#6b7280">11.3%</text>
                  <text x="22" y="60" textAnchor="end" fontSize="9" fill="#374151">Damage</text>
                  <text x="22" y="70" textAnchor="end" fontSize="9" fill="#6b7280">2%</text>
                </svg>
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-yellow-700 flex items-center gap-1">
                💡 Tip: Keep moisture below 13% for best price.
              </div>
            </div>
          </div>

          {/* AI CTA */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Need help improving your produce quality?</div>
                <div className="text-xs text-gray-500">Ask our AI advisor for tips to get a better grade and higher price.</div>
              </div>
            </div>
            <button onClick={() => navigate("chatbot")} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 hover:bg-green-700 transition whitespace-nowrap">
              🤖 Ask AI Advisor
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Grade */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="font-semibold text-gray-800 text-sm">AI Grade & Price Insight</span>
              <span>✨</span>
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-50">
                  <span className="text-2xl font-bold text-green-700">A+</span>
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">AI Grade</div>
                <div className="text-xs text-green-600 font-medium">Excellent Quality</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Estimated Price Range</div>
                <div className="text-xl font-bold text-gray-900">₹2,100 – ₹2,300</div>
                <div className="text-xs text-gray-400">/ Quintal</div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">📊 Based on current market trends</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-green-700 mb-2">Why this grade?</div>
            <div className="space-y-1.5">
              {qualities.map(q => (
                <div key={q.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gray-500"><span className="text-green-500">✓</span>{q.label}</span>
                  <span className="text-gray-700 font-medium">{q.value}</span>
                </div>
              ))}
            </div>
            <button className="mt-3 w-full border border-green-200 text-green-700 text-xs py-2 rounded-xl flex items-center justify-center gap-1 hover:bg-green-50 transition">
              ✨ How AI Grading Works
            </button>
          </div>

          {/* Market & Pricing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-800 text-sm">Market & Pricing Suggestions</span>
              <button className="text-xs text-green-600 font-medium">View Market Prices</button>
            </div>
            <div className="bg-green-50 rounded-xl p-3 mb-3 flex items-start gap-2">
              <span className="text-green-500 text-lg">📈</span>
              <div>
                <div className="text-xs font-semibold text-green-700">Best time to sell</div>
                <div className="text-xs text-gray-500">Prices may increase in the next 7-10 days.</div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-700 mb-2">Top Market Centers</div>
            {[["Jaipur Mandi","₹2,180"],["Alwar Mandi","₹2,160"],["Kota Mandi","₹2,120"]].map(([m,p]) => (
              <div key={m} className="flex items-center justify-between py-1.5 border-b border-gray-50 text-sm">
                <span className="text-gray-500 text-xs flex items-center gap-1">🏪 {m}</span>
                <span className="font-semibold text-gray-800 text-xs">{p} / Quintal</span>
              </div>
            ))}
            <button className="mt-3 w-full bg-green-600 text-white text-sm py-2.5 rounded-xl font-medium flex items-center justify-center gap-1 hover:bg-green-700 transition">
              📈 Update Price & Repost
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 4: Bids & Offers ────────────────────────────────────────────────────
function BidsPage() {
  const bids = [
    { initials: "JM", color: "bg-green-100 text-green-700", name: "Jaipur Mandi Traders", location: "Jaipur, Rajasthan", price: "₹2,280", tag: "Highest Offer", tagColor: "text-green-600 bg-green-50", qty: "50 Quintal", delivery: "Pickup\nRampura Village", date: "20 May 2024\n10:30 AM" },
    { initials: "AM", color: "bg-blue-100 text-blue-700", name: "AgroMart India Pvt. Ltd.", location: "Alwar, Rajasthan", price: "₹2,200", tag: null, qty: "50 Quintal", delivery: "Pickup\nRampura Village", date: "20 May 2024\n09:15 AM" },
    { initials: "KM", color: "bg-purple-100 text-purple-700", name: "Kisan Global Exports", location: "Kota, Rajasthan", price: "₹2,150", tag: null, qty: "50 Quintal", delivery: "Pickup\nRampura Village", date: "20 May 2024\n08:45 AM" },
    { initials: "RM", color: "bg-orange-100 text-orange-700", name: "Rajasthan Agro Supply", location: "Sikar, Rajasthan", price: "₹2,100", tag: null, qty: "50 Quintal", delivery: "Pickup\nRampura Village", date: "19 May 2024\n06:20 PM" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Bids / Offers" subtitle="Review and manage offers from buyers" />
      <div className="p-6">
        {/* Product Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-24 h-20 bg-amber-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">🌾</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">Wheat</h2>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Active</span>
              </div>
              <div className="text-sm text-gray-400 mb-2">50 Quintal &nbsp;•&nbsp; Listing ID: #SK12345</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">₹2,150</span>
                <span className="text-gray-400 text-sm">/ Quintal</span>
                <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded border border-green-200">Your Price</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Listed on 20 May 2024 &nbsp;•&nbsp; Village Rampura, Jaipur</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: "🏷️", label: "Total Bids", value: "8", sub: "Buyers interested" },
                { icon: "👁️", label: "Total Views", value: "245", sub: "Since listing" },
                { icon: "📅", label: "Listing Ends On", value: "25 May 2024", sub: "5 days left", subColor: "text-orange-500" },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-sm font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                  <div className={`text-xs font-medium ${s.subColor || "text-gray-500"}`}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4">
          {["Received Bids (8)", "Accepted Offers (1)", "Expired (0)"].map((t, i) => (
            <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${i===0 ? "text-green-700 border-b-2 border-green-600 bg-white" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none">
              <option>Sort by: Highest Price</option>
            </select>
            <button className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 flex items-center gap-1">
              <Icon.filter /> Filters
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 grid grid-cols-5 gap-4">
          {[
            { label: "Highest Offer", value: "₹2,280 / Quintal", icon: "🏷️" },
            { label: "Average Offer", value: "₹2,125 / Quintal", icon: "₹" },
            { label: "Interested Buyers", value: "8", icon: "👥" },
            { label: "Price Trend (7 Days)", value: "↑ 3.2%", valueColor: "text-green-600", icon: "📈" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xl">{s.icon}</span>
              <div>
                <div className={`text-sm font-bold ${s.valueColor || "text-gray-900"}`}>{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
          <div className="bg-green-50 rounded-xl p-3">
            <div className="text-xs font-semibold text-green-700 mb-1">How it works?</div>
            <div className="space-y-0.5">
              {["Compare all offers","Accept the best offer","Complete the order","Receive payment securely"].map((s,i) => (
                <div key={i} className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="text-green-500 text-xs">✓</span>{i+1}. {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bids Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Buyer Details</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Offered Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Quantity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Delivery</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Offer Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((b, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${b.color} flex items-center justify-center text-sm font-bold`}>{b.initials}</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{b.name}</div>
                        <div className="text-xs text-gray-400">{b.location}</div>
                        <div className="text-xs text-green-600">✓ Verified Buyer</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className={`text-sm font-bold ${b.tag ? "text-green-600" : "text-gray-800"}`}>{b.price} / Quintal</div>
                    {b.tag && <div className={`text-xs px-2 py-0.5 rounded-full ${b.tagColor} font-medium`}>{b.tag}</div>}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-700">{b.qty}</td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-600 flex items-center gap-1"><Icon.truck />{b.delivery.split("\n")[0]}</div>
                    <div className="text-xs text-gray-400">{b.delivery.split("\n")[1]}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs text-gray-700">{b.date.split("\n")[0]}</div>
                    <div className="text-xs text-gray-400">{b.date.split("\n")[1]}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-700 transition font-medium">Accept</button>
                      <button className="border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">View Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-blue-50 border-t border-blue-100 text-xs text-blue-700 flex items-center gap-2">
            ℹ️ You can accept only one offer for this listing. Once accepted, other offers will be declined automatically.
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">🌱</div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Pro Tip</div>
              <div className="text-xs text-gray-500">Compare offers and choose the best deal for your produce.</div>
            </div>
          </div>
          <button className="text-sm text-green-600 font-medium flex items-center gap-1">Explore Market Prices <Icon.arrow /></button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 5: Demand + Mandi Insights ──────────────────────────────────────────
function DemandPage() {
  const crops = [
    { name: "Wheat", level: "High", levelColor: "bg-green-100 text-green-700", change: "+4.2%", up: true },
    { name: "Mustard", level: "High", levelColor: "bg-green-100 text-green-700", change: "+3.8%", up: true },
    { name: "Moong Dal", level: "Medium", levelColor: "bg-yellow-100 text-yellow-700", change: "+1.6%", up: true },
    { name: "Chickpea", level: "Medium", levelColor: "bg-yellow-100 text-yellow-700", change: "-1.2%", up: false },
    { name: "Maize", level: "Low", levelColor: "bg-gray-100 text-gray-600", change: "-2.6%", up: false },
  ];

  const mandis = [
    { name: "Jaipur Mandi", today: "₹2,220", yesterday: "₹2,150", change: "+3.3%", up: true },
    { name: "Alwar Mandi", today: "₹2,180", yesterday: "₹2,120", change: "+2.8%", up: true },
    { name: "Kota Mandi", today: "₹2,160", yesterday: "₹2,130", change: "+1.4%", up: true },
    { name: "Sikar Mandi", today: "₹2,140", yesterday: "₹2,150", change: "-0.5%", up: false },
    { name: "Bikaner Mandi", today: "₹2,080", yesterday: "₹2,110", change: "-1.4%", up: false },
  ];

  const SimpleSparkline = ({ up }: { up: boolean }) => (
    <svg viewBox="0 0 60 20" className="w-16 h-5">
      <polyline
        points={up ? "0,15 10,12 20,14 30,10 40,8 50,6 60,4" : "0,5 10,8 20,6 30,10 40,12 50,14 60,16"}
        fill="none"
        stroke={up ? "#16a34a" : "#dc2626"}
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Demand + Mandi Insights" subtitle="Discover what's in demand and where to sell for the best price" />
      <div className="p-6">
        {/* Tabs & Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex gap-1 bg-white rounded-xl border border-gray-200 p-1">
            {["Demand Overview","Mandi Insights"].map((t,i) => (
              <button key={i} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${i===0 ? "bg-green-600 text-white" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>
            ))}
          </div>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none ml-auto">
            <option>All Crops</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none">
            <option>Rajasthan</option>
          </select>
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
            📅 20 May – 27 May 2024
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { icon: "🌱", label: "High Demand Crops", value: "6", sub: "This Week" },
            { icon: "📈", label: "Price Rising", value: "5", sub: "Crops" },
            { icon: "👥", label: "Best Selling Region", value: "Jaipur", sub: "This Week" },
            { icon: "₹", label: "Avg. Price (All Crops)", value: "₹2,180", sub: "↑ 2.8% vs last week", subColor: "text-green-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <span className="text-3xl">{s.icon}</span>
              <div>
                <div className="text-xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
                <div className={`text-xs ${s.subColor || "text-gray-400"}`}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Top Crops */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Top Crops in Demand</h3>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">Crop</th>
                  <th className="text-left pb-2">Demand Level</th>
                  <th className="text-left pb-2">Price Trend (7 Days)</th>
                  <th className="text-left pb-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {crops.map(c => (
                  <tr key={c.name} className="border-b border-gray-50">
                    <td className="py-2.5 text-sm font-medium text-gray-700">{c.name}</td>
                    <td className="py-2.5"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.levelColor}`}>{c.level}</span></td>
                    <td className="py-2.5"><SimpleSparkline up={c.up} /></td>
                    <td className={`py-2.5 text-xs font-semibold ${c.up ? "text-green-600" : "text-red-500"}`}>{c.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mt-3 border border-gray-200 text-sm text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition">View Full Demand Report</button>
          </div>

          {/* Mandi Price Comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Mandi Price Comparison</h3>
              <button className="text-xs text-green-600 font-medium flex items-center gap-1">View All Mandis <Icon.arrow /></button>
            </div>
            <div className="text-xs text-gray-400 mb-3">Crop: Wheat (₹/Quintal)</div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">Mandi</th>
                  <th className="text-left pb-2">Today</th>
                  <th className="text-left pb-2">Yesterday</th>
                  <th className="text-left pb-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {mandis.map(m => (
                  <tr key={m.name} className="border-b border-gray-50">
                    <td className="py-2.5 text-sm text-gray-700">{m.name}</td>
                    <td className="py-2.5 text-sm font-semibold text-gray-900">{m.today}</td>
                    <td className="py-2.5 text-sm text-gray-500">{m.yesterday}</td>
                    <td className={`py-2.5 text-xs font-semibold ${m.up ? "text-green-600" : "text-red-500"}`}>{m.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Hotspot Map */}
          <div className="col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-1">Demand Hotspots Map</h3>
            <p className="text-xs text-gray-400 mb-3">Regions with highest buying interest this week</p>
            {/* Simplified Rajasthan-ish map representation */}
            <div className="bg-green-50 rounded-xl h-40 flex items-center justify-center relative overflow-hidden mb-3">
              <svg viewBox="0 0 200 160" className="w-full h-full">
                <ellipse cx="100" cy="80" rx="80" ry="65" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
                <circle cx="90" cy="45" r="10" fill="#16a34a" opacity="0.8"/>
                <circle cx="70" cy="70" r="7" fill="#22c55e" opacity="0.7"/>
                <circle cx="110" cy="90" r="7" fill="#22c55e" opacity="0.7"/>
                <circle cx="85" cy="110" r="5" fill="#fbbf24" opacity="0.7"/>
                <circle cx="120" cy="60" r="5" fill="#fbbf24" opacity="0.6"/>
                <text x="90" y="42" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">Jaipur</text>
                <text x="70" y="67" textAnchor="middle" fontSize="7" fill="white">Alwar</text>
                <text x="110" y="87" textAnchor="middle" fontSize="7" fill="white">Kota</text>
                <text x="85" y="107" textAnchor="middle" fontSize="7" fill="#374151">Udaipur</text>
                <text x="120" y="57" textAnchor="middle" fontSize="7" fill="#374151">Jodhpur</text>
              </svg>
              <div className="absolute bottom-2 right-2 bg-white rounded-lg shadow p-1.5 text-xs">
                {[["🟢","Very High"],["🟢","High"],["🟡","Medium"],["⚪","Low"]].map(([d,l]) => (
                  <div key={l} className="flex items-center gap-1 text-gray-600">{d} {l}</div>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {[["1","Jaipur","Very High","bg-green-100 text-green-700"],["2","Alwar","High","bg-green-100 text-green-700"],["3","Kota","High","bg-green-100 text-green-700"],["4","Udaipur","Medium","bg-yellow-100 text-yellow-700"],["5","Jodhpur","Medium","bg-yellow-100 text-yellow-700"]].map(([n,city,level,cls]) => (
                <div key={city} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{n} &nbsp;{city}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${cls}`}>{level}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Demand */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Upcoming Demand (Next 7 Days)</h3>
            <div className="space-y-4">
              {[
                { icon: "🛒", crop: "Wheat", sub: "High demand expected", date: "21 May", color: "bg-green-50" },
                { icon: "🫛", crop: "Moong Dal", sub: "Prices likely to increase", date: "23 May", color: "bg-yellow-50" },
                { icon: "🌻", crop: "Mustard", sub: "Strong buying trend", date: "25 May", color: "bg-orange-50" },
              ].map(u => (
                <div key={u.crop} className={`${u.color} rounded-xl p-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{u.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{u.crop}</div>
                      <div className="text-xs text-gray-500">{u.sub}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{u.date}</div>
                    <div className="text-xs text-gray-400">May</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Market Insight */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">🤖</div>
              <span className="font-semibold text-gray-800 text-sm">AI Market Insight</span>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 mb-4 text-sm text-gray-700 leading-relaxed">
              Wheat prices in Jaipur mandi are likely to rise by 3-5% in the next 3 days due to increased demand from bulk buyers.
            </div>
            <button className="w-full flex items-center justify-between bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition">
              View Detailed Insight <Icon.arrow />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            💡 <strong>Smart Tip:</strong> List your produce before Wednesday to get more visibility and better offers.
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1 hover:bg-green-700 transition">
            ✨ Get AI Recommendation
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 6: AI Crop Advisor ──────────────────────────────────────────────────
function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello Ramesh! 👋\nI'm your AI Crop Advisor. Ask me anything about your crops, pests, soil, weather or best farming practices.", time: "10:30 AM" },
    { role: "user", text: "My wheat crop leaves are turning yellow. What could be the reason and how can I fix it?", time: "10:31 AM" },
    { role: "bot", text: "STRUCTURED", time: "10:32 AM" },
  ]);

  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
      <TopBar title="AI Crop Advisor" subtitle="Your smart assistant for crop, disease, soil, weather and more" />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">Chat with AI Advisor</h3>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>Online</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                  {m.role === "bot" && (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  )}
                  <div className={`max-w-lg ${m.role === "user" ? "" : ""}`}>
                    {m.role === "user" ? (
                      <div className="bg-green-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm">{m.text}</div>
                    ) : m.text === "STRUCTURED" ? (
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm border border-gray-100">
                        <p className="text-gray-700 mb-2">Yellowing in wheat leaves can be due to several reasons. Here are the most common ones and solutions:</p>
                        <div className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
                          <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-xs mb-1.5">🔍 Possible Reasons</div>
                          {["1. Nitrogen deficiency","2. Waterlogging","3. Early signs of rust disease"].map(r => (
                            <div key={r} className="text-xs text-gray-600 py-0.5">{r}</div>
                          ))}
                        </div>
                        <div className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
                          <div className="flex items-center gap-1.5 font-semibold text-gray-800 text-xs mb-1.5">✅ What You Can Do</div>
                          {["1. Apply Urea @ 45 kg/acre if no rainfall expected in next 2 days.","2. Ensure proper drainage and avoid over-irrigation.","3. If rust spots are visible, spray Propiconazole 25 EC @ 1 ml/litre."].map(r => (
                            <div key={r} className="text-xs text-gray-600 py-0.5">{r}</div>
                          ))}
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-2.5 border border-yellow-100 flex items-start gap-2">
                          <span className="text-yellow-500 text-sm">💡</span>
                          <span className="text-xs text-gray-700"><strong>Pro Tip:</strong> Apply fertilizer in the early morning or evening for better absorption and result.</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm border border-gray-100 whitespace-pre-line text-gray-700">{m.text}</div>
                    )}
                    <div className={`text-xs text-gray-400 mt-1 ${m.role === "user" ? "text-right" : ""}`}>{m.time} {m.role === "user" ? "✓✓" : ""}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-2 flex gap-2 flex-wrap border-t border-gray-50">
              {["How to improve soil health?","Best fertilizer for wheat","Control weeds naturally"].map(q => (
                <button key={q} className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition">{q}</button>
              ))}
              <button className="bg-gray-50 border border-gray-200 text-gray-500 text-xs p-1.5 rounded-full"><Icon.refresh /></button>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 px-4 py-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 resize-none"
                  placeholder="Type your question here..."
                />
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600"><Icon.attach /></button>
                  <button className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center text-white hover:bg-green-700 transition">
                    <Icon.send />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-1">AI responses may not always be 100% accurate. Please cross-verify with local experts.</div>
            </div>
          </div>

          {/* Popular Questions */}
          <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 text-sm">Popular Questions</h3>
              <button className="text-xs text-green-600 flex items-center gap-1">View All <Icon.arrow /></button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["How to increase wheat yield?","Best time to sell my crop?","Which crop is best after wheat?","How to get better market price?"].map(q => (
                <button key={q} className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 text-left hover:bg-green-50 hover:text-green-700 transition border border-gray-100">{q}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-72 p-4 flex flex-col gap-4 flex-shrink-0">
          {/* Crop Advisor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-800 mb-0.5">Crop Advisor</div>
            <div className="text-xs text-gray-400 mb-3">Get AI recommendations for your farm</div>
            <div className="flex items-center gap-2 mb-3">
              <select className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs outline-none text-gray-700">
                <option>Wheat (HD-2967)</option>
              </select>
              <div className="bg-green-50 text-green-700 text-xs px-2 py-1.5 rounded-xl font-medium">Tillering</div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-4 gap-1 mb-3">
              {[["🌱","Recommendations"],["🐛","Pest & Disease"],["💊","Nutrition"],["💧","Irrigation"]].map(([e,l],i) => (
                <button key={l} className={`flex flex-col items-center gap-0.5 py-2 rounded-lg text-xs transition ${i===0 ? "text-green-700 border-b-2 border-green-600" : "text-gray-400"}`}>
                  <span>{e}</span>
                  <span className="leading-tight text-center" style={{fontSize:"9px"}}>{l}</span>
                </button>
              ))}
            </div>

            <div className="text-xs font-semibold text-gray-600 mb-2">Current Recommendation</div>
            <div className="bg-green-50 rounded-xl p-3 flex items-start gap-2 mb-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl flex-shrink-0">🌿</div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Apply Nitrogen (Urea)</div>
                <div className="text-xs text-green-600 font-medium">45 kg/acre</div>
                <div className="text-xs text-gray-500">Apply in the early morning for best results.</div>
              </div>
            </div>
            <button className="w-full border border-green-200 text-green-700 text-xs py-2 rounded-xl hover:bg-green-50 transition">View Details</button>

            <div className="text-xs font-semibold text-gray-600 mt-3 mb-2">Upcoming (Next 7 Days)</div>
            {[["💧","Irrigation","Next irrigation in 3 days"],["🌿","Weed Management","Use Isoproturon 75% @ 1.0 kg/acre"]].map(([e,t,s]) => (
              <div key={t} className="flex items-center gap-2 py-2 border-b border-gray-50">
                <span className="text-lg">{e}</span>
                <div>
                  <div className="text-xs font-medium text-gray-700">{t}</div>
                  <div className="text-xs text-gray-400">{s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Tools */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Smart Tools</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["📷","Diagnose Plant","Upload leaf photo to detect disease"],
                ["🌤️","Weather Update","Check 5-day weather forecast"],
                ["🧪","Soil Health Test","Know your soil nutrient status"],
                ["📖","Crop Guides","Best practices for higher yield"],
              ].map(([e,t,s]) => (
                <div key={t} className="bg-gray-50 rounded-xl p-3 hover:bg-green-50 cursor-pointer transition border border-gray-100">
                  <span className="text-xl">{e}</span>
                  <div className="text-xs font-semibold text-gray-700 mt-1">{t}</div>
                  <div className="text-xs text-gray-400 leading-tight">{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-green-700 rounded-2xl p-4 text-white">
            <div className="text-sm font-bold mb-1">Grow Smarter, Grow Better 🌾</div>
            <div className="text-xs opacity-80">AI insights + real-time data = higher yield & profit</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 7: Disputes & Ratings ───────────────────────────────────────────────
function DisputesPage() {
  const ratings = [
    { initials: "JM", color: "bg-green-100 text-green-700", name: "Jaipur Mandi Traders", date: "21 May 2024", stars: 5, text: "Quality produce. Timely delivery." },
    { initials: "AA", color: "bg-blue-100 text-blue-700", name: "Alwar Agri Pvt. Ltd.", date: "10 May 2024", stars: 4, text: "Good quality and honest communication." },
    { initials: "KF", color: "bg-purple-100 text-purple-700", name: "Kota Food Exports", date: "28 Apr 2024", stars: 5, text: "Excellent product. Will buy again." },
    { initials: "BT", color: "bg-orange-100 text-orange-700", name: "Bikaner Traders", date: "15 Apr 2024", stars: 4, text: "Quality was good. Keep it up!" },
    { initials: "RS", color: "bg-pink-100 text-pink-700", name: "Rajasthan Supermart", date: "02 Apr 2024", stars: 5, text: "Very professional and trustworthy." },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Disputes & Ratings" subtitle="Raise issues, track progress and view your ratings" />
      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Left: Disputes */}
        <div className="col-span-2 space-y-4">
          {/* Overview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Disputes Overview</h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: "⏳", value: "1", label: "Open", sub: "Requires attention", subColor: "text-orange-500", bg: "bg-orange-50" },
                { icon: "🔄", value: "0", label: "In Review", sub: "Being checked", subColor: "text-blue-500", bg: "bg-blue-50" },
                { icon: "✅", value: "3", label: "Resolved", sub: "Successfully closed", subColor: "text-green-600", bg: "bg-green-50" },
                { icon: "❌", value: "0", label: "Rejected", sub: "No action taken", subColor: "text-gray-400", bg: "bg-gray-50" },
              ].map(d => (
                <div key={d.label} className={`${d.bg} rounded-xl p-4 text-center`}>
                  <div className="text-2xl mb-1">{d.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{d.value}</div>
                  <div className="text-xs font-semibold text-gray-600">{d.label}</div>
                  <div className={`text-xs ${d.subColor} mt-0.5`}>{d.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* My Disputes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">My Disputes</h3>
            <div className="flex gap-1 mb-4">
              {["Open (1)","In Review (0)","Resolved (3)","Rejected (0)"].map((t,i) => (
                <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${i===0 ? "text-green-700 border-b-2 border-green-600" : "text-gray-400"}`}>{t}</button>
              ))}
            </div>

            {/* Open Dispute */}
            <div className="border border-orange-100 rounded-xl p-4 bg-orange-50/40">
              <div className="flex items-start gap-3">
                <div className="w-16 h-14 bg-amber-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">🌾</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">Quality Issue – Wheat (HD-2967)</span>
                    <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full font-medium">Open</span>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">Order ID: #ORD12345 &nbsp;•&nbsp; Buyer: Jaipur Mandi Traders</div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
                    <span>📅 Raised on: 21 May 2024</span>
                    <span>💰 Amount: ₹2,150 / Quintal</span>
                  </div>
                  <div className="text-xs text-gray-500">Issue: The buyer claims moisture level is higher than agreed.</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-gray-400">Status</div>
                  <div className="text-sm font-semibold text-orange-500">Open</div>
                  <button className="mt-2 border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">View Details</button>
                </div>
              </div>
            </div>
          </div>

          {/* Resolved Disputes */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Resolved Disputes</h3>
              <button className="text-xs text-green-600 font-medium flex items-center gap-1">View All <Icon.arrow /></button>
            </div>
            <div className="space-y-3">
              {[
                { emoji: "🫘", title: "Payment Delay – Chickpea (Chana)", orderId: "#ORD11223", buyer: "Alwar Agri Pvt. Ltd.", resolved: "10 May 2024", decision: "In your favor" },
                { emoji: "🍚", title: "Weight Mismatch – Basmati Rice", orderId: "#ORD11001", buyer: "Kota Food Exports", resolved: "28 Apr 2024", decision: "In buyer's favor" },
                { emoji: "🌻", title: "Quality Issue – Mustard", orderId: "#ORD10876", buyer: "Bikaner Traders", resolved: "15 Apr 2024", decision: "In your favor" },
              ].map(d => (
                <div key={d.orderId} className="border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:bg-gray-50 transition">
                  <div className="w-14 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">{d.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">{d.title}</span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Resolved</span>
                    </div>
                    <div className="text-xs text-gray-400">Order ID: {d.orderId} &nbsp;•&nbsp; Buyer: {d.buyer}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <span>📅 Resolved on: {d.resolved}</span>
                      <span className={`font-medium ${d.decision.includes("your") ? "text-green-600" : "text-blue-500"}`}>⚖️ Decision: {d.decision}</span>
                    </div>
                  </div>
                  <button className="border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition whitespace-nowrap">View Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ratings */}
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-4">Your Rating Summary</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 mb-1">
                  <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
                    <circle cx="40" cy="40" r="32" fill="none" stroke="#16a34a" strokeWidth="6" strokeDasharray={`${(4.6/5)*201} 201`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center rotate-90">
                    <span className="text-xl font-bold text-gray-900">4.6</span>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-0.5">{[1,2,3,4,5].map(s => <span key={s}>{Icon.star(s <= 4)()}</span>)}</div>
                <div className="text-xs font-semibold text-green-700">Excellent</div>
                <div className="text-xs text-gray-400">Based on 18 ratings</div>
              </div>
              <div className="flex-1 space-y-1">
                {[[5,13,"bg-green-600"],[4,4,"bg-green-400"],[3,1,"bg-yellow-400"],[2,0,"bg-gray-200"],[1,0,"bg-gray-200"]].map(([star, count, color]) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{star}</span>
                    <span className="text-yellow-400 text-xs">★</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{width: `${(Number(count)/13)*100}%`}}></div>
                    </div>
                    <span className="text-xs text-gray-500 w-3">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-400 text-center">Ratings help build trust in the community ℹ️</div>
          </div>

          {/* Recent Ratings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Recent Ratings</h3>
              <button className="text-xs text-green-600 font-medium flex items-center gap-1">View All <Icon.arrow /></button>
            </div>
            <div className="space-y-3">
              {ratings.map(r => (
                <div key={r.name} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{r.initials}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-800">{r.name}</span>
                        <span className="text-xs text-gray-400">{r.date}</span>
                      </div>
                      <div className="flex gap-0.5 my-0.5">{[1,2,3,4,5].map(s => <span key={s}>{Icon.star(s <= r.stars)()}</span>)}</div>
                      <div className="text-xs text-gray-500">{r.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-600">🛡️</span>
              <h3 className="font-semibold text-gray-800 text-sm">Tips to avoid disputes</h3>
            </div>
            {["Ensure accurate product details and quality.","Communicate clearly with buyers.","Pack and deliver on time."].map(t => (
              <div key={t} className="flex items-center gap-2 text-xs text-gray-600 py-1">
                <span className="text-green-500 text-sm">✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 8: Payments ─────────────────────────────────────────────────────────
function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<"all"|"received"|"pending"|"withdrawn">("all");

  const transactions = [
    { id: "TXN-8821", buyer: "Jaipur Mandi Traders", initials: "JM", color: "bg-green-100 text-green-700", crop: "Wheat (50 Quintal)", date: "21 May 2024", amount: 107500, status: "Received", orderId: "#ORD12345", method: "NEFT", methodIcon: "🏦" },
    { id: "TXN-8820", buyer: "Kota Food Exports", initials: "KF", color: "bg-purple-100 text-purple-700", crop: "Basmati Rice (30 Quintal)", date: "19 May 2024", amount: 96000, status: "Pending", orderId: "#ORD12301", method: "UPI", methodIcon: "📱" },
    { id: "TXN-8817", buyer: "Alwar Agri Pvt. Ltd.", initials: "AA", color: "bg-blue-100 text-blue-700", crop: "Mustard (20 Quintal)", date: "15 May 2024", amount: 108000, status: "Received", orderId: "#ORD12280", method: "UPI", methodIcon: "📱" },
    { id: "TXN-8810", buyer: "Bikaner Traders", initials: "BT", color: "bg-orange-100 text-orange-700", crop: "Chickpea (40 Quintal)", date: "10 May 2024", amount: 184000, status: "Withdrawn", orderId: "#ORD12200", method: "Bank Transfer", methodIcon: "🏦" },
    { id: "TXN-8804", buyer: "Rajasthan Supermart", initials: "RS", color: "bg-pink-100 text-pink-700", crop: "Moong Dal (15 Quintal)", date: "05 May 2024", amount: 102000, status: "Received", orderId: "#ORD12150", method: "NEFT", methodIcon: "🏦" },
    { id: "TXN-8798", buyer: "AgroMart India Pvt. Ltd.", initials: "AM", color: "bg-teal-100 text-teal-700", crop: "Groundnut (25 Quintal)", date: "28 Apr 2024", amount: 105000, status: "Withdrawn", orderId: "#ORD12100", method: "UPI", methodIcon: "📱" },
    { id: "TXN-8791", buyer: "Kisan Global Exports", initials: "KG", color: "bg-indigo-100 text-indigo-700", crop: "Wheat (60 Quintal)", date: "22 Apr 2024", amount: 129000, status: "Pending", orderId: "#ORD12050", method: "Bank Transfer", methodIcon: "🏦" },
  ];

  const filtered = activeTab === "all" ? transactions : transactions.filter(t => t.status.toLowerCase() === activeTab);

  const statusStyle: Record<string, string> = {
    Received: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Withdrawn: "bg-blue-100 text-blue-700",
  };

  const totalReceived = transactions.filter(t => t.status === "Received" || t.status === "Withdrawn").reduce((s, t) => s + t.amount, 0);
  const totalPending = transactions.filter(t => t.status === "Pending").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.status === "Withdrawn").reduce((s, t) => s + t.amount, 0);
  const walletBalance = totalReceived - totalWithdrawn;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <TopBar title="Payments" subtitle="Track your earnings, payouts and transaction history" />
      <div className="p-6 space-y-5">

        {/* Top Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: "💰", label: "Total Earned", value: `₹${(totalReceived/1000).toFixed(1)}K`, sub: "All time", color: "text-green-600", bg: "from-green-50 to-emerald-50", border: "border-green-100" },
            { icon: "⏳", label: "Pending Release", value: `₹${(totalPending/1000).toFixed(1)}K`, sub: "2 payments", color: "text-yellow-600", bg: "from-yellow-50 to-amber-50", border: "border-yellow-100" },
            { icon: "🏦", label: "Total Withdrawn", value: `₹${(totalWithdrawn/1000).toFixed(1)}K`, sub: "This month", color: "text-blue-600", bg: "from-blue-50 to-sky-50", border: "border-blue-100" },
            { icon: "👛", label: "Wallet Balance", value: `₹${(walletBalance/1000).toFixed(1)}K`, sub: "Available", color: "text-purple-600", bg: "from-purple-50 to-violet-50", border: "border-purple-100" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.bg} rounded-2xl border ${s.border} p-4 shadow-sm`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{s.icon}</span>
                <div className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 ${s.color}`}>{s.sub}</div>
              </div>
              <div className={`text-2xl font-bold ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left: Transaction list */}
          <div className="col-span-2 space-y-4">
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">Transaction History</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <Icon.search />
                    <input className="text-xs outline-none bg-transparent placeholder-gray-400 w-32" placeholder="Search transactions..." />
                  </div>
                  <select className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-600 outline-none">
                    <option>All Methods</option><option>UPI</option><option>NEFT</option><option>Bank Transfer</option>
                  </select>
                  <button className="bg-green-600 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1 hover:bg-green-700 transition font-medium">
                    ⬇ Export
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4">
                {(["all","received","pending","withdrawn"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition ${activeTab === tab ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                  >
                    {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className="ml-1 opacity-70">
                      ({tab === "all" ? transactions.length : transactions.filter(t => t.status.toLowerCase() === tab).length})
                    </span>
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-400 font-semibold">
                      <th className="text-left px-4 py-2.5">Transaction</th>
                      <th className="text-left px-4 py-2.5">Buyer</th>
                      <th className="text-left px-4 py-2.5">Date</th>
                      <th className="text-left px-4 py-2.5">Method</th>
                      <th className="text-left px-4 py-2.5">Amount</th>
                      <th className="text-left px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t, i) => (
                      <tr key={t.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <div className="text-xs font-semibold text-gray-700">{t.id}</div>
                          <div className="text-xs text-gray-400">{t.orderId}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{t.crop}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${t.color} flex items-center justify-center text-xs font-bold flex-shrink-0`}>{t.initials}</div>
                            <span className="text-xs font-medium text-gray-700 leading-tight">{t.buyer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{t.date}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs flex items-center gap-1">{t.methodIcon} {t.method}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`text-sm font-bold ${t.status === "Pending" ? "text-yellow-600" : "text-gray-900"}`}>
                            ₹{t.amount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[t.status]}`}>{t.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-xs text-green-600 font-medium hover:underline">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Wallet Card */}
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium opacity-80">Smart-Kissan Wallet</div>
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-lg">👛</div>
              </div>
              <div className="text-xs opacity-60 mb-1">Available Balance</div>
              <div className="text-3xl font-bold mb-1">₹{(walletBalance/1000).toFixed(1)}K</div>
              <div className="text-xs opacity-60 mb-5">Ramesh Kumar &nbsp;•&nbsp; Farmer Account</div>
              <button className="w-full bg-white text-green-700 font-semibold text-sm py-2.5 rounded-xl hover:bg-green-50 transition flex items-center justify-center gap-1.5">
                🏦 Withdraw to Bank
              </button>
            </div>

            {/* Linked Bank */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="font-semibold text-gray-800 text-sm mb-3">Linked Bank Account</div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                <span className="text-2xl">🏦</span>
                <div>
                  <div className="text-xs font-semibold text-gray-700">State Bank of India</div>
                  <div className="text-xs text-gray-400">A/C: ••••••4521 &nbsp;•&nbsp; IFSC: SBIN0001234</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium mt-0.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Verified</div>
                </div>
              </div>
              <button className="w-full border border-dashed border-gray-300 text-gray-400 text-xs py-2 rounded-xl hover:border-green-400 hover:text-green-600 transition flex items-center justify-center gap-1">
                <Icon.plus /> Add Another Account
              </button>
            </div>

            {/* Payment Summary Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="font-semibold text-gray-800 text-sm mb-3">Monthly Earnings</div>
              <div className="flex items-end gap-1.5 h-24 mb-2">
                {[
                  { month: "Jan", val: 55, h: 40 },
                  { month: "Feb", val: 72, h: 52 },
                  { month: "Mar", val: 68, h: 49 },
                  { month: "Apr", val: 90, h: 65 },
                  { month: "May", val: 100, h: 72 },
                ].map(b => (
                  <div key={b.month} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-lg transition-all ${b.month === "May" ? "bg-green-600" : "bg-green-100"}`}
                      style={{ height: `${b.h}px` }}
                    />
                    <div className="text-xs text-gray-400">{b.month}</div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">↑ <span className="text-green-600 font-semibold">+11%</span> vs last month</div>
            </div>

            {/* Quick Tips */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span>💡</span>
                <span className="text-sm font-semibold text-amber-800">Payment Tips</span>
              </div>
              {[
                "Payments are released within 24–48 hrs of order confirmation.",
                "UPI withdrawals are instant. NEFT takes 1 working day.",
                "Keep your bank details updated to avoid delays.",
              ].map(tip => (
                <div key={tip} className="flex items-start gap-1.5 text-xs text-amber-700 py-0.5">
                  <span className="text-amber-400 mt-0.5">•</span>{tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 9: Messages ─────────────────────────────────────────────────────────
function MessagesPage() {
  const [activeConv, setActiveConv] = useState(0);
  const [inputMsg, setInputMsg] = useState("");

  const conversations = [
    {
      id: 0,
      initials: "JM", color: "bg-green-100 text-green-700",
      name: "Jaipur Mandi Traders",
      role: "Verified Buyer",
      crop: "Wheat (50 Quintal)",
      lastMsg: "When can we arrange the pickup?",
      time: "10:42 AM",
      unread: 2,
      online: true,
      messages: [
        { from: "them", text: "Hello Ramesh ji! I'm interested in your Wheat listing (50 Quintal).", time: "10:20 AM" },
        { from: "me", text: "Namaste! Yes it's available. Fresh harvest, HD-2967 variety.", time: "10:22 AM" },
        { from: "them", text: "What is the moisture content? And is the price negotiable?", time: "10:25 AM" },
        { from: "me", text: "Moisture is 12.5% — ideal quality. Price is ₹2,150/quintal, I can consider ₹2,100 for bulk.", time: "10:28 AM" },
        { from: "them", text: "That works. We'll send a formal offer via the platform. When can we arrange the pickup?", time: "10:42 AM" },
      ],
    },
    {
      id: 1,
      initials: "AA", color: "bg-blue-100 text-blue-700",
      name: "Alwar Agri Pvt. Ltd.",
      role: "Verified Buyer",
      crop: "Mustard (30 Quintal)",
      lastMsg: "We'll confirm by tomorrow.",
      time: "Yesterday",
      unread: 0,
      online: false,
      messages: [
        { from: "them", text: "Hi, we're interested in your mustard listing. Quality looks good in the photos.", time: "Yesterday 2:10 PM" },
        { from: "me", text: "Thank you! It's fresh from this season. Purity is 98%.", time: "Yesterday 2:30 PM" },
        { from: "them", text: "We'll confirm by tomorrow.", time: "Yesterday 3:00 PM" },
      ],
    },
    {
      id: 2,
      initials: "KF", color: "bg-purple-100 text-purple-700",
      name: "Kota Food Exports",
      role: "Verified Buyer",
      crop: "Basmati Rice (100 Quintal)",
      lastMsg: "Payment has been initiated ✓",
      time: "20 May",
      unread: 0,
      online: true,
      messages: [
        { from: "them", text: "The order is confirmed. Payment has been initiated ✓", time: "20 May, 5:00 PM" },
        { from: "me", text: "Thank you! We will arrange delivery as discussed.", time: "20 May, 5:15 PM" },
      ],
    },
    {
      id: 3,
      initials: "BT", color: "bg-orange-100 text-orange-700",
      name: "Bikaner Traders",
      role: "Verified Buyer",
      crop: "Chickpea (40 Quintal)",
      lastMsg: "Thank you for the quick delivery!",
      time: "18 May",
      unread: 0,
      online: false,
      messages: [
        { from: "them", text: "Received the chickpea. Quality is excellent!", time: "18 May, 11:00 AM" },
        { from: "me", text: "Glad to hear that! Please do leave a rating.", time: "18 May, 11:10 AM" },
        { from: "them", text: "Thank you for the quick delivery!", time: "18 May, 11:15 AM" },
      ],
    },
    {
      id: 4,
      initials: "RS", color: "bg-pink-100 text-pink-700",
      name: "Rajasthan Supermart",
      role: "Verified Buyer",
      crop: "Moong Dal (20 Quintal)",
      lastMsg: "Can you share the quality certificate?",
      time: "16 May",
      unread: 1,
      online: false,
      messages: [
        { from: "them", text: "We are interested in moong dal. Can you share the quality certificate?", time: "16 May, 9:00 AM" },
      ],
    },
  ];

  const conv = conversations[activeConv];

  const quickReplies = [
    "Yes, it's available.",
    "I can arrange pickup from my farm.",
    "Price is fixed at listed rate.",
    "Quality is excellent, farm fresh.",
  ];

  return (
    <div className="flex-1 overflow-hidden bg-gray-50 flex flex-col">
      <TopBar title="Messages" subtitle="Chat with buyers and manage your conversations" />
      <div className="flex flex-1 overflow-hidden p-4 gap-4">

        {/* Conversation List */}
        <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Icon.search />
              <input className="flex-1 text-xs outline-none bg-transparent placeholder-gray-400" placeholder="Search conversations..." />
            </div>
          </div>
          <div className="flex gap-1 px-3 py-2 border-b border-gray-50">
            {["All","Unread","Active"].map((t,i) => (
              <button key={t} className={`px-3 py-1 rounded-lg text-xs font-medium transition ${i===0 ? "bg-green-100 text-green-700" : "text-gray-400 hover:bg-gray-50"}`}>{t}</button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(i)}
                className={`w-full flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition text-left ${activeConv === i ? "bg-green-50 border-l-2 border-l-green-500" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-sm font-bold`}>{c.initials}</div>
                  {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-gray-800 truncate">{c.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{c.time}</span>
                  </div>
                  <div className="text-xs text-green-600 mb-0.5">{c.crop}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate">{c.lastMsg}</span>
                    {c.unread > 0 && (
                      <span className="ml-1 flex-shrink-0 w-4 h-4 bg-green-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{c.unread}</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${conv.color} flex items-center justify-center font-bold text-sm`}>{conv.initials}</div>
                {conv.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>}
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{conv.name}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-green-600">✓ {conv.role}</span>
                  <span>•</span>
                  <span>{conv.online ? "Online" : "Offline"}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1">
                🌾 {conv.crop}
              </div>
              <button className="w-8 h-8 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 transition"><Icon.dots /></button>
            </div>
          </div>

          {/* Linked order banner */}
          <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-700">
              <span>📦</span>
              <span>Linked to listing: <strong>{conv.crop}</strong> — Listing #SK12345</span>
            </div>
            <button className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1">View Listing <Icon.arrow /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {conv.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} gap-2`}>
                {m.from === "them" && (
                  <div className={`w-7 h-7 rounded-full ${conv.color} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1`}>{conv.initials}</div>
                )}
                <div className="max-w-xs">
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.from === "me"
                      ? "bg-green-600 text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}>
                    {m.text}
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${m.from === "me" ? "text-right" : ""}`}>
                    {m.time} {m.from === "me" ? "✓✓" : ""}
                  </div>
                </div>
                {m.from === "me" && (
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm flex-shrink-0 mt-1">👨‍🌾</div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Replies */}
          <div className="px-5 py-2 border-t border-gray-50 flex gap-2 flex-wrap">
            {quickReplies.map(q => (
              <button key={q} onClick={() => setInputMsg(q)} className="bg-gray-50 border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition">{q}</button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-end gap-3">
              <div className="flex-1 flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5">
                <textarea
                  rows={1}
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 resize-none"
                  placeholder="Type a message..."
                />
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button className="text-gray-400 hover:text-gray-600"><Icon.attach /></button>
                  <button className="text-gray-400 hover:text-gray-600">📷</button>
                </div>
              </div>
              <button className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white hover:bg-green-700 transition flex-shrink-0">
                <Icon.send />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1.5 text-center">Messages are end-to-end encrypted for your security 🔒</div>
          </div>
        </div>

        {/* Right Sidebar: Buyer Info */}
        <div className="w-60 flex-shrink-0 flex flex-col gap-4">
          {/* Buyer Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Buyer Info</div>
            <div className="flex flex-col items-center mb-3">
              <div className={`w-14 h-14 rounded-full ${conv.color} flex items-center justify-center text-xl font-bold mb-2`}>{conv.initials}</div>
              <div className="text-sm font-semibold text-gray-800 text-center">{conv.name}</div>
              <div className="text-xs text-green-600 font-medium flex items-center gap-1">✓ {conv.role}</div>
              <div className="flex gap-0.5 mt-1">{[1,2,3,4,5].map(s => <span key={s}>{Icon.star(s<=4)()}</span>)}</div>
              <div className="text-xs text-gray-400 mt-0.5">4.6 rating • 128 orders</div>
            </div>
            <div className="space-y-2">
              {[["📍","Location","Jaipur, Rajasthan"],["🏢","Type","Mandi / Trader"],["🕐","Joined","March 2022"]].map(([e,l,v]) => (
                <div key={l} className="flex items-center gap-2 text-xs">
                  <span>{e}</span>
                  <span className="text-gray-400">{l}:</span>
                  <span className="text-gray-700 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Listing */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Linked Listing</div>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-2 mb-2">
              <span className="text-2xl">🌾</span>
              <div>
                <div className="text-xs font-semibold text-gray-800">{conv.crop}</div>
                <div className="text-xs text-gray-500">₹2,150 / Quintal</div>
                <div className="text-xs text-green-600 font-medium">Active</div>
              </div>
            </div>
            <button className="w-full border border-green-200 text-green-700 text-xs py-2 rounded-xl hover:bg-green-50 transition">View Listing</button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="text-sm font-semibold text-gray-800 mb-3">Quick Actions</div>
            <div className="space-y-2">
              {[
                { icon: "🤝", label: "View Their Offer", color: "bg-green-50 text-green-700 border-green-100" },
                { icon: "📦", label: "Go to Order", color: "bg-blue-50 text-blue-700 border-blue-100" },
                { icon: "⚠️", label: "Report Issue", color: "bg-red-50 text-red-600 border-red-100" },
              ].map(a => (
                <button key={a.label} className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition hover:opacity-80 ${a.color}`}>
                  <span>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Tip */}
          <div className="bg-green-50 rounded-2xl border border-green-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span>🛡️</span>
              <span className="text-xs font-semibold text-green-800">Safety Tip</span>
            </div>
            <p className="text-xs text-green-700">Never share OTPs or bank details in chat. All payments are handled securely via the platform.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  const navigate = (p: Page) => setPage(p);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage navigate={navigate} />;
      case "listings": return <ListingsPage navigate={navigate} />;
      case "product-detail": return <ProductDetailPage navigate={navigate} />;
      case "bids": return <BidsPage />;
      case "demand": return <DemandPage />;
      case "chatbot": return <ChatbotPage />;
      case "disputes": return <DisputesPage />;
      case "payments": return <PaymentsPage />;
      case "messages": return <MessagesPage />;
      default: return <DashboardPage navigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden" style={{fontFamily:"'DM Sans', 'Nunito', sans-serif"}}>
      <Sidebar current={page} navigate={navigate} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}
