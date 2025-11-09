# User Guide - Medicare Pro

## Overview

Medicare Pro is a healthcare management system that helps manage patients, appointments, and medical records. The system supports three user roles: Admin, Doctor, and Receptionist.

---

## Getting Started

### Accessing the System

1. Open your web browser and navigate to: `http://localhost:5173`
2. You'll see the login page
3. Enter your credentials (see Test Accounts below)
4. Click "Login"

### Test Accounts

- **Admin**: admin@example.com / password123
- **Doctor**: doctor@example.com / password123
- **Receptionist**: reception@example.com / password123

---

## Role-Based Features

### 👨‍💼 Admin

**Full system access with all privileges.**

**Available Features:**
- ✅ View Dashboard with statistics
- ✅ View all Patients
- ✅ Add/Edit/Delete Patients
- ✅ View all Appointments
- ✅ Create Appointments
- ✅ View Patient Profiles
- ✅ Add/View Medical Records
- ✅ Manage Users (create new users)
- ✅ Access Users page (admin-only navigation)

**Navigation:**
- Dashboard
- Patients
- Appointments
- Users (admin-only)

---

### 👨‍⚕️ Doctor

**Access to patient care and medical records.**

**Available Features:**
- ✅ View Dashboard with statistics
- ✅ View all Patients
- ✅ View Patient Profiles
- ✅ Edit Patient Information
- ✅ View all Appointments
- ✅ Add/View Medical Records
- ❌ Cannot add/delete patients
- ❌ Cannot create appointments
- ❌ Cannot manage users

**Navigation:**
- Dashboard
- Patients
- Appointments

**Note:** Doctors can add medical records when viewing a patient profile.

---

### 👩‍💼 Receptionist

**Access to scheduling and patient management.**

**Available Features:**
- ✅ View Dashboard with statistics
- ✅ View all Patients
- ✅ Add Patients
- ✅ View Patient Profiles
- ✅ Edit Patient Information
- ✅ View all Appointments
- ✅ Create Appointments
- ✅ View Medical Records
- ❌ Cannot delete patients
- ❌ Cannot add medical records
- ❌ Cannot manage users

**Navigation:**
- Dashboard
- Patients
- Appointments

---

## Feature Guide

### Dashboard

The dashboard provides an overview of the system:
- **Total Patients**: Count of all registered patients
- **Total Appointments**: Count of all appointments
- **Total Users**: Count of all system users
- **Today's Appointments**: List of appointments scheduled for today

**How to Use:**
- Navigate to Dashboard from the top navigation
- View statistics at a glance
- Click on patient names in today's appointments to view their profile

---

### Patients Management

**Viewing Patients:**
1. Click "Patients" in the navigation
2. See a table of all patients with ID, Name, Email, Phone
3. Click "View Profile" to see detailed information

**Adding a Patient (Admin/Receptionist):**
1. Go to Patients page
2. Fill in the form:
   - **Name** (required): Patient's full name
   - **Email** (optional): Valid email address
   - **Phone** (optional): Phone number
3. Click "Add Patient"
4. Patient appears in the list immediately

**Editing Patient Information:**
1. Click "View Profile" on any patient
2. Edit the form fields (Name, Email, Phone)
3. Click "Save Changes"

**Deleting a Patient (Admin only):**
1. Go to Patients page
2. Click "Delete" button next to the patient
3. Confirm deletion

**Validation:**
- Name is required
- Email must be valid format (if provided)
- Phone must be valid format (if provided)

---

### Appointments

**Viewing Appointments:**
1. Click "Appointments" in the navigation
2. See a table of all appointments with:
   - Patient name
   - Date and time
   - Status

**Creating an Appointment (Admin/Receptionist):**
1. Go to Appointments page
2. Fill in the form:
   - **Patient**: Select from dropdown
   - **Date**: Choose appointment date
   - **Time**: Choose appointment time
3. Click "Create Appointment"
4. Appointment appears in the list

**Appointment Status:**
- **scheduled**: Default status for new appointments
- **completed**: Marked after appointment is done
- **cancelled**: If appointment is cancelled

---

### Patient Profile

**Accessing Patient Profile:**
1. Go to Patients page
2. Click "View Profile" on any patient

**Profile Sections:**

1. **Edit Patient Info**
   - Update patient name, email, phone
   - Click "Save Changes" to update

2. **Appointments**
   - View all appointments for this patient
   - Shows date, time, and status

3. **Medical Records** (Doctors/Admin can add)
   - View all medical notes for the patient
   - Each record shows:
     - Doctor name who created it
     - Timestamp
     - Medical notes content
   - **Adding a Medical Record:**
     - Enter notes in the textarea
     - Click "Add Medical Record"
     - Record appears in the list

---

### Medical Records

**Purpose:** Store medical notes and observations for patients.

**Who Can Add:**
- Doctors
- Admins

**Who Can View:**
- All authenticated users

**Adding a Medical Record:**
1. Navigate to a Patient Profile
2. Scroll to "Medical Records" section
3. Enter medical notes in the textarea
4. Click "Add Medical Record"
5. Record is saved with your name and timestamp

**Viewing Medical Records:**
- All records are displayed chronologically (newest first)
- Each record shows:
  - Doctor who created it
  - Creation date and time
  - Full notes content

---

## Tips & Best Practices

### Security
- Always log out when finished
- Never share your password
- Use strong passwords in production

### Data Entry
- Always verify patient information before saving
- Use clear, descriptive medical notes
- Double-check appointment dates and times

### Navigation
- Use the top navigation bar to move between sections
- Your current role is displayed next to your name
- Click "Logout" to securely exit the system

### Error Handling
- If you see an error message, read it carefully
- Validation errors appear below form fields
- Network errors indicate server connection issues

---

## Troubleshooting

### Login Issues
- **"Invalid credentials"**: Check email and password spelling
- **"Network error"**: Ensure backend server is running
- **Page not loading**: Check if frontend server is running

### Form Validation Errors
- **"Name is required"**: Patient name cannot be empty
- **"Invalid email format"**: Use format: user@example.com
- **"Invalid phone format"**: Use valid phone number format

### Permission Errors
- **"Forbidden"**: Your role doesn't have permission for this action
- **Cannot see certain pages**: Your role may not have access
- **Buttons missing**: Some features are role-restricted

### Data Not Loading
- Refresh the page
- Check browser console for errors
- Verify database connection

---

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit forms
- **Escape**: Close modals/dialogs (if implemented)

---

## Support

For technical issues or questions:
1. Check the error message displayed
2. Review this user guide
3. Check the API documentation for developers
4. Review the database schema documentation

---

## Logout

To securely exit the system:
1. Click "Logout" button in the top-right corner
2. You'll be redirected to the login page
3. Your session token is removed

---

*Last Updated: Based on current system features*

