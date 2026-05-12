import React, { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogFooter, DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IndianRupee, Gavel, AlertCircle } from 'lucide-react';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  listing: any;
}

const BidModal = ({ isOpen, onClose, onSubmit, listing }: BidModalProps) => {
  const [amount, setAmount] = useState<string>('');

  const handleBid = () => {
    if (amount && parseFloat(amount) > 0) {
      onSubmit(parseFloat(amount));
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-0 shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4 mx-auto">
            <Gavel className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black text-center text-gray-900">Place Your Bid</DialogTitle>
          <DialogDescription className="text-center font-medium text-gray-500">
            You are bidding for <span className="font-bold text-gray-900">{listing?.cropName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-orange-700 leading-relaxed">
              Recommended Bid: ₹{listing?.expectedPrice - 100} - ₹{listing?.expectedPrice + 100} based on current market rates.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Offer (per KG)</label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                type="number" 
                className="pl-12 py-7 text-xl font-black text-gray-900 rounded-2xl border-gray-100 focus:ring-green-600"
                placeholder="2,400"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 flex gap-3 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 py-6 rounded-2xl font-bold border-gray-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBid}
            className="flex-[2] py-6 rounded-2xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100"
          >
            Confirm Bid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BidModal;
