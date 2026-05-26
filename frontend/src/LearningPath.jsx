import "./App.css";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";

function LearningPath() {

  /* ================= USER ================= */

  const email =
    localStorage.getItem("email");

  const username =
    localStorage.getItem("username") ||
    (email
      ? email.split("@")[0]
      : "User");

  /* ================= CAREER PARAM ================= */

  const { career } = useParams();

  /* ================= SAVE PROGRESS ================= */

  useEffect(() => {

    const existing =
      Number(
        localStorage.getItem(
          "learningProgress"
        )
      ) || 0;

    /* Only update once */

    if (existing !== 100) {

      localStorage.setItem(
        "learningProgress",
        100
      );

      /* Notify Dashboard */

      window.dispatchEvent(
        new Event("progressUpdated")
      );

    }

  }, []);

  /* ================= LEARNING PATH DATA ================= */

  const learningPaths = {

    "AI Engineer": [

      "Learn Python Programming",
      "Master Data Structures & Algorithms",
      "Learn Mathematics for Machine Learning",
      "Study Machine Learning Fundamentals",
      "Learn Deep Learning",
      "Master NLP and Generative AI",
      "Learn TensorFlow / PyTorch",
      "Build AI Projects",
      "Deploy AI Models",
      "Prepare for AI Engineer Interviews"

    ],

    "Data Scientist": [

      "Learn Python or R Programming",
      "Understand Statistics & Probability",
      "Learn Data Analysis with Pandas",
      "Master Data Visualization",
      "Learn SQL",
      "Study Machine Learning",
      "Work on Kaggle Datasets",
      "Build Data Science Projects",
      "Learn Business Intelligence Tools",
      "Prepare for Data Science Interviews"

    ],

    "Full-Stack Developer": [

      "Learn HTML, CSS, JavaScript",
      "Master React.js",
      "Learn Backend Development (Node.js)",
      "Understand REST APIs",
      "Learn Databases (MongoDB / SQL)",
      "Authentication & Security",
      "Build Full-Stack Projects",
      "Learn Git & GitHub",
      "Deploy Apps to Cloud",
      "Prepare for Developer Interviews"

    ],

    "Cloud Engineer": [

      "Learn Linux Fundamentals",
      "Understand Networking Basics",
      "Learn AWS / Azure / GCP",
      "Master Docker",
      "Learn Kubernetes",
      "Understand CI/CD",
      "Learn Terraform",
      "Build Cloud Deployment Projects",
      "Monitoring & Security",
      "Prepare for Cloud Certifications"

    ]

  };

  const steps =
    learningPaths[career] || [];

  /* ================= UI ================= */

  return (

    <div className="learning-page">

      <Header username={username} />

      {/* HEADER */}

      <div className="learning-header">

        <h1>
          {career} Learning Path
        </h1>

        <p>

          Follow this roadmap
          to become a professional
          {career}.

        </p>

      </div>

      {/* ROADMAP */}

      <section className="roadmap-section">

        <h2>
          Learning Roadmap
        </h2>

        <div className="roadmap-grid">

          {steps.map(

            (step, index) => (

              <div
                key={index}
                className="roadmap-card1"
              >

                <h3>
                  Step {index + 1}
                </h3>

                <p>
                  {step}
                </p>

              </div>

            )

          )}

        </div>

      </section>

      {/* TIPS */}

      <section className="career-tips">

        <h2>
          Career Preparation Tips
        </h2>

        <ul>

          <li>
            Build at least 3 real-world projects
          </li>

          <li>
            Maintain an active GitHub portfolio
          </li>

          <li>
            Practice coding daily
          </li>

          <li>
            Participate in hackathons
          </li>

          <li>
            Apply for internships early
          </li>

        </ul>

      </section>

      <Footer />

    </div>

  );

}

export default LearningPath;