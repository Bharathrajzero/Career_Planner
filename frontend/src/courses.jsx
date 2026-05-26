import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function Courses({ username = "Bharath", email = "braj90209@gmail.com" }) {

  const [joinedCourses, setJoinedCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= RECOMMENDED COURSES ================= */

  const recommendedCourses = [

    {
      id: 1,
      title: "Python for AI",
      career: "AI Engineer",
      skillGap: "Programming",
      progress: 0,
      description: "Learn Python programming for AI, ML and automation.",
      link: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    },

    {
      id: 2,
      title: "Machine Learning Fundamentals",
      career: "AI Engineer",
      skillGap: "Machine Learning",
      progress: 0,
      description: "Understand ML algorithms and data modeling.",
      link: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
    },

    {
      id: 3,
      title: "React Full-Stack Development",
      career: "Full-Stack Developer",
      skillGap: "Frontend Development",
      progress: 0,
      description: "Build modern web apps using React and APIs.",
      link: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    },

    {
      id: 4,
      title: "Cloud Computing with AWS",
      career: "Cloud Engineer",
      skillGap: "Cloud Platforms",
      progress: 0,
      description: "Learn AWS infrastructure and deployment.",
      link: "https://www.youtube.com/watch?v=ulprqHHWlng",
    },

    {
      id: 5,
      title: "Data Science with Python",
      career: "Data Scientist",
      skillGap: "Data Analysis",
      progress: 0,
      description: "Analyze and visualize data using Python.",
      link: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
    },

  ];

  /* ================= FETCH COURSES ================= */

  const fetchCourses = useCallback(async () => {

    if (!email) {

      setJoinedCourses([]);
      setCompletedCourses([]);
      setLoading(false);

      return;
    }

    try {

      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/get-courses/${encodeURIComponent(email)}`
      );

      if (res.data?.success) {

        setJoinedCourses(
          Array.isArray(res.data.joined)
            ? res.data.joined
            : []
        );

        setCompletedCourses(
          Array.isArray(res.data.completed)
            ? res.data.completed
            : []
        );

      } else {

        setJoinedCourses([]);
        setCompletedCourses([]);

        setError(
          res.data?.message ||
          "Failed to load courses."
        );

      }

    } catch (err) {

      console.error("Error fetching courses:", err);

      setError(
        "Unable to fetch courses. Please check backend/API."
      );

      setJoinedCourses([]);
      setCompletedCourses([]);

    } finally {

      setLoading(false);

    }

  }, [email]);

  useEffect(() => {

    fetchCourses();

  }, [fetchCourses]);

  /* ================= CALCULATE DASHBOARD PROGRESS ================= */

  const updateCoursesProgress = useCallback(() => {

    const totalCourses =
      recommendedCourses.length;

    const completed =
      completedCourses.length;

    const joined =
      joinedCourses.length;

    /* Weighted Calculation */

    const progress = Math.round(

      ((completed * 100) +
       (joined * 40))

      / (totalCourses * 100)

      * 100

    );

    /* Save to Dashboard */

    localStorage.setItem(
      "coursesProgress",
      progress
    );

  }, [
    joinedCourses,
    completedCourses
  ]);

  /* ================= AUTO UPDATE DASHBOARD ================= */

  useEffect(() => {

    if (!loading) {

      updateCoursesProgress();

    }

  }, [
    joinedCourses,
    completedCourses,
    loading,
    updateCoursesProgress
  ]);

  /* ================= JOIN COURSE ================= */

  const joinCourse = async (course) => {

    try {

      const alreadyJoined =
        joinedCourses.find(
          (c) =>
            Number(c.courseId) ===
            Number(course.id)
        );

      const alreadyCompleted =
        completedCourses.find(
          (c) =>
            Number(c.courseId) ===
            Number(course.id)
        );

      if (
        alreadyJoined ||
        alreadyCompleted
      ) {

        alert(
          "You already joined this course!"
        );

        return;

      }

      const res =
        await axios.post(
          "http://localhost:5000/join-course",
          {
            email,
            course,
          }
        );

      if (res.data?.success) {

        await fetchCourses();

        updateCoursesProgress();

        window.open(
          course.link,
          "_blank",
          "noopener,noreferrer"
        );

      } else {

        alert(
          res.data?.message ||
          "Failed to join course."
        );

      }

    } catch (err) {

      console.log(
        "Error joining course:",
        err
      );

      alert(
        "An error occurred while joining the course."
      );

    }

  };

  /* ================= COMPLETE COURSE ================= */

  const completeCourse = async (courseId) => {

    try {

      const confirmComplete =
        window.confirm(
          "Are you sure you want to mark this course as completed?"
        );

      if (!confirmComplete) return;

      const res =
        await axios.post(
          "http://localhost:5000/complete-course",
          {
            email,
            courseId,
          }
        );

      if (res.data?.success) {

        alert(
          "Your course has been marked as completed successfully."
        );

        await fetchCourses();

        updateCoursesProgress();

      } else {

        alert(
          res.data?.message ||
          "Failed to mark course as completed."
        );

      }

    } catch (err) {

      console.error(
        "Error completing course:",
        err
      );

      alert(
        "An error occurred while marking the course as completed."
      );

    }

  };

  /* ================= DELETE COURSE ================= */

  const deleteCourse = async (courseId) => {

    try {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this course?"
        );

      if (!confirmDelete) return;

      const res =
        await axios.delete(
          "http://localhost:5000/delete-course",
          {
            data: {
              email,
              courseId,
            },
          }
        );

      if (res.data?.success) {

        alert(
          "Your course has been deleted successfully."
        );

        await fetchCourses();

        updateCoursesProgress();

      } else {

        alert(
          res.data?.message ||
          "Failed to delete course."
        );

      }

    } catch (err) {

      console.error(
        "Error deleting course:",
        err
      );

      alert(
        "An error occurred while deleting the course."
      );

    }

  };

  return (

    <div className="courses-page">

      <Header username={username} />

      <header className="courses-header">

        <h1>Courses</h1>

        <p>
          Recommended courses based on your career insights.
        </p>

      </header>

      {loading && <p>Loading courses...</p>}

      {!loading && error && <p>{error}</p>}

      {/* ================= RECOMMENDED ================= */}

      <section className="courses-recommended">

        <h2>Recommended Courses</h2>

        <div className="courses-grid">

          {recommendedCourses.map((course) => (

            <div
              key={course.id}
              className="course-card"
            >

              <h3>{course.title}</h3>

              <p>{course.description}</p>

              <p>
                <strong>Career:</strong>
                {course.career}
              </p>

              <p>
                <strong>Skill Gap:</strong>
                {course.skillGap}
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  joinCourse(course)
                }
              >
                Join Course
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* ================= ACTIVE ================= */}

      <section className="coursesactive">

        <h2>My Active Courses</h2>

        {joinedCourses.length === 0 ? (

          <p>No active courses yet.</p>

        ) : (

          <div className="courses-grid">

            {joinedCourses.map((course) => (

              <div
                key={course.courseId}
                className="course-card"
              >

                <h3>{course.title}</h3>

                <p>{course.description}</p>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${course.progress || 0}%`
                    }}
                  ></div>

                </div>

                <p>
                  {course.progress || 0}% completed
                </p>

                <button
                  className="primary-btn5"
                  onClick={() =>
                    completeCourse(
                      course.courseId
                    )
                  }
                >
                  Mark Completed
                </button>

                <button
                  className="primary-btn5"
                  onClick={() =>
                    deleteCourse(
                      course.courseId
                    )
                  }
                >
                  Delete Course
                </button>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* ================= COMPLETED ================= */}

      <section className="courses-completed">

        <h2>Completed Courses</h2>

        {completedCourses.length === 0 ? (

          <p>No completed courses yet.</p>

        ) : (

          <ul>

            {completedCourses.map((course) => (

              <li
                key={
                  course.courseId ||
                  course.id
                }
              >

                ✔ {course.title}

              </li>

            ))}

          </ul>

        )}

      </section>

      <Footer />

    </div>

  );

}

export default Courses;