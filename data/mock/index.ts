// Mock Data Exports
export { MOCK_DOCTORS } from './doctors';
export { MOCK_HOME_CARE, MOCK_LABS, MOCK_IMAGING } from './services';
export { FAMILY_MEMBERS } from './family';
export { MOCK_CLINICAL_NOTES, MOCK_VACCINATIONS, MOCK_IMAGING_REPORTS } from './history';
export { INITIAL_INSURANCE_CARDS } from './insurance';
export type { FamilyMember } from './family';

// User and Appointments mock data
import { User, Appointment, LabResult, Medication, Bill, PharmacyOrder } from '../../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Sarah Jenkins',
  avatarUrl: 'https://picsum.photos/200',
  mrn: 'MRN-882910',
  isVerified: false
};

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    doctorName: 'Dr. Emily Chen',
    specialty: 'Cardiology',
    date: '2023-11-15T10:00:00',
    time: '10:00 AM',
    status: 'upcoming',
    location: 'Building A, Room 302',
    symptoms: 'Chest flutter',
    aiSummary: 'Routine follow-up for arrhythmia. Vitals stable.',
    matchScore: 98,
    travelTime: '25 mins',
    prepInstructions: ['Fast for 12 hours', 'Bring medication list'],
    smartTags: ['High Priority', 'Heart Health'],
    visitType: 'in-person'
  },
  {
    id: 'a2',
    doctorName: 'Dr. James Wilson',
    specialty: 'Dermatology',
    date: '2023-10-20T14:30:00',
    time: '2:30 PM',
    status: 'completed',
    location: 'Building B, Room 105',
    symptoms: 'Rash on arm',
    aiSummary: 'Diagnosed with contact dermatitis. Prescribed cream.',
    matchScore: 92,
    visitType: 'in-person'
  }
];

export const MOCK_LAB_RESULTS: LabResult[] = [
  { id: 'l1', testName: 'Complete Blood Count', date: '2023-10-21', status: 'normal', value: 'Normal', unit: '' },
  { id: 'l2', testName: 'Lipid Panel', date: '2023-10-21', status: 'abnormal', value: '240', unit: 'mg/dL' },
];

export const MOCK_MEDICATIONS: Medication[] = [
  { id: 'm1', name: 'Lipitor', dosage: '20mg', frequency: 'Daily', refillsRemaining: 2, prescribedBy: 'Dr. Chen', status: 'active', nextRefill: '2023-11-01' },
  { id: 'm2', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', refillsRemaining: 0, prescribedBy: 'Dr. Chen', status: 'completed' },
];

export const MOCK_BILLS: Bill[] = [
  { id: 'b1', amount: 45.00, description: 'Lab Work Co-pay', date: '2023-10-21', status: 'unpaid' },
];

export const MOCK_PHARMACY_ORDERS: PharmacyOrder[] = [
  { id: 'o1', medicationId: 'm1', medicationName: 'Lipitor (20mg)', status: 'out_for_delivery', estimatedDelivery: 'Today by 6:00 PM', trackingMessage: 'Your package is arriving today by 6:00 PM.', createdAt: '2023-11-01' },
];
