# Implementation Milestones & Roadmap - PhysioConnect

This document details the progressive, independently testable, and compile-safe implementation milestones for PhysioConnect. Each milestone corresponds to approximately one developer-day of effort and builds sequentially toward the production-grade application shell.

---

## Dependency Graph

```
[Milestone 1: Project Setup & Design System]
                     │
                     ▼
[Milestone 2: Authentication & Role Assignment]
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
[Milestone 3: Physio         [Milestone 4: Patient
 Verification Flow]           Search & Discovery]
         │                       │
         └───────────┬───────────┘
                     ▼
[Milestone 5: Booking Scheduling & Transactions]
                     │
                     ▼
[Milestone 6: Physio Request Board & Lifecycles]
                     │
                     ▼
[Milestone 7: Post-Visit Reviews & Ratings Sync]
```

---

## Milestone 1: Project Setup, Design System, & Core Shell Layout

### 1. Objective
Establish the primary technical baseline. Set up Tailwind CSS theme configurations, import typography pairings, initialize the base React Router routes (placeholders), and implement the global responsive Layout Shell (Header, Navigation sidebar/drawers).

### 2. Files Involved
* `package.json` (Verify dependencies: `lucide-react`, `motion`)
* `src/index.css` (Import typography, configure custom design system theme variables)
* `src/components/ui/` (Establish foundational design components: Button, Card, Badge, Drawer)
* `src/components/layout/` (Build `MainShell.tsx`, `Header.tsx`, `ResponsiveSidebar.tsx`)
* `src/App.tsx` (Establish base client-side router matching layout views)

### 3. Database Changes
* None.

### 4. UI Changes
* Interactive global header with placeholder navigation options.
* Collapsible, slide-out mobile drawer matching touch parameters.
* Fully styled display card showing a showcase of our typography pairing ("Space Grotesk" + "Inter" + "JetBrains Mono").

### 5. Testing Checklist
* [ ] Verify layout responsiveness on views from 320px up to 1440px.
* [ ] Confirm typography imports resolve correctly via Chrome inspector.
* [ ] Verify sidebar navigation buttons focus correctly using keyboard `Tab`.

### 6. Risks
* CSS import clashes or unresolved font links.
* *Mitigation*: Use verified Google Font CDN linkages in `index.html` or direct imports in `index.css`.

### 7. Dependencies
* None (Foundational Milestone).

### 8. Rollback Strategy
* Revert git HEAD to pre-setup baseline template.

### 9. Definition of Done
* The application builds successfully (`npm run build`) without a single TypeScript or linter warning.
* The visual shell is completely fluid and responsive, providing instant interactive focus cues.

### 10. Testing Scenarios
* **Scenario 1.1**: Resize browser viewport to 360px width. Confirm the top-bar navigation collapses, and a functional hamburger button triggers the mobile navigation drawer securely.
* **Scenario 1.2**: Open page in browser, hit `Tab` repeatedly. Focus should shift logically between header elements, with a distinct outline visual.

---

## Milestone 2: Authentication Base (Login & Sign-Up with Role Assignment)

### 1. Objective
Integrate Firebase Authentication. Create signup and login flows that write standard user metadata documents to the `/users/{userId}` collection, establishing the user's role (`patient` or `physio`) immediately post-creation.

### 2. Files Involved
* `src/lib/firebase/` (Firebase configuration & initialization client)
* `src/features/auth/hooks/useAuth.ts` (React Context & auth listener wrapper)
* `src/features/auth/pages/LoginPage.tsx` (Manual login screen)
* `src/features/auth/pages/SignupPage.tsx` (Manual signup screen with role toggle)
* `src/App.tsx` (Mount `<AuthProvider>` and add client auth middleware guards)

### 3. Database Changes
* Collection created: `users/{userId}`
  ```json
  {
    "role": "patient" | "physio",
    "fullName": "Name",
    "email": "email@test.com",
    "phone": "9876543210",
    "profilePhoto": null,
    "createdAt": "ISO_TIMESTAMP",
    "lastLogin": "ISO_TIMESTAMP",
    "isActive": true
  }
  ```

### 4. UI Changes
* Polished signup screen offering a prominent segment toggle: **"Register as Patient"** vs. **"Register as Physiotherapist"**.
* Dynamic redirect behavior (Patients land on search placeholder; Physios land on pending-verification screen).

### 5. Testing Checklist
* [ ] Test user registration with password rules (minimum 6 chars).
* [ ] Verify that registering as a "Physio" successfully saves `"role": "physio"` in Firestore.
* [ ] Confirm that protected routes block unauthenticated direct address inputs.

### 6. Risks
* Latency in Firebase Auth listener causing rapid flashing redirects.
* *Mitigation*: Maintain an `isLoading` boolean state in AuthContext, rendering a skeleton shimmer while authentication is initializing.

### 7. Dependencies
* Milestone 1 (Design System & Shell).

### 8. Rollback Strategy
* Disable route guards, fall back to pure mock credentials.

### 9. Definition of Done
* Registration of a user correctly allocates their role in Firestore.
* Logging out completely destroys the local session and cleans the cache.

### 10. Testing Scenarios
* **Scenario 2.1**: Attempt to navigate to `/patient/search` when logged out. Confirm the system automatically intercepts and redirects you to `/login`.
* **Scenario 2.2**: Sign up with a new email address selecting "Physiotherapist". Query the Firestore console to verify the generated document under `/users/{uid}` contains `"role": "physio"`.

---

## Milestone 3: Physiotherapist Verification & Onboarding Flow

### 1. Objective
Allow newly registered physiotherapists to complete their profile setup, inputting their national ID details, license registration numbers, and setting up their available areas and starting specialties.

### 2. Files Involved
* `src/features/physios/pages/VerificationOnboarding.tsx` (Form wizard for therapists)
* `src/features/physios/schemas/verificationSchema.ts` (Zod verification rules)
* `src/features/physios/services/physioService.ts` (Handles writing profiles and isolated credentials documents)

### 3. Database Changes
* Collection created: `physios/{userId}` (Status defaults to `"pending"`)
* Collection created: `physio_credentials/{userId}` (PII/Sensitive verification docs)

### 4. UI Changes
* Form wizard with smooth progression transitions (Personal details -> Clinical qualifications -> Travel Radius & Geography).
* A clear, reassuring "Application Under Review" dashboard overlay once submitted.

### 5. Testing Checklist
* [ ] Confirm form errors trigger dynamically when fields are left blank.
* [ ] Verify sensitive details (Aadhar, License) write to `physio_credentials` rather than `physios`.
* [ ] Confirm the profile status is committed as `"pending"`.

### 6. Risks
* Sensitive document formats causing UI crash on input.
* *Mitigation*: Strictly validate input lengths and characters using precise Zod patterns prior to write attempts.

### 7. Dependencies
* Milestone 2 (Authentication).

### 8. Rollback Strategy
* Revert the schema partition, storing inputs as simple flat text inside `users`.

### 9. Definition of Done
* Submitting the verification form moves the user to the pending waiting screen.
* The credentials collection is isolated behind security rules.

### 10. Testing Scenarios
* **Scenario 3.1**: Log in as a newly created therapist. Verify you are automatically redirected to the onboarding wizard.
* **Scenario 3.2**: Attempt to submit the form without entering a valid License Number. Confirm that an inline validation error highlights the field and prevents database writes.

---

## Milestone 4: Patient Dashboard & Geolocation-Based Search (Haversine Filter)

### 1. Objective
Implement patient-side search. Patients search for therapists by entering locations (via Google Autocomplete) and filter results dynamically using straight-line Haversine math against therapists' coverage boundaries.

### 2. Files Involved
* `src/features/patients/pages/SearchPhysios.tsx` (Search interface page)
* `src/lib/maps/geocoding.ts` (Google Maps API wrapper)
* `src/utils/haversine.ts` (Pure math utility calculating straight-line distance)
* `src/features/patients/components/PhysioResultCard.tsx` (Profile overview card)

### 3. Database Changes
* None (Reads from `physios` collection).

### 4. UI Changes
* Elegant search bar with auto-suggestions.
* Search results displaying therapists, experience years, specializations, computed distance (e.g., `"2.4 km away"`), and pricing.

### 5. Testing Checklist
* [ ] Confirm only physiotherapists with status `"approved"` appear in search results.
* [ ] Verify distance calculation correctly excludes therapists whose `radiusKm` is smaller than their distance to the search point.
* [ ] Confirm skeleton loaders display while coordinates are geocoding.

### 6. Risks
* Google Maps API quota limit or load failures.
* *Mitigation*: Implement graceful fallbacks to manual input selections or standard landmarks if the maps API is unreachable.

### 7. Dependencies
* Milestone 1, Milestone 3 (Need approved therapists to search).

### 8. Rollback Strategy
* Use a local mock database of coordinate pairs for physical therapies in India.

### 9. Definition of Done
* Searching a location returns all approved therapists servicing that radius.
* Results update dynamically when specializations or distance parameters change.

### 10. Testing Scenarios
* **Scenario 4.1**: Create two approved therapists: Therapist A (Coordinates in Bandra, 5km service radius) and Therapist B (Coordinates in Colaba, 5km service radius). Search for "Bandra, Mumbai". Confirm Therapist A appears, and Therapist B is correctly filtered out.

---

## Milestone 5: Booking Scheduling & Atomic Allocation (Firestore Transaction)

### 1. Objective
Implement the booking scheduling interface and enforce double-booking prevention. Patients select dates and hours from a therapist's weekly schedule and submit reservations using secure client transactions.

### 2. Files Involved
* `src/features/bookings/pages/BookAppointment.tsx` (Calendar slot selection page)
* `src/features/bookings/services/bookingService.ts` (Atomic transactional booking creation)
* `src/features/bookings/schemas/bookingSchema.ts` (Validation of slot times)

### 3. Database Changes
* Collection created: `bookings/{bookingId}` (Status starts as `"pending"`)

### 4. UI Changes
* Interactive calendar showing recurring weekday slots.
* Dynamic card summary detailing the selected visit type (Home Visit), time, date, price, and address details.

### 5. Testing Checklist
* [ ] Verify that attempting to book a slot in the past triggers a clear error alert.
* [ ] Confirm that if two clients attempt to book the same slot simultaneously, the transaction fails gracefully for one and alerts them to choose another time.

### 6. Risks
* Timezone disparities between server timestamps and local Indian Standard Time (IST).
* *Mitigation*: Enforce ISO 8601 timestamps containing explicit local offset values (`+05:30`).

### 7. Dependencies
* Milestone 4 (Needs profile selection to book).

### 8. Rollback Strategy
* Convert the atomic transaction to a simple database write and handle validation checks in the UI (less robust but simpler).

### 9. Definition of Done
* Bookings are committed to Firestore with a default state of `"pending"`.
* Double bookings on identical dates and time slot blocks are structurally impossible.

### 10. Testing Scenarios
* **Scenario 5.1**: Attempt to book an appointment for yesterday. Confirm the booking is blocked UI-side with an error message.
* **Scenario 5.2**: Simulate concurrent booking requests on the same slot. Verify that only one request successfully writes, and the other returns an informative "Slot no longer available" notification.

---

## Milestone 6: Physiotherapist Request Board & Lifecycle Management

### 1. Objective
Build the therapist-side booking request board. Allow therapists to view incoming requests, accept/decline them, and mark active appointments as `"completed"` once treatment is finished.

### 2. Files Involved
* `src/features/physios/pages/Dashboard.tsx` (Booking requests inbox board)
* `src/features/bookings/components/BookingStatusCard.tsx` (Visual request manager)
* `src/features/bookings/services/bookingService.ts` (Update status methods)

### 3. Database Changes
* State updates inside `bookings/{bookingId}` (Transitions: `pending` -> `accepted`/`declined` -> `completed`).

### 4. UI Changes
* Split-view request board for the therapist (New Requests, Active Schedules, Completed History).
* High-contrast quick-action buttons: **"Accept"**, **"Decline"**, and **"Mark Completed"**.

### 5. Testing Checklist
* [ ] Confirm that a declined booking updates immediately to `"declined"` on both patient and therapist screens.
* [ ] Verify that "Mark Completed" can only be clicked if the booking status is `"accepted"`.

### 6. Risks
* Unsynchronized state changes causing confused users.
* *Mitigation*: Use real-time Firestore document snapshot listeners (`onSnapshot`) to update UI states across devices instantly.

### 7. Dependencies
* Milestone 5 (Needs bookings to manage).

### 8. Rollback Strategy
* Simple pull-to-refresh mechanism instead of real-time listeners.

### 9. Definition of Done
* Therapists can manage the entire booking lifecycle from their dashboard.
* Patient dashboards reflect real-time booking status updates.

### 10. Testing Scenarios
* **Scenario 6.1**: As a therapist, click "Accept" on a pending booking. Confirm the state instantly updates to `"accepted"` on the patient's dashboard without requiring a page refresh.

---

## Milestone 7: Post-Visit Reviews & Ratings Aggregate Updates

### 1. Objective
Implement the review system. Allow patients to submit feedback on completed bookings, and calculate aggregate averages on the therapist's profile.

### 2. Files Involved
* `src/features/reviews/components/SubmitReviewDialog.tsx` (Review prompt dialog)
* `src/features/reviews/services/reviewService.ts` (Write review & update averages)
* `src/features/reviews/schemas/reviewSchema.ts` (Validate 1-5 rating range)

### 3. Database Changes
* Collection created: `reviews/{reviewId}`
* Fields updated inside `physios/{userId}`: `avgRating`, `totalReviews`
* Field updated inside `bookings/{bookingId}`: `reviewLeft: true`

### 4. UI Changes
* Stars selector input (1 to 5 stars) with a clean feedback text box.
* The "Write Review" button appears on the patient's booking list *only* when booking status is `"completed"` and `reviewLeft` is false.

### 5. Testing Checklist
* [ ] Confirm reviews cannot be edited or deleted once submitted.
* [ ] Verify that creating a review triggers an atomic transaction updating the therapist's profile average rating.

### 6. Risks
* Multiple reviews submitted for a single appointment.
* *Mitigation*: Enforce security rules blocking writes to `/reviews` if `reviewLeft` is already marked true on the parent booking document.

### 7. Dependencies
* Milestone 6 (Needs completed bookings to review).

### 8. Rollback Strategy
* Calculate the average rating dynamically on-the-fly inside the client component (higher read cost, but avoids transactional aggregation).

### 9. Definition of Done
* Patients can successfully leave reviews after completed sessions.
* The therapist's profile average rating updates atomically and displays immediately.

### 10. Testing Scenarios
* **Scenario 7.1**: Log in as a patient, locate a completed appointment, and click "Write Review". Leave a 5-star rating. Verify that the booking's `reviewLeft` field updates to `true` and the review dialog can no longer be accessed for that session.
