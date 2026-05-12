import React from 'react';
import { 
  Sprout, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Scale
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-100/50 transition-all group flex flex-col relative overflow-hidden">
      <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
        {listing.images?.[0] ? (
          <img src={listing.images[0]} alt={listing.cropName || listing.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 text-emerald-200"><Sprout size={48}/></div>
        )}
        <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2 shadow-sm">
          <ShieldCheck size={14} /> Quality: {listing.qualityScore || listing.aiGrade || '90'}%
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight capitalize">
              {listing.cropName || listing.productName}
            </h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
              <Clock size={12} /> {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Active Now'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Quantity</p>
            <p className="text-sm font-black text-gray-900 flex items-center gap-1">
              <Scale size={12} className="text-emerald-500" /> {listing.quantity} {listing.unit}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Expected Rate</p>
            <p className="text-sm font-black text-emerald-600">₹{listing.basePrice || listing.expectedPrice}/{listing.unit}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
              ))}
            </div>
            <p className="text-[10px] font-black text-emerald-600">{listing.bidsCount || 0} Interested</p>
          </div>
          <Link to={`/farmer/listing/${listing._id || listing.id}`} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-gray-100">
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
