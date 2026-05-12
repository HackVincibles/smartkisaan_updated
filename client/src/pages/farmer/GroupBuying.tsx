import React from 'react';
import { Users, ShoppingBag, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const groups = [
  { id: '1', item: 'NPK Fertilizer (50kg)', price: 'INR 1,200', original: 'INR 1,600', savings: '25%', members: 18, target: 25, daysLeft: 2 },
  { id: '2', item: 'Hybrid Tomato Seeds', price: 'INR 450', original: 'INR 600', savings: '25%', members: 42, target: 50, daysLeft: 4 },
  { id: '3', item: 'Organic Compost (1 Ton)', price: 'INR 8,500', original: 'INR 11,000', savings: '22%', members: 5, target: 10, daysLeft: 7 },
];

const GroupBuying = () => {
  return (
    <DashboardLayout>
      <div className="space-y-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Group Buying</h1>
            <p className="text-gray-500 mt-1 text-lg">Join forces with local farmers to slash input costs.</p>
          </div>
          <button className="px-6 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-xl shadow-green-100 transition-all flex items-center gap-2">
            <Zap className="w-5 h-5" /> Start New Group
          </button>
        </header>

        {/* Info Banner */}
        <div className="bg-orange-50 border border-orange-100 p-8 rounded-[2.5rem] flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-gray-900">How it works</h4>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">By ordering together, we unlock wholesale prices directly from manufacturers. Payments are held in escrow and only released once the bulk order is triggered. Shipping costs are split equally among members.</p>
          </div>
        </div>

        {/* Group Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.map((group) => (
            <div key={group.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Save {group.savings}</div>
                  <div className="text-2xl font-black text-gray-900">{group.price}</div>
                  <div className="text-xs text-gray-400 line-through font-bold">{group.original}</div>
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-2">{group.item}</h3>
              
              <div className="mt-auto space-y-6 pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-gray-900">{group.members}/{group.target} Farmers</span>
                  </div>
                  <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all duration-1000" 
                      style={{ width: `${(group.members / group.target) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> Local Group
                  </div>
                  <div>{group.daysLeft} Days Left</div>
                </div>

                <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center justify-center gap-2">
                  Join Group <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-gray-900">Buyer Protection</h3>
          <p className="text-gray-500 max-w-lg mx-auto font-medium">All group purchases are protected. If the group doesn't reach the target, your payment is refunded instantly to your SmartKisan wallet.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GroupBuying;
