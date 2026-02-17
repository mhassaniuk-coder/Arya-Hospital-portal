
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  mrn: string; // Medical Record Number
  isVerified: boolean;
}

export interface Appointment {
  id: string;
  doctorName: string; // Or Provider/Lab Name
  specialty: string; // Or Test/Service Name
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  symptoms?: string;
  aiSummary?: string;
  matchScore?: number; // 0-100
  travelTime?: string;
  prepInstructions?: string[];
  smartTags?: string[];
  visitType?: 'in-person' | 'video' | 'home-visit';
  patientName?: string;
  patientId?: string;
  category?: 'consultation' | 'home-care' | 'lab' | 'imaging';
}

export interface LabResult {
  id: string;
  testName: string;
  date: string;
  status: 'normal' | 'abnormal' | 'pending';
  value: string;
  unit: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  refillsRemaining: number;
  prescribedBy: string;
  datePrescribed?: string;
  status: 'active' | 'completed';
  nextRefill?: string;
  instructions?: string;
}

export interface PharmacyOrder {
  id: string;
  medicationId: string;
  medicationName: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  estimatedDelivery?: string;
  trackingMessage?: string;
  createdAt: string;
}

export interface Bill {
  id: string;
  amount: number;
  description: string;
  date: string;
  status: 'paid' | 'unpaid' | 'overdue';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export type ViewState =
  | 'dashboard'
  | 'appointments'
  | 'records'
  | 'chat'
  | 'history'
  | 'notifications'
  | 'settings'
  | 'pharmacy'      // New
  | 'wellness'      // New
  | 'insurance'     // New
  | 'family'        // New
  | 'family'        // New
  | 'symptom_checker' // New
  | 'telehealth'    // New
  | 'specialty_care' // New
  | 'financial'     // New
  | 'engagement';   // New

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: ViewState;
}

export interface AIAction {
  type: 'NAVIGATE' | 'READ_DATA' | 'NONE';
  target?: ViewState;
  details?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  subSpecialty?: string;
  rating: number;
  reviews: number;
  image: string;
  languages: string[];
  gender: 'Male' | 'Female';
  experienceYears: number;
  bio: string;
  nextAvailable: string;
  tags: string[];
}

export interface SmartSlot {
  id: string;
  time: string;
  date: string;
  dateIso: string;
  score: number;
  tags: string[];
  type: 'in-person' | 'video' | 'home-visit';
}

export interface AIAnalysisResult {
  specialty: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Emergency';
  reasoning: string;
  suggestedDoctorType: string;
  prepTips: string[];
  questionsToAsk: string[];
  telehealthScore: number;
  estimatedDuration: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  type: 'lab' | 'imaging' | 'home-care';
  description: string;
  price: number;
  duration: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  avatar: string;
  accessLevel: 'full' | 'read-only' | 'limited';
}

export interface InsuranceClaim {
  id: string;
  date: string;
  provider: string;
  service: string;
  amount: number;
  status: 'approved' | 'pending' | 'denied';
}

export interface InsuranceCard {
  id: string;
  provider: string;
  memberId: string;
  groupNumber: string;
  planName: string;
  copayOffice: number;
  copaySpecialist: number;
  deductible: number;
}

export interface ImagingReport {
  id: string;
  modality: 'X-Ray' | 'MRI' | 'CT' | 'Ultrasound';
  bodyPart: string;
  date: string;
  status: 'Normal' | 'Abnormal' | 'Pending';
  imageUrl: string;
  reportUrl?: string; // PDF link
  radiologist: string;
  findings: string;
}

export interface Vaccination {
  id: string;
  vaccineName: string;
  dateGiven: string;
  dueDate?: string;
  status: 'Completed' | 'Due' | 'Overdue';
  batchNumber?: string;
  provider: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  type: 'Consultation' | 'Discharge Summary' | 'Operative Report';
  doctorName: string;
  specialty: string;
  summary: string;
  fileUrl?: string;
}
