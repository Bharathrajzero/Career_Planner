import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

import Header from "../Header";
import Footer from "../Footer";

function AdminLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const navigate =
    useNavigate();

  const handleLogin =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await axios.post(
            "http://localhost:5000/admin/login",
            {
              email,
              password
            }
          );

        if (res.data.success) {

          setMessage(
            "Login successful!"
          );

          /* ⭐ VERY IMPORTANT */

          localStorage.setItem(
            "adminLoggedIn",
            "true"
          );

          /* Redirect */

          navigate("/admin/admin");

        }

        else {

          setMessage(
            res.data.message
          );

        }

      }

      catch (err) {

        console.error(err);

        setMessage(
          "Server error"
        );

      }

    };

  return (

    <>

      <Header />

      <div className="login-page">

        <div className="login-box">

          <h2>Admin Login</h2>

          <form
            onSubmit={handleLogin}
          >

            <div className="form-group">

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter admin email"
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
                placeholder="Enter admin password"
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

          <p className="back-link1">

            {message}

          </p>

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

export default AdminLogin;