import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";

function Signup() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      {/* HEADER */}
      <Header />

      <div className="login-page">

        <div className="login-box">

          <h2>Create Your Account</h2>

          <form onSubmit={handleSignup}>

            {/* USERNAME */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="cta-btn">
              Sign Up
            </button>

          </form>

          <Link to="/login">
            <p className="back-link1">Already have an account? Login</p>
          </Link>

          <Link to="/">
            <p className="back-link">← Back to Home</p>
          </Link>

        </div>

      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Signup;