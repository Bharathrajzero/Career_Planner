import { useEffect, useState } from "react";

function Achievements({ overallProgress }) {

  const [badges, setBadges] = useState([]);

  useEffect(() => {

    const tasks =
      Number(localStorage.getItem("tasksProgress")) || 0;

    const resume =
      Number(localStorage.getItem("resumeProgress")) || 0;

    const earnedBadges = [];

    /* TASK BADGES */

    if (tasks >= 25)
      earnedBadges.push("🥉 Beginner Learner");

    if (tasks >= 50)
      earnedBadges.push("🥈 Intermediate Learner");

    if (tasks >= 75)
      earnedBadges.push("🥇 Advanced Learner");

    /* RESUME BADGE */

    if (resume === 100)
      earnedBadges.push("📄 Resume Ready");

    /* OVERALL BADGE */

    if (overallProgress >= 80)
      earnedBadges.push("🏆 Internship Ready");

    setBadges(earnedBadges);

  }, [overallProgress]);

  return (

    <div className="achievements-section">

      <h2>🏆 Achievements</h2>

      {badges.length === 0 ? (

        <p>
          No badges earned yet.
        </p>

      ) : (

        <div className="badges-grid">

          {badges.map((badge, index) => (

            <div
              key={index}
              className="badge-card"
            >
              {badge}
            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default Achievements;