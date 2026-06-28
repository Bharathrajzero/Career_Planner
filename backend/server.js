const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "agentic_secret_key";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

/* ================= DATABASE CONNECTION ================= */

const db = new sqlite3.Database("./agenticDB.db", (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("💾 Connected to SQLite database successfully.");
  }
});

/* ================= TABLES SCHEMA & SEEDING ================= */

// Force table integrity verification using a clean serialize sequence
db.serialize(() => {
  console.log("🛠 Verifying database tables schema...");

  /* USERS TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT UNIQUE,
      password TEXT,
      profile_pic TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error initializing 'users' table:", err);
    } else {
      console.log("✅ 'users' table is verified.");
      
      // Seed default admin immediately after verifying table structure
      const adminEmail = "admin@test.com";
      db.get("SELECT * FROM users WHERE email = ?", [adminEmail], async (err, row) => {
        if (err) {
          console.error("❌ Error querying admin account:", err);
        } else if (!row) {
          try {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            db.run(
              "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
              ["System Admin", adminEmail, hashedPassword],
              (insertErr) => {
                if (insertErr) {
                  console.error("❌ Failed to seed default admin account:", insertErr);
                } else {
                  console.log("🚀 SUCCESS: Seeded default admin! Email: admin@test.com | Pass: admin123");
                }
              }
            );
          } catch (hashErr) {
            console.error("❌ Error hashing admin password:", hashErr);
          }
        } else {
          console.log("ℹ️ Default admin account already exists in database.");
        }
      });
    }
  });

  /* SKILL GAP TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS skillgap (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      targetRole TEXT,
      skills TEXT,
      readiness INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* TASKS TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      title TEXT,
      targetSeconds INTEGER,
      spentSeconds INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  /* USER COURSES TABLE */
  db.run(`
    CREATE TABLE IF NOT EXISTS user_courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      courseId TEXT,
      title TEXT,
      description TEXT,
      career TEXT,
      skillGap TEXT,
      completed INTEGER DEFAULT 0,
      progress INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

/* ================= MULTER FILE STORAGE ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ================= ROUTING: SIGNUP ================= */

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`📥 Signup Request received for: ${email}`);

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, row) => {
    if (err) {
      console.error("❌ Signup query error:", err);
      return res.status(500).json({ success: false, message: "Database lookup failure." });
    }
    if (row) return res.json({ success: false, message: "User already exists" });

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run(
        "INSERT INTO users (username, email, password) VALUES (?,?,?)",
        [username, email, hashedPassword],
        function (err) {
          if (err) {
            console.error("❌ Signup insert error:", err);
            return res.status(500).json({ success: false, message: "Failed to create user." });
          }
          res.json({ success: true });
        }
      );
    } catch (e) {
      res.status(500).json({ success: false, message: "Server hashing failure." });
    }
  });
});

/* ================= ROUTING: USER LOGIN ================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`📥 Regular Login Attempt for: ${email}`);

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (err) {
      console.error("❌ Login query error:", err);
      return res.status(500).json({ success: false, message: "Database internal error" });
    }
    if (!user) return res.status(404).json({ success: false, message: "User account not found" });

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ success: false, message: "Incorrect password" });

      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "2h" });

      res.json({
        success: true,
        username: user.username,
        email: user.email,
        token: token,
        profilePic: user.profile_pic ? `http://localhost:5000/uploads/${user.profile_pic}` : null,
      });
    } catch (e) {
      res.status(500).json({ success: false, message: "Bcrypt processing exception" });
    }
  });
});

/* ================= ROUTING: DEDICATED ADMIN LOGIN ================= */

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  console.log(`📥 ADMIN Login Attempt for: ${email}`);

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, user) => {
    if (err) {
      console.error("❌ Admin Login database search error:", err);
      return res.status(500).json({ success: false, message: `Database error: ${err.message}` });
    }
    
    if (!user) {
      console.log(`❌ Admin account match not found for email: ${email}`);
      return res.status(404).json({ success: false, message: "Admin account not found in database." });
    }

    try {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        console.log(`❌ Incorrect password attempt for admin account: ${email}`);
        return res.status(401).json({ success: false, message: "Invalid credentials / wrong password." });
      }

      console.log(`✅ Admin authentication successful for: ${email}`);
      const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: "2h" });

      res.json({
        success: true,
        username: user.username,
        email: user.email,
        token: token,
      });
    } catch (bcryptErr) {
      console.error("❌ Cryptographic compare handling error:", bcryptErr);
      res.status(500).json({ success: false, message: "Internal server processing failure." });
    }
  });
});

/* ================= BACKEND CORE ADMIN DASHBOARD INTERFACES ================= */

// GET ALL REGISTEREED USERS
app.get("/admin/users", (req, res) => {
  db.all("SELECT id, username, email, profile_pic FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to fetch dashboard user list." });
    res.json({ success: true, users: rows || [] });
  });
});

// ADMIN ACTION: DELETE USER
app.delete("/admin/users/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, message: "Unable to delete user." });
    res.json({ success: true });
  });
});

// GET ALL GLOBAL COURSES
app.get("/admin/courses", (req, res) => {
  db.all("SELECT * FROM user_courses", [], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to fetch dashboard course configurations." });
    res.json({ success: true, courses: rows || [] });
  });
});

// ADMIN ACTION: DELETE COURSE
app.delete("/admin/courses/:id", (req, res) => {
  db.run("DELETE FROM user_courses WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ success: false, message: "Unable to remove targeted course." });
    res.json({ success: true });
  });
});

/* ================= MANAGEMENT: UPDATE PROFILE ================= */

app.post("/update-profile", upload.single("profilePic"), async (req, res) => {
  const { username, email, password } = req.body;
  let profilePic = req.file ? req.file.filename : null;

  try {
    let query = "UPDATE users SET username=?";
    let params = [username];

    if (profilePic) {
      query += ", profile_pic=?";
      params.push(profilePic);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ", password=?";
      params.push(hashedPassword);
    }

    query += " WHERE email=?";
    params.push(email);

    db.run(query, params, function (err) {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    });
  } catch {
    res.json({ success: false });
  }
});

/* ================= TRACKING: SKILL GAPS ================= */

app.post("/save-skills", (req, res) => {
  const { email, targetRole, skills, readiness } = req.body;
  const skillsJSON = JSON.stringify(skills);

  db.run(
    `INSERT INTO skillgap (email,targetRole,skills,readiness) VALUES (?,?,?,?)`,
    [email, targetRole, skillsJSON, readiness],
    function (err) {
      if (err) {
        console.error(err);
        return res.json({ success: false });
      }
      res.json({ success: true });
    }
  );
});

app.get("/get-skills/:email", (req, res) => {
  db.all(`SELECT * FROM skillgap WHERE email=?`, [req.params.email], (err, rows) => {
    if (err) return res.json({ success: false });
    res.json({ success: true, data: rows });
  });
});

/* ================= TRACKING: TASKS MANAGEMENT ================= */

app.post("/add-task", (req, res) => {
  const { email, title, targetSeconds } = req.body;

  db.run(
    `INSERT INTO tasks (email,title,targetSeconds) VALUES (?,?,?)`,
    [email, title, targetSeconds],
    function (err) {
      if (err) return res.json({ success: false });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get("/get-tasks/:email", (req, res) => {
  db.all("SELECT * FROM tasks WHERE email=?", [req.params.email], (err, rows) => {
    res.json({ success: true, data: rows });
  });
});

app.post("/update-task", (req, res) => {
  const { id, spentSeconds, completed } = req.body;

  db.run(
    `UPDATE tasks SET spentSeconds=?, completed=? WHERE id=?`,
    [spentSeconds, completed, id],
    function (err) {
      res.json({ success: true });
    }
  );
});

app.delete("/delete-task/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id=?", [req.params.id], function () {
    res.json({ success: true });
  });
});

/* ================= LOGIC: STUDENT COURSE WORKSPACE ================= */

app.post("/join-course", (req, res) => {
  const { email, course } = req.body;

  if (!email || !course) {
    return res.json({ success: false, message: "Missing course data" });
  }

  db.get(
    `SELECT * FROM user_courses WHERE email=? AND courseId=?`,
    [email, course.id],
    (err, row) => {
      if (row) {
        return res.json({ success: false, message: "Course already joined" });
      }

      db.run(
        `INSERT INTO user_courses (email, courseId, title, description, career, skillGap) VALUES (?,?,?,?,?,?)`,
        [email, course.id, course.title, course.description, course.career, course.skillGap],
        function (err) {
          if (err) {
            console.log(err);
            return res.json({ success: false, message: "Failed to join course" });
          }
          res.json({ success: true, message: "Course joined successfully" });
        }
      );
    }
  );
});

app.get("/get-courses/:email", (req, res) => {
  const email = req.params.email;

  db.all(`SELECT * FROM user_courses WHERE email=? AND completed=0`, [email], (err, joined) => {
    if (err) return res.json({ success: false });

    db.all(`SELECT * FROM user_courses WHERE email=? AND completed=1`, [email], (err2, completed) => {
      if (err2) return res.json({ success: false });

      res.json({
        success: true,
        joined: joined || [],
        completed: completed || [],
      });
    });
  });
});

app.post("/complete-course", (req, res) => {
  const { email, courseId } = req.body;

  db.run(
    `UPDATE user_courses SET completed=1, progress=100 WHERE email=? AND courseId=?`,
    [email, courseId],
    function (err) {
      if (err) return res.json({ success: false, message: "Failed to update target course." });
      res.json({ success: true, message: "Course marked completed" });
    }
  );
});

app.delete("/delete-course", (req, res) => {
  const { email, courseId } = req.body;

  db.run(`DELETE FROM user_courses WHERE email=? AND courseId=?`, [email, courseId], function (err) {
    if (err) return res.json({ success: false, message: "Failed to delete course" });
    res.json({ success: true, message: "Course deleted" });
  });
});

/* ================= SYSTEM: METRICS METRIC DASHBOARD ================= */

app.get("/dashboard-progress/:email", (req, res) => {
  const email = req.params.email;
  let tasksProgress = 0;
  let coursesProgress = 0;
  let skillsProgress = 0;

  db.all("SELECT targetSeconds, spentSeconds FROM tasks WHERE email=?", [email], (err, tasks) => {
    if (tasks && tasks.length > 0) {
      let totalTarget = 0;
      let totalSpent = 0;

      tasks.forEach((t) => {
        totalTarget += t.targetSeconds;
        totalSpent += t.spentSeconds;
      });

      tasksProgress = totalTarget === 0 ? 0 : Math.round((totalSpent / totalTarget) * 100);
    }

    db.all("SELECT completed FROM user_courses WHERE email=?", [email], (err2, courses) => {
      if (courses && courses.length > 0) {
        const completed = courses.filter((c) => c.completed === 1).length;
        coursesProgress = Math.round((completed / courses.length) * 100);
      }

      db.get(
        "SELECT readiness FROM skillgap WHERE email=? ORDER BY id DESC LIMIT 1",
        [email],
        (err3, skill) => {
          if (skill) {
            skillsProgress = skill.readiness || 0;
          }

          res.json({
            success: true,
            tasksProgress,
            coursesProgress,
            skillsProgress,
          });
        }
      );
    });
  });
});

/* ================= AMBIENT LIFECYCLE EXECUTION ================= */

app.listen(5000, () => {
  console.log("====================================================");
  console.log("🚀 Server running smoothly on http://localhost:5000");
  console.log("====================================================");
});
