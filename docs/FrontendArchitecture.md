# Frontend Architecture Specification - PhysioConnect

## 1. Routing & Route Protection Architecture

### Route Hierarchy & Navigation Graph
To support high performance, code-splitting, and secure domain access, PhysioConnect implements a **declarative, central routing system** utilizing a React Router-based Client-Side Controller. 

```
/ (Root Layout: Theme, Toast, Query Provider)
│
├── /public (Unauthenticated Shell)
│   ├── /login                 -> Public Access
│   └── /register              -> Public Access (Role selection & initial profile)
│
├── /patient (Protected Role Guard: Patient)
│   ├── /search                -> Geolocation search & therapist selection
│   ├── /physio/:id            -> Therapist profile, services overview, & booking request
│   └── /bookings              -> Active bookings status, contact logs, & rating submissions
│
└── /physio (Protected Role Guard: Physiotherapist)
    ├── /dashboard             -> Pending requests queue, action console
    ├── /schedule              -> Weekly recurring availability & geographical boundary edit
    └── /history               -> Historic clinical session files
```

### Route Protection & Authentication Guard Middleware
* **The Middleware Pattern**: Protected routes are wrapped in a generic `<RouteGuard>` component that monitors the global Auth Context state.
* **Role-Based Access Control (RBAC)**:
  * When a route is matched, the `<RouteGuard>` verifies both:
    1. If `currentUser` exists (Authentication Guard).
    2. If `currentUser.role` matches the expected path parameter (Authorization Guard: `patient` or `physio`).
* **Uncertified Physio Quarantine**: If a physiotherapist attempts to access the scheduler before their status transitions from `pending` to `approved`, the router redirects them to a highly elegant, informational "Verification Pending" dashboard.
* ** Flash of Unauthenticated Content (FOUC) Mitigation**: While Firebase Auth initializes, the guard suspends page rendering and presents a high-fidelity shimmer loader instead of raw login forms.

---

## 2. Component, Page, & Layout Hierarchy

### Layout Wrapper Delegation
Rather than redefining page shells, navigation rails, and headers on every view, we implement a nested hierarchy of **Layout Wrappers** that manage structural boundaries.

```
[App Entry]
   └── [Theme & Toast Providers]
         └── [TanStack Query Provider]
               └── [Auth Provider]
                     └── [Main Shell Layout] (Manages global viewport limits, header, responsive margins)
                           ├── [Public Layout Wrapper]  (Full bleed screens, landing layouts)
                           ├── [Patient Layout Wrapper] (Sidebar with Patient shortcuts, emergency panel)
                           └── [Physio Layout Wrapper]  (Dense dashboard grids, calendar side panels)
```

### Smart Container vs. Dumb Component Separation
* **Pages (Smart Containers)**: Located in `features/{domain}/pages/`. They manage React Query state hooks, handle routing navigations, fire global toast notifications, and manage transactional logic.
* **Components (Dumb Presentational Widgets)**: Located in `features/{domain}/components/` or `/src/components/ui/`. They receive clean data parameters via React `props` and emit stateless callbacks (e.g., `<Button onClick={onSelect} />`).
* **Maintainability Benefit**: Simplifies unit testing. presentational elements can be fully verified in sandbox environments (like Storybook) without mock databases or routing dependencies.

---

## 3. Form Architecture & Validation

### Unified Validation Pipeline (React Hook Form + Zod)
Forms represent the single largest vector for user error and client-side friction. We implement a declarative form architecture separating design from validation constraints.

* **React Hook Form**: Minimizes re-renders by utilizing uncontrolled input refs, improving form entry fluidity on low-tier mobile devices.
* **Zod Schema Integration**: Custom form inputs compile to strict TypeScript types. Schema objects (such as `bookingRequestSchema`) are exported at the feature boundaries, allowing them to validate:
  1. On-the-fly client-side validation as the user types.
  2. Deep integration tests in the CI pipeline.

### Error Display Patterns
* **Inline Fields**: Validation errors are caught before form submission, highlighting input fields in a warm, diagnostic red and rendering assistive ARIA description blocks.
* **Auto-Focusing Diagnostic**: If a multi-tab profile validation fails, the form controller automatically scrolls to and focuses the first invalid field, optimizing accessibility.

---

## 4. Design System, Theme, & Responsive Layouts

### Custom Tailwind Config
Using Tailwind CSS, we define an elevated, premium, Swiss-Modern layout theme utilizing custom CSS-variables mapped directly to design system keys.

* **Color Palette (Slate Theme)**:
  * Primary: High-contrast rich charcoal dark elements (`zinc-900`) contrasted against soft off-whites (`zinc-50`).
  * Accent: Trusted clinical blue tones (`blue-600` for active states, `blue-50` for highlight containers).
* **Typography Pairing**:
  * **Display (Headings)**: "Space Grotesk" or "Outfit" with tight tracking (`tracking-tight`) for an authoritative, modern feel.
  * **Interface Body & Copy**: "Inter" for high legibility across varying device pixel-densities.
  * **Metadata & Technical readouts**: "JetBrains Mono" for scheduling blocks, distance values, and rating percentages.

### Fluid Responsive Spacing Scale
We utilize a fluid, responsive container system to prevent elements from stretching on ultra-wide desktop monitors:
* Grid structures map to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to automatically restructure bento layouts dynamically.
* All clickable elements maintain a minimum hit target of `44x44px` on mobile wrappers.

---

## 5. Interaction Architecture (Loading, Skeletons, Toasts, & Modals)

### Async Boundary & Skeleton Loading Strategy
* **Skeleton Loaders**: Rather than showing raw spinner wheels, every data-driven component has a dedicated matching `<Skeleton>` mockup. During retrieval phases, cards present dynamic shimmers that maintain exact dimensions to prevent painful layout shifts when data lands.
* **React Suspense Integration**: Pages use React Suspense boundaries to stream in complex components independently as they resolve, speeding up initial page weight and time-to-interactive.

### Global Toast & Overlay Architecture
* **Toast Notification Engine**: We implement a lightweight, non-blocking toast stack (e.g., using a centralized state store or Sonner). Success alerts present confirmation micro-copy, while errors present actionable troubleshooting suggestions instead of cryptic stack codes.
* **Modal vs. Drawer Adaptive Strategy**:
  * **Desktop (Viewport md+)**: Complex overlays (such as booking configurations or credential reviews) render inside elegant, centered `<Dialog>` modals.
  * **Mobile (Viewport < md)**: Overlays seamlessly transition to bottom-sheet drawers (`<Drawer>`), aligning with natural thumbs-reach interactions on handheld screens.

---

## 6. State Management & Data Flow Architecture

### Server Caching (TanStack Query)
To prevent complex global client state, PhysioConnect delegates all server communication to TanStack Query.
* **Queries**: Manage fetching and caching of profiles, reviews, and bookings. Uses automated staled-time window limits to prevent redundant Firestore calls.
* **Mutations**: Manage status updates, booking generation, and review entries.
* **Optimistic Updates**: When a physiotherapist accepts a booking, the client immediately updates the list visually *before* the Firestore write confirms, providing instantaneous feedback. If the operation fails, the cache performs an automated rolling fallback and fires an alert toast.

### Lightweight Local Context Wrappers
Global client state is intentionally minimized and kept stateless. We rely strictly on specialized, lightweight contexts:
* **AuthContext**: Holds user session parameters, role attributes, and verification queue profiles.
* **ThemeContext**: Handles interface mode tracking.

---

## 7. Accessibility, Polish, & Motion Design

### Keyboard & ARIA Access Rules
* **Interactives**: All buttons, links, and select inputs possess logical focus-visible rings.
* **Keyboard Navigability**: Schedulers, calendars, and form grids are fully traverseable using standard tab, arrow, and escape keys.
* **Screen Reader Accessibility**: Screen reader descriptive tags (`aria-label`) are applied to non-textual icon buttons (such as navigation controls or phone links).

### Animated Transition Micro-Interactions (Motion)
We leverage `motion` from `motion/react` to inject polished, purpose-driven animations that establish spatial hierarchy:
* **Route Changes**: Staggered fade-ins and slide transitions establish page flow.
* **Layout Reorderings**: List shifts (such as booking filtering) utilize layout animation properties (`layoutId`) to morph positions smoothly.
* **Action Feedbacks**: Hovering clickable cards triggers subtle scale elevations (+1.5%), while pressing elements triggers a physical down-click scale (-2.5%).
