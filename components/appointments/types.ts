import { SmartSlot } from '../../types';

// Booking mode types
export type BookingMode = 'service-selection' | 'consultation-method' | 'ai' | 'manual' | 'home-care' | 'lab' | 'imaging';

// Service type for booking
export type ServiceType = 'consultation' | 'home-care' | 'lab' | 'imaging';

// Manual filter state
export interface ManualFilters {
  search: string;
  specialty: string;
  gender: string;
  language: string;
  videoOnly: boolean;
}

// Payment details
export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
}

// Generate smart slots helper
export const GENERATE_SMART_SLOTS = (dateStr: string, type: string = 'in-person'): SmartSlot[] => [
  { id: 's1', time: '09:00 AM', date: dateStr, dateIso: '2023-10-24', score: 98, tags: ['Best Match', 'Least Wait'], type: type as any },
  { id: 's2', time: '10:30 AM', date: dateStr, dateIso: '2023-10-24', score: 85, tags: ['Quiet Hour'], type: type as any },
  { id: 's3', time: '02:00 PM', date: dateStr, dateIso: '2023-10-24', score: 92, tags: ['After Lunch'], type: type as any },
  { id: 's4', time: '04:15 PM', date: dateStr, dateIso: '2023-10-24', score: 78, tags: [], type: type as any },
];

// Specialty options for filter dropdown
export const SPECIALTY_OPTIONS = [
  'All',
  'Cardiology',
  'Dermatology',
  'General Practice',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
];
