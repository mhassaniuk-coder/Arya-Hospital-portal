import React from 'react';
import { CreditCard, Lock, ShieldCheck, Home } from 'lucide-react';
import { Doctor, ServiceItem } from '../../types';
import { PaymentDetails } from './types';

interface PaymentFormProps {
  selectedDoctor: Doctor | null;
  selectedService: ServiceItem | null;
  paymentDetails: PaymentDetails;
  isProcessing: boolean;
  onUpdatePaymentDetails: (details: PaymentDetails) => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  selectedDoctor,
  selectedService,
  paymentDetails,
  isProcessing,
  onUpdatePaymentDetails,
}) => {
  const serviceFee = selectedDoctor ? 75 : selectedService?.price || 0;
  const platformFee = 5;
  const discount = 10;
  const total = Math.max(0, serviceFee + platformFee - discount);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Price Summary */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <CreditCard size={18} />
          Price Summary
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Service Fee</span>
            <span className="font-semibold text-slate-700">${serviceFee}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Platform Fee</span>
            <span className="font-semibold text-slate-700">${platformFee}.00</span>
          </div>
          <div className="flex justify-between text-sm text-green-600">
            <span>New User Discount</span>
            <span className="font-semibold">-${discount}.00</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between">
            <span className="font-semibold text-slate-700">Total</span>
            <span className="font-bold text-xl text-arya-600">${total}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700">Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-4 rounded-xl border-2 border-arya-500 bg-arya-50 text-left">
            <CreditCard size={24} className="text-arya-600 mb-2" />
            <span className="font-semibold text-slate-700">Credit/Debit Card</span>
          </button>
          <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 text-left">
            <ShieldCheck size={24} className="text-slate-400 mb-2" />
            <span className="font-semibold text-slate-700">Insurance</span>
          </button>
          <button className="p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-300 text-left">
            <Home size={24} className="text-slate-400 mb-2" />
            <span className="font-semibold text-slate-700">Cash on Visit</span>
          </button>
        </div>
      </div>
      
      {/* Card Details Form */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Lock size={16} className="text-green-500" />
          Card Details
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600 mb-1">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber}
              onChange={(e) => onUpdatePaymentDetails({...paymentDetails, cardNumber: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
              disabled={isProcessing}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentDetails.expiry}
                onChange={(e) => onUpdatePaymentDetails({...paymentDetails, expiry: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={paymentDetails.cvc}
                onChange={(e) => onUpdatePaymentDetails({...paymentDetails, cvc: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
                disabled={isProcessing}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-slate-600 mb-1">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={paymentDetails.name}
              onChange={(e) => onUpdatePaymentDetails({...paymentDetails, name: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
