# 💼 Job Portal Backend

This is the backend API for a MERN Stack **Job Portal** application. It provides RESTful endpoints for authentication, job postings, applications, and dashboard features for both **employers** and **job seekers**.
- **Live Demo: https://job-portal-frontend-one-nu.vercel.app/**



## 🚀 Technologies Used

- **Node.js & Express.js**
- **MongoDB with Mongoose**
- **JWT Authentication**
- **Multer (for file uploads)**
- **Role-based Access Control**

---
## 🌟 Features & Implementation Details

### User Roles

- **Job Seekers:**
  - Register and log in.
  - Browse available job listings.
  - Apply for jobs by submitting a cover letter and uploading a resume.
  - View the status of their applications.
  - Can track Total Applications, Under Review, Accepted, Rejected on dashboard


- **Employers:**
  - Register and log in.
  - Post new job listings.
  - View applications submitted for their job postings.
  - Can update/delete the jobs
  - Can track Active jobs, Total Applications, Pending Review, Hired on dashboard
  - Update the status of applications (e.g., pending, accepted, rejected).
---

## 🛠️ Setup Instructions

### Clone the repository
```bash
git clone https://github.com/Jai-eng-gif/Job-Portal.git
cd Job-Portal/backend
```

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```
     DB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000` by default.

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000` by default.

---

## 🔐 Authentication Endpoints

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| POST   | `/api/auth/register` | Register user (jobseeker/employer) |
| POST   | `/api/auth/login`    | Login and get JWT token          |

---

## 📄 Job Endpoints

| Method | Endpoint                  | Auth | Description                   |
|--------|---------------------------|------|-------------------------------|
| GET    | `/api/jobs`               | ❌   | Fetch all jobs                |
| GET    | `/api/jobs/:id`           | ❌   | Fetch job by ID               |
| GET    | `/api/jobs/bycompany`     | ✅   | Fetch jobs by logged-in employer |
| POST   | `/api/jobs`               | ✅   | Create a job (employer only)  |
| PUT    | `/api/jobs/:id`           | ✅   | Update a job (employer only)  |
| DELETE | `/api/jobs/:id`           | ✅   | Delete a job (employer only)  |

---

## 📑 Application Endpoints

| Method | Endpoint                  | Auth | Description                          |
|--------|---------------------------|------|--------------------------------------|
| POST   | `/api/applications`       | ✅   | Apply to job (upload resume)         |
| GET    | `/api/applications`       | ✅   | Get jobseeker's applications         |

---

## 📊 Dashboard Endpoints

> 🧑‍💼 **Employer Role Required**

| Method | Endpoint                                                   | Auth | Description                              |
|--------|------------------------------------------------------------|------|------------------------------------------|
| GET    | `/api/dashboard/employer/jobs`                             | ✅   | Get all jobs posted by the employer      |
| GET    | `/api/dashboard/employer/jobs/:jobId/applications`         | ✅   | Get all applications for a specific job  |
| GET    | `/api/dashboard/employer/applicants`                       | ✅   | Get all applicants across all jobs       |
| PUT    | `/api/dashboard/:applicationId`                            | ✅   | Update application status (accept/reject)|

> 🙋 **Jobseeker Role Required**

| Method | Endpoint                            | Auth | Description                    |
|--------|-------------------------------------|------|--------------------------------|
| GET    | `/api/dashboard/jobseeker/applications` | ✅   | Get applications submitted by jobseeker |

---
Got it! Since you're putting this in your `README.md`, here's a **clean and concise section** you can directly include under a heading like `## 🗂 Data Models`:

---

## 🗂 Data Models

### 👤 User

```js
{
  name: String,
  email: String, // unique
  password: String, // hashed using bcrypt
  role: 'jobseeker' | 'employer',
  company?: String // only for employers
}
```

- Passwords are securely hashed before saving.
- Role determines access level (job posting or job seeking).
- `comparePassword()` method is available for login verification.

---

### 💼 Job

```js
{
  title: String,
  company: String,
  location: String,
  type: String, // e.g., Full-time, Part-time
  salary: String,
  description: String,
  requirements: [String],
  postedDate: Date,
  category: String,
  postedBy: ObjectId (ref: 'User')
}
```

- Linked to the employer via `postedBy`.

---

### 📝 Application

```js
{
  jobId: ObjectId (ref: 'Job'),
  userId: ObjectId (ref: 'User'),
  status: 'pending' | 'accepted' | 'rejected',
  appliedDate: Date,
  coverLetter: String,
  resume: String // file URL or path
}
```

- Connects jobseekers with jobs they apply to.
- Employers can update the application `status`.

---

## 📎 Resume Uploads

- Resumes are uploaded as files (`multipart/form-data`) and stored in **base64** in the database.
 

---

## ✅ Role-Based Access

- **Jobseeker**: Can browse/apply for jobs.
- **Employer**: Can post jobs and view/manage/delete applicants.
- Access control is implemented via middleware:
  - `jwtAuthMiddleware` – Verifies JWT token
  - `roleCheck(['role'])` – Checks for required user role

--- 
