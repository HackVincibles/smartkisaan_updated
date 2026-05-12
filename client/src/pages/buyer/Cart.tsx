import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const Cart = () => {
  // Mock cart items (In real app, this would come from a context or store)
  const [items, setItems] = useState([
    { id: '1', name: 'Premium Basmati Rice', price: 85, quantity: 500, total: 42500, image: '' },
    { id: '2', name: 'Organic Tomatoes', price: 40, quantity: 200, total: 8000, image: '' }
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const logisticsFee = 1200;
  const platformFee = 450;
  const total = subtotal + logisticsFee + platformFee;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Checkout</h1>
          <p className="text-gray-500 mt-1">Review your selections and secure your harvest</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{item.quantity} KG â€¢ â‚¹{item.price}/KG</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <div className="text-2xl font-black text-gray-900">â‚¹{item.total.toLocaleString()}</div>
                  </div>
                  <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-start gap-4">
              <Truck className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h5 className="font-bold text-blue-900">Logistics Optimization</h5>
                <p className="text-sm text-blue-700 leading-relaxed">
                  We've found 3 transporters near the farm who can deliver these items together, saving you â‚¹450 in delivery fees.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <aside className="space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100 space-y-6">
              <h3 className="text-xl font-black text-gray-900">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-gray-500 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-gray-900">â‚¹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold text-sm">
                  <span>Logistics Fee</span>
                  <span className="text-gray-900">â‚¹{logisticsFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold text-sm">
                  <span>Platform Fee</span>
                  <span className="text-gray-900">â‚¹{platformFee.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                  <span className="font-black text-gray-900">Total Payable</span>
                  <div className="text-right">
                    <div className="text-3xl font-black text-green-600">â‚¹{total.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Inclusive of GST</div>
                  </div>
                </div>
              </div>

              <Link 
                to="/buyer/payment" 
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 shadow-xl shadow-green-100 flex items-center justify-center gap-2 transition-all"
              >
                Proceed to Payment <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> 100% Secure Transaction
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-bold text-gray-500">Razorpay, UPI, Cards, Net Banking</span>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Cart;

