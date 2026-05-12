import React from 'react';
import { Package, Truck, CheckCircle2, AlertCircle, Clock, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: any;
  role: 'buyer' | 'farmer';
}

const OrderCard = ({ order, role }: OrderCardProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return { color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Delivered' };
      case 'IN_TRANSIT':
        return { color: 'bg-blue-100 text-blue-700', icon: <Truck className="w-4 h-4" />, label: 'In Transit' };
      case 'DISPUTED':
        return { color: 'bg-red-100 text-red-700', icon: <AlertCircle className="w-4 h-4" />, label: 'Disputed' };
      default:
        return { color: 'bg-orange-100 text-orange-700', icon: <Clock className="w-4 h-4" />, label: 'Processing' };
    }
  };

  const status = getStatusInfo(order.escrowState);

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.color} flex items-center gap-1`}>
                {status.icon} {status.label}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{order._id.slice(-6)}</span>
            </div>
            <h4 className="text-xl font-black text-gray-900">{order.cropName}</h4>
            <p className="text-sm text-gray-500 font-medium">
              {order.quantity} KG • ₹{order.agreedPrice}/KG
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8 px-6 md:border-x border-gray-100">
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Amount</div>
            <div className="text-xl font-black text-gray-900">₹{(order.quantity * order.agreedPrice).toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Payment</div>
            <div className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">Secured</div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
            Track Order <MapPin className="w-4 h-4" />
          </button>
          <button className="px-6 py-2 text-gray-500 font-bold text-xs hover:text-gray-900 transition-all">
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
