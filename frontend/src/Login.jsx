import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      /* ================= LOGIN ================= */

      const res = await fetch(
        "http://localhost:5000/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (!data.success) {

        alert("Invalid login");
        return;

      }

      /* ================= SAVE USER ================= */

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);
      localStorage.setItem("profilePic", data.profilePic);

      const userEmail = data.email;

      /* ================= LOAD PROGRESS FROM BACKEND ================= */

      const progressRes = await fetch(
        `http://localhost:5000/dashboard-progress/${userEmail}`
      );

      const progressData = await progressRes.json();

      if (progressData.success) {

        localStorage.setItem(
          "tasksProgress",
          progressData.tasksProgress || 0
        );

        localStorage.setItem(
          "coursesProgress",
          progressData.coursesProgress || 0
        );

        localStorage.setItem(
          "skillGapProgress",
          progressData.skillsProgress || 0
        );

      }

      /* ================= FORCE STATIC MODULE PROGRESS ================= */

      /* Career Insights should always be completed */

      localStorage.setItem(
        "insightsProgress",
        100
      );

      /* Resume default (keep previous if exists) */

      const existingResume =
        Number(localStorage.getItem("resumeProgress")) || 0;

      localStorage.setItem(
        "resumeProgress",
        existingResume
      );

      /* ================= NOTIFY DASHBOARD ================= */

      window.dispatchEvent(
        new Event("progressUpdated")
      );

      /* Small delay ensures data is saved before navigation */

      setTimeout(() => {

        navigate("/dashboard");

      }, 100);

    }

    catch (err) {

      console.error("Login error:", err);

      alert("Server error");

    }

  };

  return (

    <>

      <Header />

      <div className="login-page">

        <div className="login-box">

          <h2>
            Login to Agentic Career Planner
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="cta-btn"
            >
              Login
            </button>

          </form>

          <Link to="/signup">

            <p className="back-link1">
              New user? Sign up
            </p>

          </Link>

          <Link to="/">

            <p className="back-link">
              ← Back to Home
            </p>

          </Link>

        </div>

      </div>

      <Footer />

    </>

  );

}

export default Login;