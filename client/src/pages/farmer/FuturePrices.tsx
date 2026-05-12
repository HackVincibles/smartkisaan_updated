import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Info, Calendar, Zap } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const data = [
  { month: 'May', current: 2400, predicted: 2400 },
  { month: 'Jun', current: 2550, predicted: 2600 },
  { month: 'Jul', current: null, predicted: 2800 },
  { month: 'Aug', current: null, predicted: 2750 },
  { month: 'Sep', current: null, predicted: 2900 },
  { month: 'Oct', current: null, predicted: 3100 },
];

const FuturePrices = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Market Intelligence</h1>
            <p className="text-gray-500 mt-1 text-lg">AI-powered price predictions for your crop strategy.</p>
          </div>
          <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
            <button className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">Wheat</button>
            <button className="px-6 py-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-all">Rice</button>
            <button className="px-6 py-2 text-gray-400 font-bold text-sm hover:text-gray-900 transition-all">Corn</button>
          </div>
        </header>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: '30 Day Forecast', price: 'INR 2,600', change: 8.3, sentiment: 'Bullish' },
            { label: '60 Day Forecast', price: 'INR 2,800', change: 15.2, sentiment: 'Bullish' },
            { label: '90 Day Forecast', price: 'INR 3,100', change: 24.5, sentiment: 'Strong Buy' }
          ].map((card, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-24 h-24 text-green-600" />
              </div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{card.label}</div>
              <div className="text-3xl font-black text-gray-900 mb-4">{card.price}</div>
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${card.change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  <ArrowUpRight className="w-3 h-3" /> {card.change}%
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{card.sentiment}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast Chart */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Price Projection</h3>
              <p className="text-gray-400 text-sm font-medium mt-1">Based on historical trends & monsoon forecast</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs font-bold text-gray-500">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-300"></div>
                <span className="text-xs font-bold text-gray-500">Predicted</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  cursor={{stroke: '#16a34a', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="predicted" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="current" stroke="#000" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight Section */}
        <div className="bg-blue-600 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="w-20 h-20 bg-white/20 rounded-[2rem] flex items-center justify-center shrink-0">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="text-2xl font-black">Strategy Recommendation</h4>
            <p className="text-blue-100 text-lg leading-relaxed">Prices are expected to peak in <span className="font-bold text-white underline underline-offset-4 decoration-2">October</span>. We recommend holding <span className="font-bold text-white">30%</span> of your harvest for the next 45 days to maximize profit margins by up to <span className="font-bold text-white text-3xl ml-1">12%</span>.</p>
          </div>
          <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm whitespace-nowrap shadow-xl hover:bg-blue-50 transition-all">
            Set Price Alert
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FuturePrices;
