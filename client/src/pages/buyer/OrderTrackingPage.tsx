import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Download, 
  Share2, 
  MessageCircle 
} from 'lucide-react';
// @ts-ignore
import buyerService from '../../services/buyerService';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';

const steps = [
  { key: 'ordered', label: 'Ordered', icon: Package },
  { key: 'packed', label: 'Packed', icon: ShoppingBag },
  { key: 'in-transit', label: 'In Transit', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

import { ShoppingBag } from 'lucide-react';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await buyerService.getOrderById(id);
      setOrder(response.data.order);
      setTracking(response.data.tracking || {
        currentStep: 'in-transit',
        timeline: {
          ordered: new Date(Date.now() - 86400000 * 2),
          packed: new Date(Date.now() - 86400000),
          'in-transit': new Date()
        },
        currentLocation: {
          lat: 19.0760,
          lng: 72.8777,
          address: 'Vashi Mandi, Mumbai, Maharashtra'
        },
        lastUpdate: new Date()
      });
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = () => {
    const current = tracking?.currentStep || 'ordered';
    return steps.findIndex(s => s.key === current);
  };

  if (loading) return <div className="flex items-center justify-center h-96">Loading tracking data...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">{order.productName}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Order ID: <span className="font-mono font-bold">#{order.id}</span></p>
        </div>
        <StatusBadge status={order.status} variant={order.status === 'delivered' ? 'success' : 'primary'} />
      </div>

      <div className="card p-8">
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-dark-300">
            <div 
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: `${(getCurrentStep() / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= getCurrentStep();
              const isCurrent = index === getCurrentStep();
              const StepIcon = step.icon;
              
              return (
                <div key={step.key} className="text-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 relative z-10
                    ${isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-300 text-gray-500'}
                    ${isCurrent ? 'ring-4 ring-primary-100 dark:ring-primary-900' : ''}
                  `}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <p className={`text-xs font-bold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {tracking?.timeline?.[step.key] && (
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(tracking.timeline[step.key]).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {tracking?.currentLocation && (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-300 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Live Tracking</h3>
            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
              Active Now
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-dark-300 h-64 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/72.8777,19.0760,11/800x400?access_token=YOUR_TOKEN')] bg-cover">
               <div className="relative">
                  <div className="absolute -top-12 -left-1/2 transform -translate-x-1/2 bg-white dark:bg-dark-200 p-2 rounded-lg shadow-xl border border-gray-100 whitespace-nowrap text-xs font-bold z-10">
                    Currently at {tracking.currentLocation.address}
                  </div>
                  <Truck className="w-10 h-10 text-primary-600 drop-shadow-lg" />
               </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-dark-300/50 flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              <span className="font-medium">{tracking.currentLocation.address}</span>
            </div>
            <span className="text-gray-500 italic">Last update: {new Date(tracking.lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Shipment Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Transporter</span>
              <span className="text-sm font-bold">{order.transporter?.name || 'VRL Logistics'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Vehicle</span>
              <span className="text-sm font-bold">{order.vehicleNumber || 'MH-43-BE-1234'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Estimated Delivery</span>
              <span className="text-sm font-bold text-primary-600">Tomorrow, 4:00 PM</span>
            </div>
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-2">Delivery Address</p>
              <p className="text-sm font-medium">{order.deliveryAddress?.name || 'Suresh Kumar'}</p>
              <p className="text-xs text-gray-500">{order.deliveryAddress?.address || 'Plot 42, Sector 15, Vashi'}</p>
              <p className="text-xs text-gray-500">{order.deliveryAddress?.city || 'Navi Mumbai'}, {order.deliveryAddress?.state || 'Maharashtra'}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 text-center flex flex-col justify-center">
          <h3 className="text-lg font-semibold mb-2">Order QR Code</h3>
          <p className="text-xs text-gray-500 mb-6">Show this QR to the transporter for secure handover</p>
          <div className="mx-auto p-4 bg-white rounded-2xl shadow-inner border border-gray-100 mb-6">
             <div className="w-32 h-32 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDER-12345')] bg-cover"></div>
          </div>
          <div className="flex gap-2 justify-center">
            <button className="p-2 rounded-lg border hover:bg-gray-50"><Download className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg border hover:bg-gray-50"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
