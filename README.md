# 🏥 Clinic Queue System

A full-stack Clinic Queue Management System built with **Next.js 15 (App Router)**, **TypeScript**, and **MongoDB**. This system streamlines appointment booking, queue tracking, diagnosis recording, and role-based dashboards for clinic staff such as nurses, doctors, lab technicians, pharmacists, receptionists, and admins.

---

## 🚀 Features

### 🔐 Authentication & Authorization

- Secure login via **NextAuth.js**
- Role-based access control for:
  - Admin
  - Doctor
  - Nurse
  - Pharmacist
  - Lab Technician
  - Receptionist
  - Patient

### 📅 Appointments

- Book appointment form (name, reason, phone, doctor)
- Queue number generation
- Status updates: `waiting`, `in-progress`, `done`
- Real-time updates via **Pusher**

### 🧑‍⚕️ Role-Based Dashboards

- **Admin**:

  - View all users
  - Change roles
  - Delete users
  - View audit logs
  - View system metrics

- **Doctor / Nurse / Lab Tech / Pharmacist / Receptionist**:
  - Role-specific queue views
  - Editable fields: diagnosis, lab tests, prescriptions, notes
  - Dispense tracking

### 📊 Admin Metrics Dashboard

- Total users
- Total appointments
- Today's appointments
- Prescription count

### 📬 Notifications (Optional)

- Email via **Nodemailer**
- SMS via **Twilio**

---

## 🛠️ Tech Stack

| Technology   | Description                       |
| ------------ | --------------------------------- |
| Next.js      | App Router, SSR, API routes       |
| TypeScript   | Static typing                     |
| MongoDB      | NoSQL database (Mongoose ORM)     |
| NextAuth.js  | Authentication & session handling |
| Tailwind CSS | UI Styling                        |
| Pusher       | Real-time updates                 |
| JWT          | Role validation                   |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/maureen-njeri/Clinic-Queue-System.git

# Navigate to project directory
cd Clinic-Queue-System

# Install dependencies
npm install

# Create a .env.local file
touch .env.local
```
