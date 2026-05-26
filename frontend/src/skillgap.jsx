import { useState, useEffect } from "react";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";

function SkillGap() {

  /* ================= USER ================= */

  const email =
    localStorage.getItem("email");

  const username =
    localStorage.getItem("username") ||
    (email
      ? email.split("@")[0]
      : "User");

  /* ================= CAREER SKILLS ================= */

  const careerRoles = {

    "AI Engineer": [

      { name: "Python", required: 4, importance: 5 },
      { name: "Machine Learning", required: 4, importance: 5 },
      { name: "Deep Learning", required: 3, importance: 4 },
      { name: "Cloud Deployment", required: 3, importance: 4 },
      { name: "Data Structures", required: 3, importance: 3 },

    ],

    "Full-Stack Developer": [

      { name: "HTML", required: 4, importance: 4 },
      { name: "CSS", required: 4, importance: 4 },
      { name: "JavaScript", required: 4, importance: 5 },
      { name: "React", required: 4, importance: 5 },
      { name: "Node.js", required: 3, importance: 4 },

    ],

  };

  /* ================= STATES ================= */

  const [targetRole,
    setTargetRole] =
    useState(
      localStorage.getItem(
        "selectedCareer"
      ) || "AI Engineer"
    );

  const [userSkills,
    setUserSkills] =
    useState({});

  /* ================= LOAD SKILLS ================= */

  useEffect(() => {

    if (!email) return;

    fetch(
      `http://localhost:5000/get-skills/${email}`
    )
      .then(res => res.json())
      .then(data => {

        if (
          data.success &&
          data.data.length > 0
        ) {

          const latest =
            data.data[
              data.data.length - 1
            ];

          setTargetRole(
            latest.targetRole
          );

          setUserSkills(
            JSON.parse(
              latest.skills
            )
          );

        }

      })
      .catch(err =>
        console.error(err)
      );

  }, [email]);

  /* ================= SAVE ROLE ================= */

  useEffect(() => {

    localStorage.setItem(
      "selectedCareer",
      targetRole
    );

  }, [targetRole]);

  const requiredSkills =
    careerRoles[targetRole];

  /* ================= SKILL CHANGE ================= */

  const handleSkillChange =
    (skillName, level) => {

      setUserSkills({

        ...userSkills,

        [skillName]:
          parseInt(level)

      });

    };

  /* ================= GAP ANALYSIS ================= */

  const gapAnalysis =
    requiredSkills

      .map(skill => {

        const current =
          userSkills[
            skill.name
          ] || 0;

        const gap =
          skill.required -
          current;

        const priorityScore =
          gap * skill.importance;

        return {

          ...skill,
          current,
          gap,
          priorityScore

        };

      })

      .sort(

        (a, b) =>

          b.priorityScore -
          a.priorityScore

      );

  /* ================= READINESS ================= */

  const totalRequired =
    requiredSkills.reduce(

      (sum, skill) =>

        sum + skill.required,

      0

    );

  const totalCurrent =
    requiredSkills.reduce(

      (sum, skill) =>

        sum +

        (userSkills[
          skill.name
        ] || 0),

      0

    );

  const readiness =

    totalRequired === 0

      ? 0

      : Math.round(

          (totalCurrent /

            totalRequired)

          * 100

        );

  /* ================= SAVE TO DASHBOARD ================= */

  useEffect(() => {

    localStorage.setItem(

      "skillGapProgress",

      readiness

    );

    /* Notify Dashboard */

    window.dispatchEvent(

      new Event(
        "progressUpdated"
      )

    );

  }, [readiness]);

  /* ================= SAVE TO BACKEND ================= */

  const saveSkillsToBackend =
    async () => {

      try {

        const res =
          await fetch(

            "http://localhost:5000/save-skills",

            {

              method: "POST",

              headers: {

                "Content-Type":

                  "application/json"

              },

              body:

                JSON.stringify({

                  email,

                  targetRole,

                  skills:

                    userSkills,

                  readiness

                })

            }

          );

        const data =
          await res.json();

        if (data.success) {

          alert(

            "Skill progress saved successfully!"

          );

        }

      } catch (error) {

        console.error(error);

        alert("Error saving skills");

      }

    };

  /* ================= UI ================= */

  return (

    <div className="skillgap-page">

      <Header username={username} />

      {/* HEADER */}

      <header className="skillgap-header">

        <h1>

          Smart Skill Gap Analyzer

        </h1>

        <p>

          Select your skill levels and see what to improve.

        </p>

      </header>

      {/* ROLE */}

      <section className="role-section">

        <h2>

          Select Target Career

        </h2>

        <div className="role-grid">

          {Object.keys(

            careerRoles

          ).map(

            (role, i) => (

              <div

                key={i}

                className={`role-card ${
                  targetRole === role
                    ? "selected"
                    : ""
                }`}

                onClick={() =>
                  setTargetRole(role)
                }

              >

                <p>

                  {role}

                </p>

              </div>

            )

          )}

        </div>

      </section>

      {/* SKILLS */}

      <section className="skills-input">

        <h2>

          Rate Your Skills

          (1 Beginner → 5 Expert)

        </h2>

        {requiredSkills.map(

          (skill, index) => (

            <div

              key={index}

              className="skill-row"

            >

              <span className="skill-name">

                {skill.name}

              </span>

              <select

                value={

                  userSkills[
                    skill.name
                  ] || 0

                }

                onChange={(e) =>

                  handleSkillChange(

                    skill.name,

                    e.target.value

                  )

                }

              >

                <option value={0}>0</option>
                <option value={1}>1 Beginner</option>
                <option value={2}>2 Basic</option>
                <option value={3}>3 Intermediate</option>
                <option value={4}>4 Advanced</option>
                <option value={5}>5 Expert</option>

              </select>

              <span className="required-level">

                Required:

                {skill.required}

              </span>

            </div>

          )

        )}

        {/* SAVE BUTTON */}

        <button

          className="save-skill-btn"

          onClick={saveSkillsToBackend}

        >

          Save Skills

        </button>

      </section>

      {/* READINESS */}

      <section className="readiness-section">

        <h2>

          Job Readiness

        </h2>

        <div className="progress-bar">

          <div

            className="progress-fill"

            style={{

              width:

                `${readiness}%`

            }}

          ></div>

        </div>

        <p>

          {readiness}% Ready for

          {targetRole}

        </p>

      </section>

      <Footer />

    </div>

  );

}

export default SkillGap;