# Agentic Career Planner

**Agentic Career Planner** is a full‑stack career planning web app that helps users create an account, track career goals, analyze skill gaps, manage learning tasks, join courses, build resumes, and monitor progress from a personalized dashboard.

---

## 🚀 Features
- User signup and login with hashed passwords  
- JWT‑based session token stored on the client  
- Protected user dashboard routes  
- Profile update with optional profile picture upload  
- Skill gap tracking with readiness scores  
- Task management with target time, spent time, completion, and deletion  
- Course joining, completion tracking, and removal  
- Dashboard progress summaries for tasks, courses, and skills  
- Resume builder and resume analyzer screens  
- Admin login and admin management screens in the frontend  

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

If you want to install root package dependencies too:
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
This project is licensed under the MIT License © 2026 Bharath Raj, AlphaGroup Ltd.  
See the `[Looks like the result wasn't safe to show. Let's switch things up and try something else!]` file for details.

---
