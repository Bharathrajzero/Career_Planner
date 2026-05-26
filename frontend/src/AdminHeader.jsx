import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function AdminHeader() {

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {

    localStorage.removeItem("admin");

    navigate("/admin/login");

  };

  return (

    <div className="header-wrapper">

      {/* ADMIN SIDEBAR */}

      <aside
        className={`sidebar ${
          isSidebarOpen ? "open" : ""
        }`}
      >

        <div className="sidebar-header">

          <h2 className="sidebar-logo">
            Admin Panel
          </h2>

          <button
            className="close-btn"
            onClick={toggleSidebar}
          >
            ✖
          </button>

        </div>

        <ul>

          <li>
            <Link to="/admin">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              Users
            </Link>
          </li>

          <li>
            <Link to="/admin/courses">
              Courses
            </Link>
          </li>

          <li>
            <Link to="/admin/settings">
              Settings
            </Link>
          </li>

        </ul>

      </aside>

      {/* TOP BAR */}

      <nav className="top-header">

        <button
          className="menu-icon"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        <h1 className="app-title3">
          Agentic carrer planner
        </h1>

        <div className="profile-btn">

          <span className="welcometext">
            Admin
          </span>

          <img
            src="/admin.jpeg"
            alt="Admin"
            className="profile-pic"
          />

          <button
            onClick={handleLogout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

      </nav>

    </div>

  );

}

export default AdminHeader;