# API Contract & Operations - PhysioConnect

Since PhysioConnect is designed as a serverless Firebase application, client-side interactions run through robust service interfaces that interact securely with Firebase Auth, Firestore, and external APIs (like Google Maps Platform).

Below are the strongly-typed interfaces and method contracts for our services.

---

## 1. Authentication Service (`AuthService`)

Handles identity provision, role registration, and profile caching.

```typescript
export interface SignupData {
  email: string;
  fullName: string;
  phone: string;
  role: "patient" | "physio";
}

export interface PhysioVerificationData {
  specialization: string;
  experienceYears: number;
  bio: string;
  certificationUrl: string;
  licenseNumber: string;
  aadharCardNumber: string;
  serviceArea: {
    lat: number;
    lng: number;
    radiusKm: number;
    landmark: string;
  };
}

export interface AuthService {
  /**
   * Registers a new user with email & password, and boots their base user document.
   */
  registerUser(data: SignupData, password: string): Promise<{ uid: string }>;

  /**
   * Submits extra verification data for registered physiotherapists.
   */
  submitPhysioVerification(uid: string, data: PhysioVerificationData): Promise<void>;

  /**
   * Logs in a user.
   */
  loginUser(email: string, password: string): Promise<{ uid: string }>;

  /**
   * Logs out the current user session.
   */
  logout(): Promise<void>;
}
```

---

## 2. Geocoding & Search Service (`GeocodingService`)

Resolves addresses to spatial coordinates and filters physiotherapists by radius.

```typescript
export interface LocationCoordinate {
  lat: number;
  lng: number;
  landmark: string;
}

export interface SearchFilters {
  specialization?: string;
  minExperience?: number;
}

export interface GeocodingService {
  /**
   * Calls Google Maps Geocoding API or Places API to obtain lat/lng from a search string.
   */
  geocodeAddress(addressQuery: string): Promise<LocationCoordinate>;

  /**
   * Performs straight-line Haversine math to find approved, matching therapists within range.
   * Filters out any physiotherapists that are NOT 'approved'.
   */
  searchPhysiosInRadius(
    patientCoords: LocationCoordinate,
    filters: SearchFilters
  ): Promise<Array<any>>; // Returns approved physios with computed distance
}
```

---

## 3. Booking & Transaction Service (`BookingService`)

Guarantees data integrity, status transition constraints, and prevents overlapping double-bookings.

```typescript
export interface CreateBookingRequest {
  physioId: string;
  physioName: string;
  date: string; // YYYY-MM-DD
  timeSlot: {
    startTime: string; // "HH:MM"
    endTime: string;   // "HH:MM"
  };
  visitType: "home" | "clinic";
  servicePrice: number;
  address: {
    addressLine: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  notes?: string;
}

export interface BookingService {
  /**
   * Creates a booking. Uses a Firestore Transaction to:
   * 1. Read existing bookings for `physioId` on target `date` and `timeSlot`.
   * 2. Verify no overlapping 'pending' or 'accepted' booking exists.
   * 3. Confirm target slot is in the future.
   * 4. Commit new booking document in state 'pending'.
   */
  createBooking(request: CreateBookingRequest): Promise<string>;

  /**
   * Fetches active bookings for a specific user (Patient or Physio) sorted by date.
   */
  getBookings(userId: string, role: "patient" | "physio"): Promise<Array<any>>;

  /**
   * Updates booking state. Enforces state transitions (pending -> accepted/declined, accepted -> completed).
   */
  updateBookingStatus(
    bookingId: string,
    newStatus: "accepted" | "declined" | "completed"
  ): Promise<void>;
}
```

---

## 4. Review & Aggregation Service (`ReviewService`)

Manages client feedback constraints post-session.

```typescript
export interface CreateReviewRequest {
  bookingId: string;
  physioId: string;
  rating: number; // 1 to 5
  comment: string;
}

export interface ReviewService {
  /**
   * Submits a review. Uses a Firestore Transaction to:
   * 1. Check that booking is in 'completed' state.
   * 2. Check that patient matches booking patientId.
   * 3. Confirm `reviewLeft` flag on the booking is false.
   * 4. Commit review document.
   * 5. Set `reviewLeft` flag to true on the booking document.
   */
  submitReview(request: CreateReviewRequest): Promise<string>;

  /**
   * Retrieves all reviews for a specific physiotherapist.
   */
  getPhysioReviews(physioId: string): Promise<Array<any>>;
}
```
