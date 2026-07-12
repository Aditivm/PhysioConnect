# User Flows & Navigation - PhysioConnect

Below are the step-by-step user experience flows for the two distinct client roles on the platform.

---

## 1. Patient User Journey

### Flow A: Registration & Initial Login
```
[ Land on Auth Page ] ───► [ Fill Registration Form ] ───► [ Role Selection: "Patient" ]
                                                                   │
                                                                   ▼
[ Redirected to Patient Dashboard ] ◄─────────────────── [ Base Profile Creation in DB ]
```

### Flow B: Search, Select, & Booking Request
```
[ Enter Location in Search ] (Google Autocomplete)
               │
               ▼
[ Display Available Physios in Area ] (Computed by straight-line Haversine radius filter)
               │
               ▼
[ Select Physiotherapist Profile ] (View bios, certifications, and service prices)
               │
               ▼
[ View Weekly Time Slots ] ───► [ Select Date & Start/End Slot ]
                                                │
                                                ▼
[ Enter Address & Request Session ] ◄───────────┘
```

### Flow C: Manage Bookings & Leave Reviews
```
[ View Bookings History List ]
               │
         ┌─────┴──────────────────────────────────────────┐
         ▼ (If Status = Pending/Accepted)                 ▼ (If Status = Completed)
[ View Detail Card / Contact Info ]              [ Write Review / Rate 1-5 Stars ]
                                                          │
                                                          ▼
                                                 [ Review Committed ] (Read-only)
```

---

## 2. Physiotherapist (Physio) User Journey

### Flow A: Signup, Detail Submission, & Administrative Queue
```
[ Land on Auth Page ] ───► [ Fill Registration Form ] ───► [ Role Selection: "Physiotherapist" ]
                                                                   │
                                                                   ▼
[ Input Verification Documents ] (Aadhar card, degree certificate PDF, license registration)
                                                                   │
                                                                   ▼
[ Complete Service Setup ] ◄─────────────────────────────── [ Profile Created in "Pending" State ]
(Define specialization, base pricing, service radius in km)
                                                                   │
                                                                   ▼
[ Administrative Review ] ────► [ Account Approved ] ────► [ Publicly Searchable & Eligible for Bookings ]
```

### Flow B: Set Weekly Availability & Work Area
```
[ Navigate to Availability Settings Tab ]
               │
               ▼
[ Set Weekday Hours ] (Define hours for Monday - Sunday; toggling days off)
               │
               ▼
[ Set Geographic Service Boundary ] (Update center coordinates and travel radius in km)
               │
               ▼
[ Save Changes ] (Changes reflected immediately for any subsequent search attempts)
```

### Flow C: Booking Management & Session Execution
```
[ Receive Real-time Notification ] (Booking Request appears in Dashboard list)
               │
         ┌─────┴──────────────────────────────────────────┐
         ▼ (Physio Declines)                              ▼ (Physio Accepts)
[ Booking Marked "Declined" ]                    [ Booking Marked "Accepted" ]
                                                          │
                                                          ▼
                                                 [ Visit Conducted / Treatment Provided ]
                                                          │
                                                          ▼
                                                 [ Receive Payment Offline (Cash/UPI) ]
                                                          │
                                                          ▼
                                                 [ Click "Mark Completed" ] ───► [ Patient review unlocked ]
```
