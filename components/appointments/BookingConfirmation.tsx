import React from 'react';
import { CheckCircle, Calendar, Bell, Stethoscope, Home, TestTube, Scan } from 'lucide-react';
import { Doctor, ServiceItem, FamilyMember } from '../../types';
import { ServiceType } from './types';

interface BookingConfirmationProps {
  selectedServiceType: ServiceType;
  selectedDoctor: Doctor | null;
  selectedService: ServiceItem | null;
  selectedDate: string;
  selectedSlot: { time: string } | null;
  selectedFamilyMemberId: string;
  familyMembers: FamilyMember[];
  onClose: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  selectedServiceType,
  selectedDoctor,
  selectedService,
  selectedDate,
  selectedSlot,
  selectedFamilyMemberId,
  familyMembers,
  onClose,
}) => {
  const selectedFamilyMember = familyMembers.find(m => m.id === selectedFamilyMemberId);
  const confirmationNumber = `ARY-${Date.now().toString().slice(-6)}`;

  const getServiceIcon = () => {
    switch (selectedServiceType) {
      case 'consultation': return <Stethoscope size={24} className="text-arya-600" />;
      case 'home-care': return <Home size={24} className="text-arya-600" />;
      case 'lab': return <TestTube size={24} className="text-arya-600" />;
      case 'imaging': return <Scan size={24} className="text-arya-600" />;
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="text-center max-w-md mx-auto">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 mb-6">Your appointment has been successfully scheduled.</p>

        {/* Appointment Details Card */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-arya-100 rounded-xl flex items-center justify-center">
              {getServiceIcon()}
            </div>
            <div>
              <p className="font-bold text-slate-800">{selectedDoctor?.name || selectedService?.name}</p>
              <p className="text-sm text-slate-500">{selectedDoctor?.specialty || selectedService?.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Date</p>
              <p className="font-semibold text-slate-700">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Time</p>
              <p className="font-semibold text-slate-700">{selectedSlot?.time}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Patient</p>
              <p className="font-semibold text-slate-700">{selectedFamilyMember?.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Confirmation #</p>
              <p className="font-semibold text-slate-700">{confirmationNumber}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
            <Calendar size={18} />
            Add to Calendar
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors">
            <Bell size={18} />
            Set Reminder
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-arya-600 text-white rounded-xl font-semibold hover:bg-arya-700 transition-colors shadow-lg shadow-arya-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
