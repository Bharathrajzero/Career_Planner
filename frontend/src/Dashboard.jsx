import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Header from "./Header";
import Footer from "./Footer";
import Achievements from "./Achievements";
import LearningStreak from "./LearningStreak";

function Dashboard() {

  /* ================= USER DATA ================= */

  const email =
    localStorage.getItem("email");

  const username =
    localStorage.getItem("username") ||
    (email
      ? email.split("@")[0]
      : "User");

  const profilePic =
    localStorage.getItem("profilePic");

  /* ================= STATES ================= */

  const [progressPercent, setProgressPercent] =
    useState(0);

  const [tasksProgress, setTasksProgress] =
    useState(0);

  const [coursesProgress, setCoursesProgress] =
    useState(0);

  const [skillGapProgress, setSkillGapProgress] =
    useState(0);

  const [resumeProgress, setResumeProgress] =
    useState(0);

  /* 🔥 DEFAULT INSIGHTS = 100 */

  const [insightsProgress, setInsightsProgress] =
    useState(
      Number(localStorage.getItem("insightsProgress")) || 100
    );

  /* ================= LOAD TASK PROGRESS ================= */

  useEffect(() => {

    if (!email) return;

    fetch(
      `http://localhost:5000/get-tasks/${email}`
    )
      .then(res => res.json())
      .then(data => {

        if (data.success) {

          const tasks = data.data;

          let totalTarget = 0;
          let totalSpent = 0;

          tasks.forEach(task => {

            totalTarget += Number(
              task.targetSeconds
            );

            totalSpent += Number(
              task.spentSeconds
            );

          });

          const progress =
            totalTarget === 0
              ? 0
              : Math.round(
                  (totalSpent / totalTarget) * 100
                );

          setTasksProgress(progress);

          localStorage.setItem(
            "tasksProgress",
            progress
          );

        }

      });

  }, [email]);

  /* ================= LOAD OTHER MODULES ================= */

  useEffect(() => {

    const loadProgress = () => {

      const courses =
        Number(localStorage.getItem("coursesProgress")) || 0;

      const skillgap =
        Number(localStorage.getItem("skillGapProgress")) || 0;

      const resume =
        Number(localStorage.getItem("resumeProgress")) || 0;

      /* 🔥 FORCE INSIGHTS = 100 */

      const insights =
        Number(localStorage.getItem("insightsProgress")) || 100;

      setCoursesProgress(courses);
      setSkillGapProgress(skillgap);
      setResumeProgress(resume);
      setInsightsProgress(insights);

      /* Ensure stored */

      localStorage.setItem(
        "insightsProgress",
        insights
      );

    };

    /* Load immediately */

    loadProgress();

    /* Listen for updates */

    window.addEventListener(
      "progressUpdated",
      loadProgress
    );

    return () => {

      window.removeEventListener(
        "progressUpdated",
        loadProgress
      );

    };

  }, []);

  /* ================= CALCULATE TOTAL ================= */

  useEffect(() => {

    const weights = {

      tasks: 30,
      courses: 25,
      skillgap: 20,
      resume: 15,
      insights: 10

    };

    const totalProgress =

      (tasksProgress * weights.tasks) / 100 +
      (coursesProgress * weights.courses) / 100 +
      (skillGapProgress * weights.skillgap) / 100 +
      (resumeProgress * weights.resume) / 100 +
      (insightsProgress * weights.insights) / 100;

    setProgressPercent(
      Math.round(totalProgress)
    );

  }, [

    tasksProgress,
    coursesProgress,
    skillGapProgress,
    resumeProgress,
    insightsProgress

  ]);

  return (

    <>

      <Header />

      <div className="dashboard-content">

        <div className="profile-summary">

          <div className="profile-header">

            <div className="profile-info">

              <Link to="/settings">

                <img
                  src={
                    profilePic ||
                    "/logo.jpg"
                  }
                  alt="Profile"
                  className="profile-avatar-img"
                />

              </Link>

              <div>

                <div className="profile-name">
                  {username}
                </div>

                <div className="profile-role">
                  {email}
                </div>

              </div>

            </div>

            <LearningStreak />

          </div>

          <div className="progress-section">

            <h3>
              Overall Progress: {progressPercent}%
            </h3>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width:
                    `${progressPercent}%`
                }}
              ></div>

            </div>

          </div>

          <Achievements
            overallProgress={
              progressPercent
            }
          />

        </div>

        <section className="dashboard-cards">

          <div className="card gradient-card">

            <h3>
              📊 Career Insights
              ({insightsProgress}%)
            </h3>

            <p>
              AI-powered recommendations
              tailored to your goals.
            </p>

            <Link
              to="/carrierinsights"
              className="secondary-btn"
            >
              View Insights
            </Link>

          </div>

          <div className="card gradient-card">

            <h3>
              🧩 Skill Gap
              ({skillGapProgress}%)
            </h3>

            <p>
              Identify missing skills.
            </p>

            <Link
              to="/skillgap"
              className="secondary-btn"
            >
              Analyze Skill
            </Link>

          </div>

          <div className="card gradient-card">

            <h3>
              🎯 Courses
              ({coursesProgress}%)
            </h3>

            <p>
              Track learning milestones.
            </p>

            <Link
              to="/courses"
              className="secondary-btn"
            >
              View Goals
            </Link>

          </div>

          <div className="card gradient-card">

            <h3>
              📝 Tasks
              ({tasksProgress}%)
            </h3>

            <p>
              Track assignments.
            </p>

            <Link
              to="/tasks"
              className="secondary-btn"
            >
              View Tasks
            </Link>

          </div>

          <div className="card gradient-card">

            <h3>
              📄 Resume Builder
              ({resumeProgress}%)
            </h3>

            <p>
              Build professional resumes.
            </p>

            <Link
              to="/resumebuilder"
              className="secondary-btn"
            >
              Build Resume
            </Link>

          </div>
          <div className="card gradient-card">

            <h3>
              📄 Resume Analyzer (ATS)
            </h3>

            <p>
              Analyze resume and get ATS score.
            </p>

            <Link
              to="/resumeanalyzer"
              className="secondary-btn"
            >
              Analyze Resume
            </Link>

          </div>

        </section>

      </div>

      <Footer />

    </>

  );

}

export default Dashboard;