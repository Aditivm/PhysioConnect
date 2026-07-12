/**
 * Shared Type Definitions for PhysioConnect
 */

export type UserRole = 'patient' | 'physio';

export interface BaseUser {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  profilePhoto: string | null;
  createdAt: string;
  isActive: boolean;
}

export interface ServiceArea {
  lat: number;
  lng: number;
  radiusKm: number;
  landmark: string;
}

export interface PhysioService {
  type: string;          // e.g., "home", "clinic"
  price: number;         // In INR
  durationMinutes: number;
  enabled: boolean;
}

export interface PhysioProfile {
  uid: string;
  specialization: string;
  experienceYears: number;
  bio: string;
  licenseNumber: string;
  aadharCardNumber: string;
  certificationFileName: string | null;
  serviceArea: ServiceArea;
  services: PhysioService[];
  status: 'pending' | 'approved' | 'rejected';
  avgRating: number;
  totalReviews: number;
}

export interface PatientAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
}

export interface PatientProfile {
  uid: string;
  defaultAddress: PatientAddress;
  emergencyContact: {
    fullName: string;
    relationship: string;
    phone: string;
  };
}

export interface BookingTimeSlot {
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

export interface Booking {
  id: string;
  patientId: string;
  patientName: string;
  physioId: string;
  physioName: string;
  date: string; // YYYY-MM-DD
  timeSlot: BookingTimeSlot;
  visitType: 'home' | 'clinic';
  servicePrice: number; // Locked at creation
  address: {
    addressLine: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  notes: string | null;
  reviewLeft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  physioId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
