import React from 'react';
import { ShoppingBag, Calendar, Check, X, Phone, User } from 'lucide-react';

interface BidCardProps {
  bid: any;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const BidCard = ({ bid, onAccept, onReject }: BidCardProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900">{bid.buyerName || 'Premium Buyer'}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3 h-3" /> {new Date(bid.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-green-600">₹{bid.amount}</div>
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Bid Amount</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Crop</div>
          <div className="text-sm font-bold text-gray-900">{bid.cropName || 'Wheat (Hybrid)'}</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-2xl">
          <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">Quantity</div>
          <div className="text-sm font-bold text-gray-900">{bid.quantity || '500'} KG</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onReject(bid._id)}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all"
        >
          <X className="w-4 h-4" /> Reject
        </button>
        <button 
          onClick={() => onAccept(bid._id)}
          className="flex-[2] flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
        >
          <Check className="w-4 h-4" /> Accept Bid
        </button>
      </div>
    </div>
  );
};

export default BidCard;
