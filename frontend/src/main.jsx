import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Dashboard from "./Dashboard.jsx";
import CareerInsights from "./carrierinsights.jsx";
import SkillGap from "./skillgap.jsx";
import Courses from "./courses.jsx";
import Resume from "./resumebuilder.jsx";
import Settings from "./settings.jsx";
import Tasks from "./tasks.jsx";
import LearningPath from "./LearningPath.jsx";
import ResumeAnalyzer from "./ResumeAnalyzer";

import AdminLogin from "./admin/login.jsx";
import AdminPage from "./admin/admin.jsx";

import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminProtectedRoute from "./AdminProtectedRoute.jsx";

createRoot(
  document.getElementById("root")
).render(

  <StrictMode>

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<App />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* USER PROTECTED */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/carrierinsights"
          element={
            <ProtectedRoute>
              <CareerInsights />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skillgap"
          element={
            <ProtectedRoute>
              <SkillGap />
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resumebuilder"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning-path/:career"
          element={
            <ProtectedRoute>
              <LearningPath />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resumeanalyzer"
          element={<ResumeAnalyzer />}
        />

        {/* ADMIN PROTECTED */}

        <Route
          path="/admin/admin"
          element={
            <AdminProtectedRoute>
              <AdminPage />
            </AdminProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  </StrictMode>

);