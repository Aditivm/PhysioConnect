# Product Requirements Document (PRD) - PhysioConnect

## 1. Executive Summary
PhysioConnect is a highly polished, premium, production-grade on-demand marketplace platform designed specifically for the Indian market (focused on Indian Standard Time and local geographic regions). The platform connects qualified, verified physiotherapists with patients seeking home-based physical therapy.

While starting as a highly targeted web application for Home Visits (MVP), the system architecture and database schema are built with absolute extensibility to support future modules such as clinic visits, online video consultations, automated insurance claims, subscription plans, and AI-driven exercise recommendations.

---

## 2. Product Objectives & Target Audience
### Objectives
* **Connect with Trust**: Bridge the gap between certified, qualified physiotherapists and patients seeking safe, professional care at home.
* **Streamline Operations**: Replace chaotic messaging-based coordination with automated schedules, easy location validation, and clean status tracking.
* **Premium Indian Localization**: Build a premium, trustworthy product for urban Indian regions, incorporating familiar touchpoints (e.g., UPI/Cash transactions, Aadhar verification, landmarks, etc.).

### Target Audience
1. **Patients**:
   * Individuals recovering from post-operative procedures, orthopedic issues, sports injuries, or geriatric patients needing mobility assistance.
   * Tech-savvy urban family members booking sessions for elderly parents.
2. **Physiotherapists**:
   * Certified practitioners looking to supplement clinic hours or run independent home-visit practices.
   * Clinicians seeking high-yield local bookings within an accessible travel radius.

---

## 3. Scope & Feature Definition (MVP)

### User Roles
* **Patient**: Can search, book, view session history, and leave single-use reviews.
* **Physiotherapist (Physio)**: Can complete professional profiles, set geographic availability, manage booking requests, and mark sessions as complete.
* **Admin (Planned)**: Responsible for vetting, approving, or rejecting therapist credentials.

### Detailed Core Features

#### A. Authentication & Onboarding
* **Manual Email & Password Authentication** using Firebase Auth.
* **Role Selection**: Occurs explicitly during the registration workflow. A user is designated either as a `patient` or a `physio`.
* **Physio Verification Inputs**:
  * **License Number**: Professional licensing registration number.
  * **Physio Certificate**: Proof of degree/qualification.
  * **Aadhar Card Number**: For national identity and fraud prevention.
* **Approval Status**:
  * Physiotherapist accounts start in a `pending` state and must be marked `approved` by an administrative action before appearing in public searches.

#### B. Search & Discovery (Indian Geology)
* **Search Input**: Powered by Google Places Autocomplete and Geocoding to retrieve precise coordinates (`lat` / `lng`).
* **Radius-Based Matching**: Matches physiotherapists whose defined `serviceArea.radiusKm` encompasses the patient's searched location.
* **Filter Criteria**:
  * Specialization (e.g., Orthopedic, Neurological, Pediatric, Sports Rehab, Geriatric).
  * Experience (Years in practice).
  * Ratings (Filtered when reviews are enabled).

#### C. Availability & Booking Lifecycle
* **Weekly Recurring Schedule**: Physiotherapists set hourly availability blocks per weekday (Monday - Sunday).
* **Booking Steps**:
  1. Patient browses available slots on the therapist's profile.
  2. Patient submits a booking request specifying the chosen date, time slot, and home address.
  3. Booking begins in a `pending` state.
* **Transitions**:
  * **Accepted**: The physiotherapist reviews and accepts the booking.
  * **Declined**: The physiotherapist declines the booking request.
  * **Completed**: The physiotherapist marks the session completed *after* conducting the visit and receiving physical/UPI payment post-visit.

#### D. Reviews & Ratings
* **Locked Review Mechanism**: Reviews are unlocked *only* when a booking state changes to `completed`.
* **Single-use Guarantee**: A patient can write exactly one review per completed booking.
* **Immutable Feedback**: Reviews are write-once; patients cannot edit or delete their feedback to maintain clinical integrity and trust.

---

## 4. Non-Functional Requirements (NFR)

* **Performance**: Under-2-second search times for finding nearby physiotherapists.
* **Security & Privacy**: Strict data separation at the database layer (patients cannot access therapists' private files; therapists cannot read patients' default medical notes/histories without a booking relationship).
* **Usability & UX**:
  * Standard touch targets matching 44x44px for mobile use.
  * Adaptive layout scaling perfectly from 320px (mobile) to 1440px+ (desktop).
  * Informational, non-intrusive loading state skeletons.
* **Reliability**: No double-bookings permitted for any single therapist slot on a specific calendar date.
