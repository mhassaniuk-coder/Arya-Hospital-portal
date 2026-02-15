import { ServiceItem } from '../../types';

export const MOCK_HOME_CARE: ServiceItem[] = [
  { id: 'hc1', name: 'General Nursing', type: 'home-care', description: 'Vitals check, medication administration, wound dressing.', price: 50, duration: '2 hours' },
  { id: 'hc2', name: 'Physiotherapy', type: 'home-care', description: 'Rehabilitation exercises, pain management, mobility support.', price: 75, duration: '1 hour' },
  { id: 'hc3', name: 'Elderly Care', type: 'home-care', description: 'Companionship, hygiene assistance, meal prep.', price: 40, duration: '4 hours' },
  { id: 'hc4', name: 'Post-Op Care', type: 'home-care', description: 'Specialized surgical recovery support.', price: 90, duration: '4 hours' },
];

export const MOCK_LABS: ServiceItem[] = [
  { id: 'l1', name: 'Full Body Checkup', type: 'lab', description: 'CBC, Lipid, Liver, Kidney, Thyroid profiles.', price: 99, duration: '15 mins' },
  { id: 'l2', name: 'Thyroid Profile', type: 'lab', description: 'T3, T4, TSH levels.', price: 30, duration: '10 mins' },
  { id: 'l3', name: 'Vitamin Deficiency', type: 'lab', description: 'Vitamin D, B12, Calcium levels.', price: 45, duration: '10 mins' },
  { id: 'l4', name: 'Diabetes Screen', type: 'lab', description: 'HbA1c, Fasting Blood Sugar.', price: 25, duration: '5 mins' },
];

export const MOCK_IMAGING: ServiceItem[] = [
  { id: 'i1', name: 'MRI Brain', type: 'imaging', description: 'Detailed imaging of brain structures.', price: 400, duration: '45 mins' },
  { id: 'i2', name: 'Chest X-Ray', type: 'imaging', description: 'Lung and heart imaging.', price: 50, duration: '15 mins' },
  { id: 'i3', name: 'Ultrasound Abdomen', type: 'imaging', description: 'Imaging of abdominal organs.', price: 120, duration: '30 mins' },
  { id: 'i4', name: 'CT Scan', type: 'imaging', description: 'Computed tomography for detailed views.', price: 250, duration: '20 mins' },
];
