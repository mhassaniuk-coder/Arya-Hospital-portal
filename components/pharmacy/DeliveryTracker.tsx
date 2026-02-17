import React from 'react';
import { Truck } from 'lucide-react';
import { PharmacyOrder } from '../../types';

interface DeliveryTrackerProps {
  order: PharmacyOrder | null;
}

const STEPS: { key: PharmacyOrder['status']; label: string }[] = [
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ order }) => {
  if (!order) return null;

  const stepIndex = STEPS.findIndex((s) => s.key === order.status);
  const progress = stepIndex >= 0 ? (stepIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-full text-green-600">
          <Truck size={20} />
        </div>
        <h3 className="font-bold text-slate-800">Order #{order.id.toUpperCase()} Delivery</h3>
      </div>
      <div className="relative pt-6 pb-2">
        <div className="h-2 bg-slate-100 rounded-full mb-4">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${Math.max(25, progress)}%` }}
          >
            <div className="absolute right-0 -top-1 w-4 h-4 bg-white border-4 border-green-500 rounded-full shadow-sm" />
          </div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
          {STEPS.map((step, i) => (
            <span
              key={step.key}
              className={i <= stepIndex ? 'text-green-600' : ''}
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>
      {order.trackingMessage && (
        <p className="text-sm text-slate-600 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          {order.trackingMessage}
          {order.estimatedDelivery && (
            <strong className="block mt-1">Estimated: {order.estimatedDelivery}</strong>
          )}
        </p>
      )}
    </div>
  );
};
