# Enterprise Project Structure & Architectural Guidelines - PhysioConnect

This document details the enterprise-grade directory structure, module boundaries, and dependency management policies designed to prevent technical debt, ensure zero circular dependencies, and support future multi-market and multi-channel scaling.

---

## 1. Directory Tree Overview

PhysioConnect uses a **Feature-Based (Domain-Driven) Architecture** combined with a robust **Layered Clean Architecture** within each feature boundary. Shared system blocks, reusable UI elements, and core configuration setups are strictly isolated.

```
/
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── docs/                      # Repository Documentation Layer
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Database.md
│   ├── API.md
│   ├── UserFlows.md
│   ├── FutureRoadmap.md
│   └── ProjectStructure.md    # [This File]
├── src/
│   ├── main.tsx               # Client entry point
│   ├── App.tsx                # Routing & Shell container
│   ├── index.css              # Global styles (Tailwind configuration)
│   │
│   ├── assets/                # Static Media, Logos, & Icon assets
│   │
│   ├── components/            # Global Presentation Layer (Domain-Agnostic)
│   │   ├── ui/                # Low-level Design System (shadcn-inspired atoms)
│   │   └── layout/            # Shell wrapper, Header, Sidebar, Footer, Drawer
│   │
│   ├── constants/             # Immutable Configuration Matrices (Timezones, Error Codes)
│   │
│   ├── lib/                   # Infrastructure Clients (External API Wrappers)
│   │   ├── firebase/          # SDK configuration, direct authentication/firestore clients
│   │   └── maps/              # Google Maps API initialization & loader
│   │
│   ├── types/                 # Shared Cross-cutting Type declarations
│   │
│   ├── utils/                 # Stateless Utility Functions (Date manipulation, Geolocation math)
│   │
│   ├── schemas/               # Shared Validation Schemas (Zod validators)
│   │
│   ├── hooks/                 # Global UI & Component Hooks (useMediaQuery, useDebounce)
│   │
│   ├── repositories/          # Abstract Data Gateways (Decoupling DB from React)
│   │
│   └── features/              # Feature-Based Modules (Domain Boundaries)
│       ├── auth/              # Registration, Login, Role Verification flow
│       ├── physios/           # Profile Management, Geolocation parameters, Availability Config
│       ├── bookings/          # Time Slot Reservation, Transaction Processing, Booking history
│       ├── reviews/           # Post-visit Feedback and rating calculations
│       └── patients/          # Patient Health Profiles and medical contact records
```

---

## 2. Directory Breakdown & Ownership

### A. The Global Layout and UI Components (`/src/components`)
* **Responsibility**: Houses reusable visual elements that have **zero** knowledge of business rules or domain models.
* **Internal Structure**:
  * `ui/`: Highly polished, stateless UI controls (Buttons, Inputs, Dialogs, Cards, Tooltips, Accordions). 
  * `layout/`: Shared responsive page wrappers, header navigation bars, and mobile-friendly slide-out sidebar systems.
* **Ownership**: Controlled by the design system, styled strictly via Tailwind CSS classes, and configured with accessible keyboard interactions (ARIA).

### B. Infrastructure Decoupling (`/src/lib`)
* **Responsibility**: Boots and configures external software development kits (SDKs).
* **Isolation Rule**: Standard code in the features directory **must never** import directly from external SDK libraries like `firebase/app`, `firebase/firestore`, or the Google Maps client libraries. Instead, they interact with clean adapters initialized in this directory.
* **Why**: If the platform migrates from Firebase to a PostgreSQL backend on Supabase in Phase 3, changes are isolated entirely within this client wrapping layer, leaving React UI pages completely untouched.

### C. Feature Domain Modules (`/src/features`)
* **Responsibility**: Enforces encapsulation. Each domain exists as a fully self-contained unit.
* **Internal Structure within a Feature (e.g., `features/bookings/`)**:
  ```
  features/bookings/
  ├── components/          # Feature-specific widgets (BookingCard, DatePickerGrid)
  ├── hooks/               # Feature-specific state machines (useBookingTransaction)
  ├── schemas/             # Form validation schemas (bookingRequestSchema)
  ├── services/            # Pure application business logic (slot overlaps validation)
  └── types.ts             # Feature-specific interface contracts
  ```
* **Boundary Rules**: Features must be **strictly horizontal**. A file inside `features/bookings/` is **forbidden** from making relative imports from `features/physios/`. 

---

## 3. Deep-Dive Design Solutions

### Avoid Circular Dependencies
Circular dependencies (e.g., Feature A importing from Feature B, which in turn imports from Feature A) lead to runtime crashes and tightly coupled codebases.
* **The Solution (Public APIs / Barrel exports)**:
  * Each feature defines a clean entry point file (`index.ts`).
  * Only designated shared interfaces, hooks, or components are exported through this file.
  * When Feature A requires data governed by Feature B, it must import *only* from the root level of Feature B (e.g., `import { PhysioSelector } from '@/features/physios'`). It cannot traverse internal folders.
  * If two features depend heavily on a shared structural concept, that concept is extracted and promoted up into the global `/src/types/`, `/src/utils/`, or `/src/repositories/` layers.

### Business Logic Decoupled from React
To ensure the core business rules are testable and reusable (including when migrating to native mobile builds in the future), business operations are divorced from React lifecycle rendering.
* **The Solution**: 
  * Calculations, validation logic, and state transitions are written in pure TypeScript classes or functional pipelines inside the feature's `services/` directory.
  * React components simply delegate user events to these services, and hooks observe the outputs.

### Shared Utilities & State Verification
* **Zod Schemas (`/src/schemas`)**: Maintain declarative verification boundaries. Standardize inputs (e.g., Aadhar formatting, mobile numbers) at the interface boundary before hitting the database transactions.
* **Unit & Integration Testing Boundaries**: Every folder maintains an isolated sibling testing directory (`__tests__/`) holding `.test.ts` or `.spec.ts` files to verify correctness instantly under mock states.

---

## 4. Import Rules & Development Standards

To preserve pristine code quality, the following policies are strictly enforced across the team:

### 1. Absolute Paths (Path Aliasing)
* All imports must use the designated `@/` prefix to resolve against the project root.
* **Forbidden**: Multi-tier relative backtracking (e.g., `import X from '../../../../components/Button'`).
* **Approved**: `import { Button } from '@/components/ui/button'`.

### 2. Strict Unidirectional Dependency Direction
The flow of dependencies in the application codebase is strictly unidirectional:

```
┌────────────────────────────────────────────────────────┐
│               React Components (UI Layer)              │
└───────────────────────────┬────────────────────────────┘
                            │ (Reads from)
                            ▼
┌────────────────────────────────────────────────────────┐
│            Feature hooks / state machines              │
└───────────────────────────┬────────────────────────────┘
                            │ (Executes logic via)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Pure Business Services                    │
└───────────────────────────┬────────────────────────────┘
                            │ (Retrieves data via)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Clean Repositories / Adapters              │
└───────────────────────────┬────────────────────────────┘
                            │ (Accesses)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Third-Party SDKs / Clients                │
└────────────────────────────────────────────────────────┘
```

### 3. Naming Conventions
* **React Components**: PascalCase (e.g., `BookingRequestCard.tsx`).
* **React Hooks**: camelCase starting with `use` (e.g., `useBookingTransaction.ts`).
* **TypeScript Types & Interfaces**: PascalCase (e.g., `PhysioVerificationData`).
* **Validation Schemas**: camelCase ending with `Schema` (e.g., `physioVerificationSchema.ts`).
* **Utility Files & Helpers**: camelCase (e.g., `haversineDistance.ts`).
