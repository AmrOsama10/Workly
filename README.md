# Workly 💼

A **LinkedIn-inspired recruitment platform** backend built with NestJS — connecting job seekers and HR professionals through a structured hiring pipeline, with file management powered by AWS S3 and automated email notifications.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure signup/login with token-based auth and role-based access (Applicant / HR)
- 👤 **User Profiles** — Applicants and HR managers have dedicated profile flows
- 💼 **Job Listings** — HR users can create, update, and manage job postings
- 📄 **CV Uploads** — Applicants upload CVs as files; stored securely on AWS S3
- 📬 **Job Applications** — Full application flow with duplicate prevention (one application per job per user)
- 🔒 **HR-Only Access** — Protected routes ensure only HR roles can view applicants and manage listings
- 📧 **Email Notifications** — Automated emails sent on application submission and status updates via Nodemailer
- ☁️ **AWS S3 Integration** — Scalable cloud storage for CV and file uploads using Multer + AWS SDK

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database | MongoDB + Mongoose |
| Auth | JWT + Passport.js |
| File Upload | Multer + AWS S3 |
| Email | Nodemailer |
| Storage | AWS S3 (SDK v3) |

---

## 📁 Project Structure

```
src/
├── auth/           # JWT auth, guards, role decorators
├── users/          # User profiles & schema
├── jobs/           # Job listing CRUD (HR only)
├── applications/   # Application flow, duplicate prevention
├── upload/         # Multer config + AWS S3 service
├── mail/           # Nodemailer email notifications
└── common/         # Pipes, interceptors, filters
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- AWS account with an S3 bucket

### Installation

```bash
git clone https://github.com/AmrOsama10/workly.git
cd workly
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# App
PORT=3000

# Database
MONGO_URI=mongodb://localhost:27017/workly

# Auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name

# Email (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
```

### Run the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🧠 Architecture Overview

```
Applicant ──► POST /applications/:jobId
                    │
                    ├──► Multer (parse multipart/form-data)
                    │         │
                    │         └──► AWS S3 (store CV file)
                    │
                    ├──► Duplicate Check (MongoDB)
                    │
                    ├──► Save Application (MongoDB)
                    │
                    └──► Nodemailer (confirmation email)

HR ──► GET /applications/:jobId ──► Role Guard ──► Return applicants list
```

---

## 📌 Key Technical Decisions

- **Role-Based Access Control** — Custom `@Roles()` decorator + Guard enforces HR vs Applicant permissions at route level
- **AWS S3 for File Storage** — Scalable and production-ready alternative to local disk storage; each CV gets a unique S3 key
- **Duplicate Prevention** — MongoDB unique index + service-level check prevents the same user from applying to the same job twice
- **Multer + S3 Pipeline** — File is streamed directly from the request to S3 without being saved to disk
- **Email on Application** — Nodemailer sends automated confirmation to the applicant and notification to HR on every new application

---

## 👨‍💻 Author

**Amr Osama** — Backend Developer  
[GitHub](https://github.com/AmrOsama10) 
