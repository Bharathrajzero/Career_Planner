import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function CareerInsights() {

  /* ================= USER DATA ================= */

  const email =
    localStorage.getItem("email");

  const username =
    localStorage.getItem("username") ||
    (email
      ? email.split("@")[0]
      : "User");

  /* ================= SAVE PAGE PROGRESS ================= */

  useEffect(() => {

    const existing =
      Number(
        localStorage.getItem(
          "insightsProgress"
        )
      ) || 0;

    if (existing !== 100) {

      localStorage.setItem(
        "insightsProgress",
        100
      );

      /* Notify Dashboard */

      window.dispatchEvent(
        new Event("progressUpdated")
      );

    }

  }, []);

  /* ================= SAVE SELECTED CAREER ================= */

  const saveCareerSelection =
    (careerTitle) => {

      /* Save selected career */

      localStorage.setItem(
        "selectedCareer",
        careerTitle
      );

      console.log(
        "Career Selected:",
        careerTitle
      );

    };

  /* ================= CAREER DATA ================= */

  const careerData = [

    {
      title: "AI Engineer",

      growth: "Very High (2026+)",

      salary:
        "$110,000 - $180,000 / year",

      description:
        "Designs and builds AI models, generative AI systems, and intelligent automation tools.",

      skills: [

        "Python",

        "Machine Learning",

        "Deep Learning",

        "NLP",

        "TensorFlow / PyTorch",

        "Prompt Engineering",

        "Data Structures & Algorithms"

      ]

    },

    {
      title: "Data Scientist",

      growth: "High",

      salary:
        "$95,000 - $150,000 / year",

      description:
        "Analyzes complex data to help organizations make strategic decisions.",

      skills: [

        "Python / R",

        "Statistics",

        "Machine Learning",

        "SQL",

        "Data Visualization",

        "Pandas / NumPy",

        "Business Intelligence"

      ]

    },

    {
      title: "Full-Stack Developer",

      growth: "Stable & Strong",

      salary:
        "$80,000 - $140,000 / year",

      description:
        "Builds complete web applications including frontend and backend systems.",

      skills: [

        "HTML, CSS, JavaScript",

        "React / Next.js",

        "Node.js / Express",

        "MongoDB / SQL",

        "REST APIs",

        "Git & GitHub",

        "Cloud Deployment"

      ]

    },

    {
      title: "Cloud Engineer",

      growth: "Rapid Growth",

      salary:
        "$100,000 - $160,000 / year",

      description:
        "Designs scalable cloud infrastructure and manages cloud-based systems.",

      skills: [

        "AWS / Azure / GCP",

        "Docker & Kubernetes",

        "DevOps Practices",

        "CI/CD Pipelines",

        "Linux",

        "Networking Basics",

        "Infrastructure as Code"

      ]

    }

  ];

  return (

    <div className="career-insights-page">

      <Header username={username} />

      {/* HEADER */}

      <header className="career-header">

        <h1>Career Insights</h1>

        <p>

          Personalized AI-powered career
          recommendations tailored
          for your growth journey.

        </p>

      </header>

      {/* ================= CAREERS ================= */}

      <section className="career-recommendations">

        <h2>

          Recommended Career Options

        </h2>

        <div className="recommendation-grid">

          {careerData.map((career, index) => (

            <div
              key={index}
              className="recommendation-card"
            >

              <h3>

                {career.title}

              </h3>

              <p className="career-description">

                {career.description}

              </p>

              <p>

                <strong>

                  📈 Growth:

                </strong>

                {" "}
                {career.growth}

              </p>

              <p>

                <strong>

                  💰 Salary Range:

                </strong>

                {" "}
                {career.salary}

              </p>

              <h4>

                🛠 Required Skills:

              </h4>

              <ul className="skills-list">

                {career.skills.map(

                  (skill, i) => (

                    <li key={i}>

                      {skill}

                    </li>

                  )

                )}

              </ul>

              <Link

                to={`/learning-path/${career.title}`}

                className="primary-btn"

                onClick={() =>
                  saveCareerSelection(
                    career.title
                  )
                }

              >

                Explore Learning Path

              </Link>

            </div>

          ))}

        </div>

      </section>

      {/* ================= TRENDS ================= */}

      <section className="career-trends">

        <h2>

          🌍 Industry Trends (2026)

        </h2>

        <ul>

          <li>

            AI & Generative AI transforming every industry.

          </li>

          <li>

            Cloud-first development becoming standard.

          </li>

          <li>

            Remote tech jobs increasing globally.

          </li>

          <li>

            Cybersecurity demand growing rapidly.

          </li>

          <li>

            Automation & DevOps skills becoming essential.

          </li>

        </ul>

      </section>

      {/* ================= SUGGESTIONS ================= */}

      <section className="career-suggestions">

        <h2>

          🎯 Personalized Suggestions for You

        </h2>

        <div className="suggestion-card">

          <h3>

            Strengthen React & Next.js

          </h3>

          <p>

            Build 3 production-ready projects
            to boost your full-stack portfolio.

          </p>

        </div>

        <div className="suggestion-card">

          <h3>

            Master DSA & Problem Solving

          </h3>

          <p>

            Practice 200+ coding problems
            to crack top tech interviews.

          </p>

        </div>

        <div className="suggestion-card">

          <h3>

            Get Cloud Certified

          </h3>

          <p>

            Start with AWS or Azure fundamentals
            to expand career opportunities.

          </p>

        </div>

      </section>

      <Footer />

    </div>

  );

}

export default CareerInsights;