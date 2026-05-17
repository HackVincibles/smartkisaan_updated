import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, MapPin, Phone, ShieldCheck, Clock } from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import LiveMap from '../../components/logistics/LiveMap';
import StatusTimeline from '../../components/common/StatusTimeline';
import { useOptimizedTracking } from '../../hooks/useOptimizedTracking';
import { getMockOrderById } from '../../services/routeService';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock order context for general tracking page demo
  const mockOrder = useMemo(() => {
    return getMockOrderById(id);
  }, [id]);

  const trackingData = useOptimizedTracking(mockOrder, true, false);

  const timelineSteps = [
    { label: 'Order Placed', time: 'May 10, 2026 • 10:30 AM', status: 'completed' as const },
    { label: 'Payment Secured', time: 'May 10, 2026 • 10:35 AM', status: 'completed' as const },
    { label: 'Harvest Pickup', time: 'May 11, 2026 • 09:00 AM', status: 'completed' as const },
    { 
      label: 'In Transit', 
      time: `Current Position: ${trackingData.vehiclePos[0].toFixed(4)}° N, ${trackingData.vehiclePos[1].toFixed(4)}° E`, 
      status: 'current' as const 
    },
    { label: 'Out for Delivery', status: 'pending' as const },
    { label: 'Completed', status: 'pending' as const },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 fade-in">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-green-600 transition-all">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Map & Core Details */}
          <div className="flex-[2] space-y-8">
            <div className="bg-white p-4 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-100 h-[500px] relative overflow-hidden">
              <LiveMap 
                center={trackingData.origin} 
                zoom={10}
                route={trackingData.optimizedRoute}
                waypoints={trackingData.visibleWaypoints}
                vehiclePos={trackingData.vehiclePos}
                bearing={trackingData.bearing}
                onBoundsChange={trackingData.setViewportBounds}
                onZoomChange={trackingData.setZoomLevel}
              />
              
              {/* ETA Floater Badge */}
              <div className="absolute bottom-8 left-8 bg-gray-950/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 z-[1000] flex items-center gap-3">
                <Clock size={16} className="text-green-500" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">
                  ETA: {trackingData.timeRemainingMinutes > 0 ? `${Math.floor(trackingData.timeRemainingMinutes / 60)}h ${trackingData.timeRemainingMinutes % 60}m` : 'Arrived'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Transporter</h4>
                  <div className="text-lg font-black text-gray-900">{mockOrder.transporter.name}</div>
                  <div className="text-xs font-bold text-gray-400 mt-1">Vehicle: {mockOrder.vehicleNumber}</div>
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{mockOrder.id}</p>
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
