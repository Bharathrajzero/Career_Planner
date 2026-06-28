# Agentic Career Planner

**Agentic Career Planner** is a full‑stack career planning web app that empowers students and professionals to design personalized career roadmaps. It enables users to track career goals, analyze skill gaps, manage learning tasks, join courses, build resumes, and monitor progress from a secure, role‑based dashboard.

---
## Screnshots
<img width="1920" height="1079" alt="Capture14" src="https://github.com/user-attachments/assets/394c8d30-87f9-4bdf-aaf6-75beb06663c9" />

--
<img width="1920" height="1079" alt="15" src="https://github.com/user-attachments/assets/8d006990-f00c-42d6-a0f4-18f121f954d3" />

--
<img width="1920" height="1079" alt="Capture16" src="https://github.com/user-attachments/assets/8bffcc17-5e9b-46d9-9e74-f372ef50de37" />

--
<img width="1920" height="1079" alt="Capture15" src="https://github.com/user-attachments/assets/4a59fa3d-e894-4bcf-8a47-3347d4881b7d" />

--
<img width="1920" height="1079" alt="Capture18" src="https://github.com/user-attachments/assets/c2ea6217-5507-47af-8462-4c0621405812" />

--
<img width="1920" height="1079" alt="Capture17" src="https://github.com/user-attachments/assets/d03fd555-6a05-4e7d-8817-9abbe30b97f3" />

--
<img width="1920" height="1079" alt="Capture21" src="https://github.com/user-attachments/assets/c3f313be-d147-40f9-a4c4-08bbaa4d29b5" />

--
<img width="1920" height="1079" alt="Capture19" src="https://github.com/user-attachments/assets/e83bb6a7-13b8-4f6d-98ad-b149cbafd79f" />

--
<img width="1920" height="1079" alt="Capture20" src="https://github.com/user-attachments/assets/0d536aa0-1f79-49af-b656-8238fe71f335" />

--
## 🚀 Features
- Secure user signup and login with hashed passwords  
- JWT‑based session token management  
- Protected dashboard routes with role‑based access  
- Profile updates with optional profile picture upload  
- Skill gap tracking with readiness scores  
- Task management (target time, spent time, completion, deletion)  
- Course joining, completion tracking, and removal  
- Dashboard summaries for tasks, courses, and skills  
- Resume builder and resume analyzer modules  
- Admin login and management screens  

---

## 🛠️ Tech Stack
- **Frontend:** React 19, Vite, React Router  
- **Backend:** Node.js, Express  
- **Database:** SQLite  
- **Authentication:** bcryptjs, JSON Web Token  
- **File Uploads:** multer  
- **PDF/Resume Tools:** jsPDF, PDFKit  

---

## 📂 Project Structure
```text
.
|-- backend/
|   |-- server.js
|   |-- agenticDB.db
|   |-- uploads/
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- public/
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
|-- package.json
`-- README.md
```

---

## ⚙️ Prerequisites
- Node.js  
- npm  

---

## 📦 Installation
Install dependencies for the frontend and backend:

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

Install root package dependencies (optional):
```bash
cd ..
npm install
```

---

## ▶️ Running the App

Start the backend API:
```bash
cd backend
node server.js
```
Backend runs on:
```
http://localhost:5000
```

Start the frontend in a second terminal:
```bash
cd frontend
npm run dev
```
Frontend runs on:
```
http://localhost:5173
```

---

## 🌐 Main Frontend Routes
- `/` – Home page  
- `/login` – User login  
- `/signup` – User registration  
- `/dashboard` – User dashboard  
- `/carrierinsights` – Career insights  
- `/skillgap` – Skill gap analysis  
- `/courses` – Courses  
- `/tasks` – Task tracker  
- `/resumebuilder` – Resume builder  
- `/resumeanalyzer` – Resume analyzer  
- `/settings` – Profile settings  
- `/learning-path/:career` – Career‑specific learning path  
- `/admin/login` – Admin login  
- `/admin/admin` – Admin dashboard  

---

## 🔗 Backend API Routes
- `POST /signup`  
- `POST /login`  
- `POST /update-profile`  
- `POST /save-skills`  
- `GET /get-skills/:email`  
- `POST /add-task`  
- `GET /get-tasks/:email`  
- `POST /update-task`  
- `DELETE /delete-task/:id`  
- `POST /join-course`  
- `GET /get-courses/:email`  
- `POST /complete-course`  
- `DELETE /delete-course`  
- `GET /dashboard-progress/:email`  

Uploaded files are served from:
```
http://localhost:5000/uploads/<filename>
```

---

## 🗄️ Database
The app uses SQLite (`backend/agenticDB.db`).  
Tables created in code:
- `users`  
- `skillgap`  
- `tasks`  
- `user_courses` (required for course APIs)  

---

## 📖 Notes
- Backend URLs are currently hardcoded in the frontend as `http://localhost:5000`.  
- JWT secret is defined directly in `backend/server.js`. For production, move it to environment variables.  
- `node_modules` and uploaded/generated files should be excluded from version control.  

---

## 🤝 Contributing
Contributions are welcome!  
- Fork the repository  
- Create a new branch  
- Submit a pull request  

For major changes, open an issue first to discuss what you’d like to change.

---

## 👨‍💻 Author
**Bharath Raj**  
GitHub: [Bharathrajzero](https://github.com/Bharathrajzero)

---

## 📜 License
This project is licensed under the MIT License © 2026 Bharath Raj, AlphaGroup.  

---
