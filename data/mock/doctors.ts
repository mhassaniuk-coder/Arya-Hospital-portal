import { Doctor } from '../../types';

export const MOCK_DOCTORS: Doctor[] = [
  { 
    id: 1, name: 'Dr. Emily Chen', specialty: 'Cardiology', subSpecialty: 'Interventional',
    rating: 4.9, reviews: 124, image: 'https://picsum.photos/seed/doc1/200',
    languages: ['English', 'Mandarin'], gender: 'Female', experienceYears: 12,
    bio: 'Specializes in preventative cardiology and heart rhythm disorders. Harvard Medical School graduate.',
    nextAvailable: 'Tomorrow', tags: ['Top Rated', 'Harvard Alum']
  },
  { 
    id: 2, name: 'Dr. James Wilson', specialty: 'Dermatology', subSpecialty: 'Cosmetic',
    rating: 4.8, reviews: 89, image: 'https://picsum.photos/seed/doc2/200',
    languages: ['English', 'Spanish'], gender: 'Male', experienceYears: 8,
    bio: 'Expert in treating complex skin conditions and cosmetic procedures.',
    nextAvailable: 'Today', tags: ['Video Visits', 'Fast Response']
  },
  { 
    id: 3, name: 'Dr. Sarah Smith', specialty: 'General Practice', subSpecialty: 'Family Medicine',
    rating: 4.9, reviews: 210, image: 'https://picsum.photos/seed/doc3/200',
    languages: ['English'], gender: 'Female', experienceYears: 15,
    bio: 'Dedicated to comprehensive family care and long-term wellness planning.',
    nextAvailable: 'Wed, Oct 25', tags: ['Patient Choice', 'Pediatric Friendly']
  },
  { 
    id: 4, name: 'Dr. Michael Brown', specialty: 'Neurology', subSpecialty: 'Migraine',
    rating: 4.7, reviews: 56, image: 'https://picsum.photos/seed/doc4/200',
    languages: ['English', 'German'], gender: 'Male', experienceYears: 20,
    bio: 'Leading researcher in migraine management and neuropathic pain.',
    nextAvailable: 'Next Week', tags: ['Research Lead']
  },
  { 
    id: 5, name: 'Dr. Linda Johnson', specialty: 'Pediatrics', subSpecialty: 'General',
    rating: 4.9, reviews: 312, image: 'https://picsum.photos/seed/doc5/200',
    languages: ['English', 'French'], gender: 'Female', experienceYears: 18,
    bio: 'Compassionate care for infants, children, and adolescents.',
    nextAvailable: 'Tomorrow', tags: ['Pediatric Specialist', 'Vaccinations']
  },
  { 
    id: 6, name: 'Dr. Robert Chen', specialty: 'Orthopedics', subSpecialty: 'Sports Medicine',
    rating: 4.6, reviews: 88, image: 'https://picsum.photos/seed/doc6/200',
    languages: ['English'], gender: 'Male', experienceYears: 10,
    bio: 'Focus on sports injuries and arthroscopic surgery.',
    nextAvailable: 'Fri, Oct 27', tags: ['Sports Med']
  },
];
