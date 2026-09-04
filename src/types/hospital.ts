export interface Department {
  id: string;
  name: string;
  iconName: string;
  tagline: string;
  description: string;
  headOfDepartment: string;
  location: string;
  keySpecialties: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  qualifications: string;
  experienceYears: number;
  photoUrl: string;
  bio: string;
  availability: string;
  consultationFee: string;
  rating: number;
  reviewCount: number;
  specializations: string[];
  education: string[];
}

export interface Service {
  id: string;
  title: string;
  iconName: string;
  category: 'Emergency' | 'Inpatient' | 'Diagnostics' | 'Specialty' | 'Support';
  description: string;
  badge?: string;
  features: string[];
  availability: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age?: number;
  treatment: string;
  department: string;
  avatarUrl: string;
  rating: number;
  date: string;
  quote: string;
  verified: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Facilities' | 'Technology' | 'Surgery' | 'Patient Rooms' | 'Diagnostics';
  imageUrl: string;
  caption: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl: string;
  excerpt: string;
  content: string[];
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface AppointmentRecord {
  id: string;
  patientName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  preferredDate: string;
  preferredTime: string;
  symptoms: string;
  status: 'Confirmed' | 'Pending Review' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface AppointmentFormData {
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  doctorId: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
}
