# Testing Guide - Medicare Pro

This guide helps you test all features of the Medicare Pro system across different user roles.

---

## Pre-Testing Setup

1. **Start the servers:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

2. **Verify database is initialized:**
   ```bash
   cd server
   npm run db:init
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

---

## Test Accounts

| Role | Email | Password | Access Level |
|------|-------|----------|-------------|
| Admin | admin@example.com | password123 | Full access |
| Doctor | doctor@example.com | password123 | Patient care & records |
| Receptionist | reception@example.com | password123 | Scheduling & patient management |

---

## Testing Checklist

### ✅ Authentication Testing

#### Test 1: Login
- [ ] Login with admin account
- [ ] Login with doctor account
- [ ] Login with receptionist account
- [ ] Try invalid email → Should show error
- [ ] Try invalid password → Should show error
- [ ] Try empty fields → Should show validation error
- [ ] After successful login → Should redirect to dashboard
- [ ] Check that user name and role appear in header

#### Test 2: Logout
- [ ] Click logout button
- [ ] Should redirect to login page
- [ ] Try accessing protected route → Should redirect to login
- [ ] Token should be removed from localStorage

---

### ✅ Role-Based Access Testing

#### Admin Role
- [ ] Can see Dashboard, Patients, Appointments, Users in navigation
- [ ] Can add patients
- [ ] Can delete patients
- [ ] Can create appointments
- [ ] Can add medical records
- [ ] Can access all pages

#### Doctor Role
- [ ] Can see Dashboard, Patients, Appointments in navigation
- [ ] Cannot see Users in navigation
- [ ] Cannot add patients (form should not appear)
- [ ] Cannot delete patients (button should not appear)
- [ ] Cannot create appointments (form should not appear)
- [ ] Can view patient profiles
- [ ] Can add medical records
- [ ] Can edit patient information

#### Receptionist Role
- [ ] Can see Dashboard, Patients, Appointments in navigation
- [ ] Cannot see Users in navigation
- [ ] Can add patients
- [ ] Cannot delete patients (button should not appear)
- [ ] Can create appointments
- [ ] Cannot add medical records (form should not appear)
- [ ] Can view patient profiles
- [ ] Can edit patient information

---

### ✅ Dashboard Testing

#### Test 1: Statistics Display
- [ ] Total Patients count is correct
- [ ] Total Appointments count is correct
- [ ] Total Users count is correct
- [ ] Stats cards are visible and styled correctly

#### Test 2: Today's Appointments
- [ ] Today's appointments list displays correctly
- [ ] Shows patient name, time, and status
- [ ] Patient names are clickable links
- [ ] If no appointments today → Shows "No appointments scheduled"
- [ ] Status badges are color-coded correctly

---

### ✅ Patient Management Testing

#### Test 1: View Patients
- [ ] Patient list loads correctly
- [ ] All columns display: ID, Name, Email, Phone, Actions
- [ ] "View Profile" link works for each patient
- [ ] Table is responsive on mobile

#### Test 2: Add Patient (Admin/Receptionist)
- [ ] Form appears for admin and receptionist
- [ ] Form does NOT appear for doctor
- [ ] **Validation Tests:**
  - [ ] Submit empty name → Shows "Name is required"
  - [ ] Submit invalid email → Shows "Invalid email format"
  - [ ] Submit invalid phone → Shows "Invalid phone format"
  - [ ] Submit valid data → Patient added successfully
- [ ] Success notification appears
- [ ] New patient appears in list immediately
- [ ] Form clears after successful submission

#### Test 3: View Patient Profile
- [ ] Click "View Profile" → Navigates to profile page
- [ ] Patient information displays correctly
- [ ] Appointments list shows for this patient
- [ ] Medical records section is visible
- [ ] Edit form is pre-filled with patient data

#### Test 4: Edit Patient
- [ ] Update name → Saves successfully
- [ ] Update email → Saves successfully
- [ ] Update phone → Saves successfully
- [ ] Success notification appears
- [ ] Changes persist after page refresh

#### Test 5: Delete Patient (Admin only)
- [ ] Delete button appears only for admin
- [ ] Click delete → Confirmation dialog appears
- [ ] Confirm deletion → Patient removed from list
- [ ] Cancel deletion → Patient remains
- [ ] Success notification appears

---

### ✅ Appointment Management Testing

#### Test 1: View Appointments
- [ ] Appointment list loads correctly
- [ ] Shows: ID, Patient, Date, Time, Status
- [ ] Appointments sorted by date/time (newest first)
- [ ] Patient names are displayed correctly

#### Test 2: Create Appointment (Admin/Receptionist)
- [ ] Form appears for admin and receptionist
- [ ] Form does NOT appear for doctor
- [ ] **Validation Tests:**
  - [ ] Submit without patient → Shows validation error
  - [ ] Submit without date → Shows validation error
  - [ ] Submit without time → Shows validation error
  - [ ] Submit valid data → Appointment created
- [ ] Success notification appears
- [ ] New appointment appears in list
- [ ] Form clears after submission

#### Test 3: Appointment Display
- [ ] Dates display in readable format
- [ ] Times display correctly
- [ ] Status shows correctly
- [ ] Table is responsive

---

### ✅ Medical Records Testing

#### Test 1: View Medical Records
- [ ] Navigate to patient profile
- [ ] Medical Records section is visible
- [ ] Existing records display correctly
- [ ] Shows doctor name and timestamp
- [ ] Notes content displays correctly
- [ ] If no records → Shows "No medical records yet"

#### Test 2: Add Medical Record (Doctor/Admin)
- [ ] Form appears for doctor and admin
- [ ] Form does NOT appear for receptionist
- [ ] **Validation Tests:**
  - [ ] Submit empty notes → Form prevents submission
  - [ ] Submit with notes → Record created successfully
- [ ] Success notification appears
- [ ] New record appears in list immediately
- [ ] Record shows current user as doctor
- [ ] Timestamp is correct
- [ ] Textarea clears after submission

---

### ✅ Input Validation Testing

#### Email Validation
- [ ] Valid email: `user@example.com` → Accepts
- [ ] Invalid email: `notanemail` → Shows error
- [ ] Invalid email: `user@` → Shows error
- [ ] Invalid email: `@example.com` → Shows error
- [ ] Empty email (optional field) → Accepts

#### Phone Validation
- [ ] Valid phone: `+1234567890` → Accepts
- [ ] Valid phone: `(123) 456-7890` → Accepts
- [ ] Invalid phone: `123` → Shows error (too short)
- [ ] Invalid phone: `abc123` → Shows error
- [ ] Empty phone (optional field) → Accepts

#### Required Fields
- [ ] Patient name → Required
- [ ] Appointment patient → Required
- [ ] Appointment date → Required
- [ ] Appointment time → Required
- [ ] Medical record notes → Required

---

### ✅ Error Handling Testing

#### Network Errors
- [ ] Stop backend server
- [ ] Try any API call → Shows "Network error" message
- [ ] Error message is user-friendly

#### API Errors
- [ ] Try invalid login → Shows error message
- [ ] Try duplicate email → Shows error message
- [ ] Try accessing non-existent patient → Shows 404 error
- [ ] Error messages are clear and actionable

#### Form Errors
- [ ] Validation errors appear inline
- [ ] Error messages are specific
- [ ] Errors clear when field is corrected
- [ ] Submit button disabled when form invalid

---

### ✅ UI/UX Testing

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Navigation works on all screen sizes
- [ ] Forms are usable on mobile
- [ ] Tables scroll horizontally on mobile if needed

#### Notifications
- [ ] Success notifications appear on top-right
- [ ] Error notifications appear on top-right
- [ ] Notifications auto-dismiss after 3 seconds
- [ ] Can manually close notifications
- [ ] Multiple notifications stack correctly

#### Loading States
- [ ] Loading indicators show during API calls
- [ ] Buttons show disabled state during submission
- [ ] Forms prevent double-submission

#### Navigation
- [ ] All navigation links work
- [ ] Active page is clear
- [ ] Back button works correctly
- [ ] Direct URL access works (with auth)

---

### ✅ Cross-Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

**Check:**
- [ ] Login works
- [ ] Forms submit correctly
- [ ] Styling renders correctly
- [ ] Notifications appear
- [ ] Navigation works

---

### ✅ Edge Cases Testing

#### Empty States
- [ ] No patients → Table shows empty
- [ ] No appointments → Table shows empty
- [ ] No medical records → Shows message
- [ ] No today's appointments → Shows message

#### Data Edge Cases
- [ ] Very long patient names → Displays correctly
- [ ] Special characters in names → Handles correctly
- [ ] Future dates for appointments → Works
- [ ] Past dates for appointments → Works
- [ ] Very long medical notes → Displays correctly

#### Concurrent Actions
- [ ] Add patient while viewing list → Updates correctly
- [ ] Add appointment while viewing list → Updates correctly
- [ ] Multiple users logged in → No conflicts

---

## Bug Reporting Template

If you find a bug, document it:

```
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Role:** [admin/doctor/receptionist]

**Browser:** [Chrome/Firefox/Safari]

**Screenshot:** [If applicable]
```

---

## Performance Testing

- [ ] Page load times are acceptable (< 2 seconds)
- [ ] API responses are fast (< 500ms)
- [ ] No console errors
- [ ] No memory leaks (check with browser dev tools)

---

## Security Testing

- [ ] Cannot access API without token
- [ ] Cannot access protected routes without login
- [ ] Role restrictions work correctly
- [ ] Passwords are not visible in network requests
- [ ] JWT tokens expire correctly

---

## Completion Checklist

After completing all tests:

- [ ] All core features work
- [ ] All roles have correct access
- [ ] Validation works correctly
- [ ] Error handling is robust
- [ ] UI is responsive
- [ ] No critical bugs found
- [ ] Documentation is accurate

---

*Happy Testing! 🧪*

