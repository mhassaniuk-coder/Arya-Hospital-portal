import React from 'react';
import { Stethoscope, Home, TestTube, Scan, CheckCircle, Users, Baby } from 'lucide-react';
import { ServiceType } from './types';
import { FamilyMember } from '../../types';

interface ServiceTypeSelectionProps {
  selectedServiceType: ServiceType;
  selectedFamilyMemberId: string;
  familyMembers: FamilyMember[];
  onSelectServiceType: (type: ServiceType) => void;
  onSelectBookingMode: (mode: 'manual' | 'home-care' | 'lab' | 'imaging') => void;
  onSelectFamilyMember: (id: string) => void;
}

export const ServiceTypeSelection: React.FC<ServiceTypeSelectionProps> = ({
  selectedServiceType,
  selectedFamilyMemberId,
  familyMembers,
  onSelectServiceType,
  onSelectBookingMode,
  onSelectFamilyMember,
}) => {
  const handleServiceSelect = (type: ServiceType) => {
    onSelectServiceType(type);
    if (type === 'consultation') {
      onSelectBookingMode('manual');
    } else {
      onSelectBookingMode(type as 'home-care' | 'lab' | 'imaging');
    }
  };

  const serviceTypes: { type: ServiceType; icon: React.ReactNode; title: string; description: string; price: string; badge: string; badgeColor: string }[] = [
    {
      type: 'consultation',
      icon: <Stethoscope size={28} />,
      title: 'Consultation',
      description: 'Video or in-person visit with a doctor',
      price: 'From $50',
      badge: 'Video Available',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      type: 'home-care',
      icon: <Home size={28} />,
      title: 'Home Care',
      description: 'Professional healthcare at your doorstep',
      price: 'From $40',
      badge: 'At Home',
      badgeColor: 'bg-purple-100 text-purple-700'
    },
    {
      type: 'lab',
      icon: <TestTube size={28} />,
      title: 'Lab Tests',
      description: 'Blood work, diagnostics, and screenings',
      price: 'From $25',
      badge: 'Fast Results',
      badgeColor: 'bg-orange-100 text-orange-700'
    },
    {
      type: 'imaging',
      icon: <Scan size={28} />,
      title: 'Imaging',
      description: 'X-rays, MRI, CT scans, and ultrasounds',
      price: 'From $50',
      badge: 'Advanced',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      {/* Family Member Selection */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          <Users size={16} className="inline mr-2" />
          Booking for
        </label>
        <div className="flex flex-wrap gap-2">
          {familyMembers.map(member => (
            <button
              key={member.id}
              onClick={() => onSelectFamilyMember(member.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${selectedFamilyMemberId === member.id
                ? 'border-arya-500 bg-arya-50 text-arya-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
            >
              <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
              <span className="font-medium text-sm">{member.name}</span>
              <span className="text-xs text-slate-400">({member.relation})</span>
              {/* member.isChild is not on FamilyMember type, infer from age or relation */}
              {member.age < 18 && <Baby size={12} className="text-pink-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type Cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Select Service Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceTypes.map(({ type, icon, title, description, price, badge, badgeColor }) => (
            <button
              key={type}
              onClick={() => handleServiceSelect(type)}
              className={`group relative p-6 rounded-2xl border-2 transition-all text-left ${selectedServiceType === type
                ? 'border-arya-500 bg-arya-50 shadow-lg shadow-arya-100'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${selectedServiceType === type
                ? 'bg-arya-500 text-white'
                : 'bg-slate-100 text-slate-500'
                }`}>
                {icon}
              </div>
              <h4 className="font-bold text-slate-800 text-lg mb-1">{title}</h4>
              <p className="text-sm text-slate-500">{description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">{price}</span>
                <span className={`text-xs ${badgeColor} px-2 py-1 rounded-full font-medium`}>{badge}</span>
              </div>
              {selectedServiceType === type && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
