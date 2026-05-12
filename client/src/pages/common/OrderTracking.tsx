import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, Phone, ShieldCheck } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LiveMap from '@/components/logistics/LiveMap';
import StatusTimeline from '@/components/common/StatusTimeline';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const timelineSteps = [
    { label: 'Order Placed', time: 'May 10, 2026 â€¢ 10:30 AM', status: 'completed' as const },
    { label: 'Payment Secured', time: 'May 10, 2026 â€¢ 10:35 AM', status: 'completed' as const },
    { label: 'Harvest Pickup', time: 'May 11, 2026 â€¢ 09:00 AM', status: 'completed' as const },
    { label: 'In Transit', time: 'Current Location: Pune Highway', status: 'current' as const },
    { label: 'Out for Delivery', status: 'pending' as const },
    { label: 'Completed', status: 'pending' as const },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Map & Core Details */}
          <div className="flex-[2] space-y-8">
            <div className="bg-white p-4 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 h-[500px]">
              <LiveMap 
                center={[18.5204, 73.8567]} 
                zoom={10}
                markers={[
                  { position: [18.5204, 73.8567], label: 'Current Location' },
                  { position: [19.0760, 72.8777], label: 'Destination' }
                ]}
                route={[
                  [18.5204, 73.8567],
                  [18.7500, 73.4000],
                  [19.0760, 72.8777]
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Transporter</h4>
                  <div className="text-lg font-black text-gray-900">Rahul Logistics</div>
                  <button className="mt-2 flex items-center gap-2 text-xs font-bold text-green-600">
                    <Phone className="w-3 h-3" /> Contact Driver
                  </button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Security</h4>
                  <div className="text-lg font-black text-gray-900">Escrow Protected</div>
                  <p className="text-xs font-bold text-gray-400 mt-1">Funds released upon delivery scan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <aside className="flex-1 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">Tracking Info</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #SK-8821092</p>
              </div>
            </div>

            <StatusTimeline steps={timelineSteps} />

            <div className="mt-8 pt-8 border-t border-gray-100">
              <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all">
                Raise a Dispute
              </button>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderTracking;

