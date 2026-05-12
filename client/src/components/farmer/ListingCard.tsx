import React from 'react';
import { Sprout, TrendingUp, DollarSign, ChevronRight } from 'lucide-react';

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all group flex flex-col">
      <div className="aspect-video w-full bg-slate-100 relative overflow-hidden">
        {listing.images?.[0] ? (
          <img src={listing.images[0]} alt={listing.productName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300"><Sprout size={40}/></div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm text-emerald-700 flex items-center gap-1">
          Grade {listing.aiGrade || 'Pending'}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 capitalize mb-1">{listing.productName}</h3>
        <p className="text-slate-500 text-sm mb-4">Qty: {listing.quantity} {listing.unit}</p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
          <div>
            <p className="text-xs text-slate-400 font-semibold">Expected Rate</p>
            <p className="text-xl font-extrabold text-slate-900">₹{listing.expectedPrice}<span className="text-xs font-normal text-slate-500">/{listing.unit}</span></p>
          </div>
          <button className="bg-slate-50 p-2 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
