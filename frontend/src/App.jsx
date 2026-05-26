import { Link } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";

function App() {
  return (
    <div className="homepage">

      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <h1>Build a Career You’re Proud Of 🚀</h1>
          <p>
            AI-powered personalized roadmaps that transform ambition
            into real-world career success.
          </p>

          <div className="hero-buttons">
            <Link to="/login">
              <button className="primary-btn">Start Free</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>

          <div className="grid">
            <div className="card">
              <h3>AI Career Analysis</h3>
              <p>Smart recommendations tailored to your goals.</p>
            </div>

            <div className="card">
              <h3>Personalized Roadmap</h3>
              <p>Clear step-by-step structured learning path.</p>
            </div>

            <div className="card">
              <h3>Progress Tracking</h3>
              <p>Monitor milestones and stay motivated.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section alt-bg">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <div className="grid">
            <div className="card">
              <h3>1. Sign Up</h3>
              <p>Create your free account instantly.</p>
            </div>

            <div className="card">
              <h3>2. Set Goals</h3>
              <p>Select your career interests and ambitions.</p>
            </div>

            <div className="card">
              <h3>3. Follow Plan</h3>
              <p>Track progress and achieve milestones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="section">
        <div className="container about-section">
          <h2 className="section-title">About Us</h2>
          <p className="about-text">
            Agentic Career Planner is built to help students and professionals
            eliminate confusion and build structured, goal-oriented career paths.
            Our AI-driven system transforms ambition into clear action steps,
            helping you stay competitive in today’s fast-changing industry.
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Start Your Career Transformation Today</h2>
          <Link to="/signup">
            <button className="primary-btn large">
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* AVAILABILITY */}
      <section className="availability">
        <div className="container">
          <h2>Our Availability</h2>
          <p>
            🌍 Available Worldwide <br />
            💻 24/7 AI Support <br />
            ☁ Cloud-Based & Secure Platform
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;