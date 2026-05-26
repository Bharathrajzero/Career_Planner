import { useEffect, useState } from "react";

function LearningStreak() {

  const [streak, setStreak] = useState(0);

  useEffect(() => {

    const today =
      new Date().toDateString();

    const lastDate =
      localStorage.getItem("lastStudyDate");

    let currentStreak =
      Number(localStorage.getItem("learningStreak")) || 0;

    if (!lastDate) {

      /* First time user */

      localStorage.setItem(
        "lastStudyDate",
        today
      );

      localStorage.setItem(
        "learningStreak",
        1
      );

      setStreak(1);

      return;

    }

    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const yesterdayStr =
      yesterday.toDateString();

    if (lastDate === today) {

      /* Same day */

      setStreak(currentStreak);

    }

    else if (lastDate === yesterdayStr) {

      /* Continue streak */

      currentStreak += 1;

      localStorage.setItem(
        "learningStreak",
        currentStreak
      );

      localStorage.setItem(
        "lastStudyDate",
        today
      );

      setStreak(currentStreak);

    }

    else {

      /* Missed day → Reset */

      localStorage.setItem(
        "learningStreak",
        1
      );

      localStorage.setItem(
        "lastStudyDate",
        today
      );

      setStreak(1);

    }

  }, []);

  return (

    <div className="streak-card">

      <h2>🔥 Learning Streak</h2>

      <div className="streak-number">

        {streak} Day{streak > 1 ? "s" : ""}

      </div>

      <p>

        Keep learning daily to maintain your streak!

      </p>

    </div>

  );

}

export default LearningStreak;