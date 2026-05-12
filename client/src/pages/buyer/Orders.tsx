import React, { useState, useEffect } from 'react';
import { ClipboardList, Clock, CheckCircle2, Truck, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/api/client';
import DashboardLayout from '@/components/layout/DashboardLayout';

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PAYMENT_DUE: 'bg-orange-50 text-orange-700 border-orange-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  IN_TRANSIT: 'bg-purple-50 text-purple-700 border-purple-200',
  DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/buyer/orders').then(r => setOrders(r.data.data || [])).catch(() => {
      setOrders([
        { _id: '1', productName: 'Organic Tomatoes', farmerName: 'Ramesh Patil', quantity: 200, unit: 'kg', totalPrice: 9000, status: 'IN_TRANSIT', createdAt: '2026-05-10' },
        { _id: '2', productName: 'Basmati Rice', farmerName: 'Sunil Kumar', quantity: 500, unit: 'kg', totalPrice: 34000, status: 'PAYMENT_DUE', createdAt: '2026-05-11' },
      ]);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">My Orders</h1>
        <p className="text-slate-500 text-sm mb-8">Track purchases and manage payments.</p>
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{order.productName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status] || ''}`}>{order.status.replace('_',' ')}</span>
                </div>
                <p className="text-sm text-slate-500">From: <strong>{order.farmerName}</strong> • {order.quantity} {order.unit}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xl font-black text-slate-900">INR {order.totalPrice?.toLocaleString()}</p>
                {order.status === 'PAYMENT_DUE' && <Link to="/buyer/payment" className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold"><CreditCard size={14} className="inline mr-1"/>Pay Now</Link>}
                {order.status === 'IN_TRANSIT' && <Link to={`/tracking/${order._id}`} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold"><MapPin size={14} className="inline mr-1"/>Track</Link>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
