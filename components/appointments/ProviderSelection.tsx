import React from 'react';
import { Search, Clock, Languages, Star, CheckCircle } from 'lucide-react';
import { Doctor, ServiceItem } from '../../types';
import { BookingMode, ManualFilters, SPECIALTY_OPTIONS } from './types';
import { MOCK_DOCTORS } from '../../data/mock/doctors';
import { MOCK_HOME_CARE, MOCK_LABS, MOCK_IMAGING } from '../../data/mock/services';

interface ProviderSelectionProps {
  bookingMode: BookingMode;
  manualFilters: ManualFilters;
  selectedDoctor: Doctor | null;
  selectedService: ServiceItem | null;
  onUpdateFilters: (filters: ManualFilters) => void;
  onSelectDoctor: (doctor: Doctor | null) => void;
  onSelectService: (service: ServiceItem | null) => void;
  appointmentType?: 'video' | 'in-person';
}

export const ProviderSelection: React.FC<ProviderSelectionProps> = ({
  bookingMode,
  manualFilters,
  selectedDoctor,
  selectedService,
  onUpdateFilters,
  onSelectDoctor,
  onSelectService,
  appointmentType,
}) => {
  // Filter doctors based on criteria
  const getFilteredDoctors = (): Doctor[] => {
    return MOCK_DOCTORS.filter(doc => {
      const matchSearch = doc.name.toLowerCase().includes(manualFilters.search.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(manualFilters.search.toLowerCase());
      const matchSpec = manualFilters.specialty === 'All' || doc.specialty === manualFilters.specialty;
      const matchGender = manualFilters.gender === 'All' || doc.gender === manualFilters.gender;
      const matchLang = manualFilters.language === 'All' || doc.languages.includes(manualFilters.language);
      return matchSearch && matchSpec && matchGender && matchLang;
    });
  };

  // Render doctor card
  const renderDoctorCard = (doctor: Doctor) => (
    <button
      key={doctor.id}
      onClick={() => onSelectDoctor(doctor)}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedDoctor?.id === doctor.id
        ? 'border-arya-500 bg-arya-50 shadow-lg'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        }`}
    >
      <div className="flex gap-4">
        <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-slate-800">{doctor.name}</h4>
              <p className="text-sm text-arya-600 font-medium">{doctor.specialty} • {doctor.subSpecialty}</p>
            </div>
            {selectedDoctor?.id === doctor.id && (
              <div className="w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center">
                <CheckCircle size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold text-slate-700">{doctor.rating}</span>
              <span className="text-slate-400">({doctor.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Clock size={14} />
              <span>{doctor.nextAvailable}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Languages size={14} />
              <span>{doctor.languages.join(', ')}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {doctor.tags.map(tag => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );

  // Render service card
  const renderServiceCard = (service: ServiceItem) => (
    <button
      key={service.id}
      onClick={() => onSelectService(service)}
      className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${selectedService?.id === service.id
        ? 'border-arya-500 bg-arya-50 shadow-lg'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-slate-800">{service.name}</h4>
          <p className="text-sm text-slate-500 mt-1">{service.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm text-slate-500">
              <Clock size={14} className="inline mr-1" />{service.duration}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-arya-600">${service.price}</span>
          {selectedService?.id === service.id && (
            <div className="mt-2 w-6 h-6 bg-arya-500 rounded-full flex items-center justify-center ml-auto">
              <CheckCircle size={14} className="text-white" />
            </div>
          )}
        </div>
      </div>
    </button>
  );

  // Consultation mode - show doctors
  if (bookingMode === 'manual' || bookingMode === 'ai') {
    return (
      <div className="p-6 md:p-8 space-y-6 animate-fade-in">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
              value={manualFilters.search}
              onChange={(e) => onUpdateFilters({ ...manualFilters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none"
            />
          </div>
          <select
            value={manualFilters.specialty}
            onChange={(e) => onUpdateFilters({ ...manualFilters, specialty: e.target.value })}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-arya-200 outline-none text-slate-600"
            title="Filter by specialty"
          >
            {SPECIALTY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt === 'All' ? 'All Specialties' : opt}</option>
            ))}
          </select>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {getFilteredDoctors().length > 0 ? (
            getFilteredDoctors().map(renderDoctorCard)
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Search size={40} className="mx-auto mb-3 text-slate-300" />
              <p>No doctors found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Service modes - show services
  const services = bookingMode === 'home-care' ? MOCK_HOME_CARE :
    bookingMode === 'lab' ? MOCK_LABS :
      MOCK_IMAGING;

  return (
    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="space-y-4">
        {services.map(renderServiceCard)}
      </div>
    </div>
  );
};
