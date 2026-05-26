import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

function Header() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const navigate = useNavigate();

  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const storedUsername =
      localStorage.getItem("username");

    const storedProfilePic =
      localStorage.getItem("profilePic");

    if (token && storedUsername) {
      setUsername(storedUsername);
    }

    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }

  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {

    // Remove EVERYTHING
    localStorage.clear();

    // Redirect to login
    navigate("/login");

  };

  return (
    <div className="header-wrapper">

      {username && (
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>

          <div className="sidebar-header">
            <h2 className="sidebar-logo">Agentic Career Planner</h2>
            <button className="close-btn" onClick={toggleSidebar}>✖</button>
          </div>

          <ul>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/carrierinsights">Career Insights</Link></li>
            <li><Link to="/skillgap">Skill Gap</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/resumebuilder">Resume Builder</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>

        </aside>
      )}

      <nav className="top-header">

        {username && (
          <button className="menu-icon" onClick={toggleSidebar}>
            ☰
          </button>
        )}

        <h1 className="app-title">
          <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
            Agentic Career Planner
          </Link>
        </h1>

        {!username ? (

          <div className="profile-btn">

            <Link to="/login">
              <button className="logout-btn">Login</button>
            </Link>

            <Link to="/">
              <button className="logout-btn">Home</button>
            </Link>

          </div>

        ) : (

          <div className="profile-btn">

            <span className="welcome-text">
              Welcome, {username}
            </span>

            <Link to="/settings">
              <img
                src={profilePic || "/logo.jpg"}
                alt="Profile"
                className="profile-pic"
              />
            </Link>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>

          </div>

        )}

      </nav>

    </div>
  );
}

export default Header;