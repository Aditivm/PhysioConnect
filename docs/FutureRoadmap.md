# Product Roadmap & Future Scaling - PhysioConnect

PhysioConnect's technical foundation is architected specifically to support rapid feature additions with zero database migrations or breaking changes. Below is the multi-phase product roadmap outlining the evolution of the application.

---

## Phase 1: MVP Core (Current Baseline)
* **Goal**: Launch an absolute minimum viable marketplace platform.
* **Scope**:
  * Manual authentication.
  * Home visits scheduling.
  * Search via Google Maps Autocomplete + local Haversine calculations.
  * Simple recurring weekly schedules.
  * Status-locked immutable review loops.
  * Verification inputs captured at registration.

---

## Phase 2: Booking Extensibility (Clinic & Telehealth)
* **Goal**: Expand options beyond home visits without altering existing database schemas.
* **Scope**:
  * **Clinic Visits Integration**: Toggle `"offersClinicVisit": true`. Patients booking clinic sessions bypass travel radius checks, showing the fixed clinic location.
  * **Telehealth Consultations**: Launch secure, remote consultations. Ingest a video API integration (e.g., Jitsi, Daily.co, or Twilio Video). The booking card displays a "Join Video Session" button when the slot is active.
  * **Service Abstraction Utility**: Leverage the pre-designed `services` sub-structure on `/physios/{userId}` to handle separate rates for home, clinic, and video consultation.

---

## Phase 3: Transaction & Payments Integration
* **Goal**: Move away from 100% offline transactions to native, digital splits.
* **Scope**:
  * **UPI Deep Links & QR Codes**: Dynamically generate UPI payment intents containing `payeeName`, `upiId` (vpa), `amount`, and a specific booking reference code. Patients scan or launch their local app (GPay, PhonePe, Paytm).
  * **Stripe Connect & Razorpay Integrations**: Secure escrow or immediate splits. At booking acceptance, the patient's card is authorized. Upon physio marking "Completed", funds are routed, minus platform commissions.

---

## Phase 4: Patient Care & Medical Tools
* **Goal**: Provide value-added clinical features for therapists and long-term care for patients.
* **Scope**:
  * **Digital Prescriptions & Treatment Notes**: Secure PDF uploads mapped to bookings, allowing patients to view home-exercise plans.
  * **Interactive Exercise Builder (AI Recommendations)**: Build a secure module leveraging the **Gemini 2.5 Flash** model (referencing our server-side `gemini-api` skill guidelines). The model recommends personalized physical therapies or posture corrections based on symptoms recorded by the therapist during a completed session.
  * **Follow-up Scheduling**: One-click follow-up scheduling from the therapist's terminal to book subsequent weeks automatically.

---

## Phase 5: Administration & Communication Scaling
* **Goal**: Professionalize operations and safety checks.
* **Scope**:
  * **Admin Moderation Portal**: Visual checklist interface for admins to review registered certificates, check license credentials, and approve/reject profiles with a single click.
  * **SMS & Push Alerts**: Automated notifications (using Twilio or Firebase Cloud Messaging) to alert therapists of new booking proposals and notify patients immediately when requests are accepted.
