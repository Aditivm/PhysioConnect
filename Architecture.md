# System Architecture & Design Decisions - PhysioConnect

## 1. High-Level System Architecture
PhysioConnect utilizes a robust, decoupled, and modular full-stack architecture designed to handle rapid traffic scaling, high security, and domain extensibility.

```
       ┌────────────────────────────────────────────────────────┐
       │                     Client Application                 │
       │                   (React / Tailwind CSS)               │
       └───────────────────────────┬────────────────────────────┘
                                   │
                    HTTP / Auth / Firestore Protocols
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                    Firebase Services                   │
       ├────────────────────────────────────────────────────────┤
       │  [Auth]             [Firestore]          [Storage]     │
       │  Identity           Secure DB            Credential    │
       │  Management         & Collections        PDFs/Images   │
       └───────────────────────────┬────────────────────────────┘
                                   │
                             API / Syncing
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │             External Integrations (Scalability)        │
       ├────────────────────────────────────────────────────────┤
       │  [Algolia/Elastic]  [Google Maps]       [UPI / SMS]    │
       │  Geo-Coordinates    Autocomplete,       Future Payment │
       │  Search Index       Geocoding API       & Alerts       │
       └────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Decisions & Rationales

### Decision 1: Geolocation & Search Scaling
* **Decision**: **Algolia / ElasticSearch Integration (Option B)** for the scaling trajectory.
* **MVP Implementation**: Geocoding of patient inputs is processed via Google Maps Platform Geocoding API to secure `lat` and `lng`. The system fetches verified physiotherapists and calculates straight-line distance locally using the **Haversine formula**. This bypasses Firestore's multi-dimensional range query limitations.
* **Scale Path**: Write-triggers in Firestore will automatically sync physiotherapist profiles, locations, and verification statuses to an Algolia Index. Clients will then perform instant, fuzzy, radial geo-queries directly through Algolia, reducing database read costs and lowering search latency to <50ms.

### Decision 2: Service & Pricing Abstraction
* **Decision**: Implement a flexible Service Abstraction from day one.
* **Design**: Rather than hardcoding fields like `homeVisitPrice` or treating booking types as static strings, the data model supports a nested, array-of-objects structure for service definitions:
  ```json
  "services": [
    { "type": "home", "price": 1200, "durationMinutes": 60, "enabled": true },
    { "type": "clinic", "price": 800, "durationMinutes": 45, "enabled": false }
  ]
  ```
* **Rationale**: Bypasses painful schema migrations when Clinic Visits, Online Consultations, and custom packages launch. The booking system accepts the `serviceType` dynamically, validating availability and pricing dynamically based on this structure.

### Decision 3: Temporal Engineering (Indian Timezone focus)
* **Decision**: Focus specifically on the India geography and Indian Standard Time (IST, UTC+5:30).
* **Implementation**:
  * Weekly schedules and slot choices are modeled explicitly around the Asia/Kolkata timezone standard.
  * All availability profiles map 24-hour schedules (e.g., `"10:00"`, `"18:00"`) directly against local weekdays (`monday` - `sunday`).
  * Date fields are stored as ISO 8601 strings (e.g., `"2026-07-12T17:00:00+05:30"`) to prevent offsets when displaying booking info.

### Decision 4: Concurrency & Double-Booking Prevention
* **Decision**: Enforce transactional integrity.
* **Implementation**:
  * Before generating or committing a new booking, the system executes a Firestore Transaction.
  * The transaction reads any active bookings for the target `physioId` on the selected date and time slot.
  * If a conflicting booking exists (status is `pending` or `accepted`), the transaction aborts client-side, returning an elegant, non-intrusive alert.
  * This guarantees zero duplicate slots under high concurrent demand.

### Decision 5: Indian Regulatory & Legal Compliance
* **Decision**: Implement standards aligned with Digital Information Security in Healthcare Act (DISHA draft) and Indian IT Act 2000.
* **Implementation**:
  * **Clinical Note Security**: Any notes written under bookings (`notes` field) are subject to client-side cryptographic hashing or isolated, field-level encryption if designated as clinical history.
  * **Physio Verification**: Credentials (Aadhar, license numbers, degree certificates) are isolated in a separate, highly secure sub-collection or designated Firestore fields. Only administrative accounts or authorized background processors can view them; they are strictly filtered out of the public profile search collections.
