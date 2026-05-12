import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MapPin, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info,
  Calendar,
  Filter,
  BarChart3,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import farmerService from '../../services/farmerService';
import { formatCurrency } from '../../lib/utils';
import toast from 'react-hot-toast';

const DemandMandiInsights = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [timeframe, setTimeframe] = useState('week');

  useEffect(() => {
    fetchInsights();
  }, [selectedCrop, timeframe]);

  const fetchInsights = async () => {
    try {
      // Simulating API call
      setTimeout(() => {
        setInsights({
          currentPrice: 2150,
          priceChange: '+4.5%',
          isPositive: true,
          mandiArrivals: 12500,
          demandScore: 85,
          topMandis: [
            { name: 'Jaipur Mandi', price: 2180, distance: 45 },
            { name: 'Kota Mandi', price: 2120, distance: 120 },
            { name: 'Alwar Mandi', price: 2210, distance: 80 }
          ],
          priceHistory: [2050, 2080, 2100, 2120, 2150, 2140, 2150]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load insights');
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading insights...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Demand & Mandi Insights</h1>
          <p className="text-gray-500">Real-time market analysis and price predictions</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="input w-40"
          >
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice</option>
            <option value="Mustard">Mustard</option>
            <option value="Tomato">Tomato</option>
          </select>
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input w-32"
          >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm text-gray-500 mb-1">Current Avg Price</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{formatCurrency(insights.currentPrice)}</h3>
            <span className={`text-xs font-bold flex items-center ${insights.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {insights.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {insights.priceChange}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Per Quintal</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500 mb-1">Mandi Arrivals</p>
          <h3 className="text-2xl font-bold">{insights.mandiArrivals.toLocaleString()} Qtl</h3>
          <p className="text-[10px] text-gray-400 mt-1">Last 24 Hours</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-500 mb-1">Demand Score</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold">{insights.demandScore}/100</h3>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-600" style={{ width: `${insights.demandScore}%` }} />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 text-right">Very High Demand</p>
        </div>
        <div className="card p-6 bg-primary-600 text-white">
          <p className="text-sm opacity-90 mb-1">Price Prediction</p>
          <h3 className="text-2xl font-bold">Bullish 📈</h3>
          <p className="text-[10px] opacity-80 mt-1">Expected to rise 3-5% in 15 days</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <LineChart className="w-5 h-5 text-primary-600" />
              Price Trend (7 Days)
            </h3>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1 text-gray-500"><div className="w-2 h-2 rounded-full bg-primary-600"></div> Market Price</span>
              <span className="flex items-center gap-1 text-gray-500"><div className="w-2 h-2 rounded-full bg-green-500"></div> Your Price</span>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-2">
            {insights.priceHistory.map((price: number, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full">
                  <div 
                    className="w-full bg-primary-100 group-hover:bg-primary-200 transition-all rounded-t-lg"
                    style={{ height: `${(price / 2500) * 100}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{price}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="p-4 border-b border-gray-100 dark:border-dark-300">
            <h3 className="font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Nearby Mandi Prices
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {insights.topMandis.map((mandi: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-dark-300">
                <div>
                  <p className="font-bold text-sm">{mandi.name}</p>
                  <p className="text-[10px] text-gray-500">{mandi.distance} km away</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary-600 text-lg">₹{mandi.price}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">High Potential</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2 text-sm text-primary-600 font-bold hover:underline">
              View All 42 Mandis →
            </button>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-blue-900 dark:text-blue-100">Smart Advice for Wheat Selling</h3>
            <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mt-1">
              Data shows that Kota Mandi prices usually peak on Tuesday mornings. Our AI recommends listing your Wheat for ₹2,180 on Monday evening to attract top-tier institutional buyers from Jaipur and Delhi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandMandiInsights;
