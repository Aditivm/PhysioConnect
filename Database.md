# Database Schema & Security Rules - PhysioConnect

## 1. Firestore Schema Design

### Collection: `users`
**Path**: `/users/{userId}`
Provides general identity and account parameters for every authenticated individual.

```typescript
interface UserDocument {
  role: "patient" | "physio";
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string | null; // URL to storage bucket
  createdAt: string;           // ISO 8601 UTC timestamp
  lastLogin: string;           // ISO 8601 UTC timestamp
  isActive: boolean;
}
```

### Collection: `physios`
**Path**: `/physios/{userId}`
Maintains verification details, service capacities, availability, and clinical statistics for approved physiotherapists.

```typescript
interface PhysioDocument {
  specialization: string;       // e.g. "Sports Rehab", "Orthopedics", "Neurology"
  experienceYears: number;
  bio: string;
  certificationUrl: string;     // Secure Firebase Storage reference
  licenseNumber: string;        // Encrypted or highly restricted
  aadharCardNumber: string;     // Encrypted or highly restricted
  serviceArea: {
    lat: number;                // Geolocation coordinate
    lng: number;                // Geolocation coordinate
    radiusKm: number;           // Search range (e.g., 8 km)
    landmark: string;           // e.g. "Bandra, Khar West"
  };
  services: Array<{
    type: string;               // e.g., "home", "clinic" (extensible)
    price: number;              // In INR (Rs.)
    durationMinutes: number;    // e.g., 60
    enabled: boolean;
  }>;
  status: "pending" | "approved" | "rejected";
  availability: {
    // Weekday recurring mapping
    [dayOfWeek in "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"]: Array<{
      startTime: string;        // e.g. "10:00"
      endTime: string;          // e.g. "18:00"
    }>;
  };
  avgRating: number;            // Standard baseline (defaults to 0.0)
  totalReviews: number;         // Incremented on completed review creation
  offersClinicVisit: boolean;   // Extensible capability flag
}
```

### Collection: `patients`
**Path**: `/patients/{userId}`
Maintains private health coordination parameters for patients.

```typescript
interface PatientDocument {
  defaultAddress: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    lat: number;
    lng: number;
  };
  emergencyContact: {
    fullName: string;
    relationship: string;
    phone: string;
  };
}
```

### Collection: `bookings`
**Path**: `/bookings/{bookingId}`
Tracks therapy appointment Lifecycles.

```typescript
interface BookingDocument {
  patientId: string;            // Reference to users.userId
  patientName: string;          // Denormalized for display speeds
  physioId: string;             // Reference to users.userId
  physioName: string;           // Denormalized for display speeds
  date: string;                 // YYYY-MM-DD
  timeSlot: {
    startTime: string;          // e.g., "17:00"
    endTime: string;            // e.g., "18:00"
  };
  visitType: "home" | string;   // Extensible enum (default "home")
  servicePrice: number;         // Lock-in pricing in INR at transaction point
  address: {
    addressLine: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  status: "pending" | "accepted" | "declined" | "completed";
  notes: string | null;         // Secure treatment or symptom notes (optional)
  reviewLeft: boolean;          // Prevents duplicate review postings
  createdAt: string;            // Timestamp
  updatedAt: string;            // Timestamp
}
```

### Collection: `reviews`
**Path**: `/reviews/{reviewId}`
Captures Patient feedback on verified, completed sessions.

```typescript
interface ReviewDocument {
  bookingId: string;            // Reference to bookings.bookingId
  patientId: string;            // Reference to users.userId
  patientName: string;          // Denormalized
  physioId: string;             // Reference to users.userId
  rating: number;               // Integer 1 - 5
  comment: string;
  createdAt: string;            // ISO 8601
}
```

---

## 2. Index Requirements

### Single-field Indexes
* Automatically maintained by Firestore for individual fields of all collections.

### Composite Indexes
To support complex queries, sort orders, and radius scans, the following composite indexes must be configured in `firestore.indexes.json`:

1. **Approved Physios by Specialization & Experience**:
   * Collection: `physios`
   * Fields: `status` (Ascending), `specialization` (Ascending), `experienceYears` (Descending)
2. **Active Bookings list for specific User (Patient or Physio) sorted by date**:
   * Collection: `bookings`
   * Fields: `patientId` (Ascending), `date` (Descending)
   * Fields: `physioId` (Ascending), `date` (Descending)
3. **Pending Bookings filter by Date**:
   * Collection: `bookings`
   * Fields: `physioId` (Ascending), `status` (Ascending), `date` (Ascending)

---

## 3. Firestore Security Rules
Below is the strict production security rules declaration (`firestore.rules`) mapped directly against our Domain-Driven boundaries.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function hasRole(role) {
      return isAuthenticated() && getUserData().role == role;
    }

    // Collection: Users
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId) && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role']));
    }

    // Collection: Physios
    match /physios/{userId} {
      allow read: if isAuthenticated(); // Patients can read for search; admins can inspect
      allow create: if isAuthenticated() && isOwner(userId) && hasRole('physio');
      allow update: if isAuthenticated() && isOwner(userId) && hasRole('physio') && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['status', 'avgRating', 'totalReviews']));
      allow write: if false; // Status changes, ratings and total reviews must be written via transaction or cloud functions (Privilege escalation guard)
    }

    // Collection: Patients
    match /patients/{userId} {
      allow read, write: if isAuthenticated() && isOwner(userId);
    }

    // Collection: Bookings
    match /bookings/{bookingId} {
      allow read: if isAuthenticated() && (
        resource.data.patientId == request.auth.uid || 
        resource.data.physioId == request.auth.uid
      );
      
      // Creating a booking is allowed for certified patients
      allow create: if isAuthenticated() && 
        hasRole('patient') && 
        request.resource.data.patientId == request.auth.uid &&
        request.resource.data.status == 'pending';

      // Updates allowed on mutual status modifications
      allow update: if isAuthenticated() && (
        // Patient cancelling
        (resource.data.patientId == request.auth.uid && request.resource.data.status == 'declined') ||
        // Physio accepting/declining or marking complete
        (resource.data.physioId == request.auth.uid && (
          request.resource.data.status == 'accepted' || 
          request.resource.data.status == 'declined' || 
          request.resource.data.status == 'completed'
        ))
      );
    }

    // Collection: Reviews
    match /reviews/{reviewId} {
      allow read: if isAuthenticated();
      
      // Patients can only write reviews for completed bookings that they own
      allow create: if isAuthenticated() && 
        hasRole('patient') &&
        request.resource.data.patientId == request.auth.uid &&
        get(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)).data.status == 'completed' &&
        get(/databases/$(database)/documents/bookings/$(request.resource.data.bookingId)).data.patientId == request.auth.uid;
        
      allow update, delete: if false; // Reviews are immutable post-creation
    }
  }
}
```
