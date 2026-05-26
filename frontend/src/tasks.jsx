import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import Footer from "./Footer";
import Header from "./Header";

function Tasks({ username = "Bharath" }) {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [targetHours, setTargetHours] = useState("");

  const intervalRef = useRef(null);

  const email =
    localStorage.getItem("email");

  /* ================= LOAD TASKS ================= */

  useEffect(() => {

    if (!email) return;

    fetch(
      `http://localhost:5000/get-tasks/${email}`
    )
      .then(res => res.json())
      .then(data => {

        if (data.success) {

          const formatted =
            data.data.map(task => ({

              ...task,
              isRunning: false,
              completed:
                task.completed === 1

            }));

          setTasks(formatted);

        }

      });

  }, [email]);

  /* ================= DASHBOARD PROGRESS ================= */

  const updateTasksProgress =
    useCallback(() => {

      if (tasks.length === 0) {

        localStorage.setItem(
          "tasksProgress",
          0
        );

        window.dispatchEvent(
          new Event(
            "progressUpdated"
          )
        );

        return;

      }

      let totalTarget = 0;
      let totalSpent = 0;

      tasks.forEach(task => {

        totalTarget +=
          task.targetSeconds;

        totalSpent +=
          task.spentSeconds;

      });

      const progress =

        totalTarget === 0

          ? 0

          : Math.round(

              (totalSpent /

               totalTarget) * 100

            );

      localStorage.setItem(
        "tasksProgress",
        progress
      );

      /* Notify Dashboard */

      window.dispatchEvent(
        new Event(
          "progressUpdated"
        )
      );

    }, [tasks]);

  useEffect(() => {

    updateTasksProgress();

  }, [tasks, updateTasksProgress]);

  /* ================= ADD TASK ================= */

  const addTask = async (e) => {

    e.preventDefault();

    if (!title || !targetHours)
      return;

    const targetSeconds =
      Number(targetHours) * 3600;

    const res =
      await fetch(
        "http://localhost:5000/add-task",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            email,
            title,
            targetSeconds

          })

        }
      );

    const data =
      await res.json();

    if (data.success) {

      const newTask = {

        id: data.id,
        title,
        targetSeconds,

        spentSeconds: 0,

        completed: false,
        isRunning: false

      };

      setTasks([
        ...tasks,
        newTask
      ]);

      setTitle("");
      setTargetHours("");

    }

  };

  /* ================= TIMER ================= */

  const startTimer = (id) => {

    stopAllTimers();

    setTasks(tasks.map(task =>

      task.id === id

        ? {
            ...task,
            isRunning: true
          }

        : task

    ));

    intervalRef.current =
      setInterval(() => {

        setTasks(prevTasks =>

          prevTasks.map(task => {

            if (

              task.id === id &&
              task.isRunning &&
              !task.completed

            ) {

              const newTime =
                task.spentSeconds + 1;

              if (

                newTime >=
                task.targetSeconds

              ) {

                updateTaskInDB(

                  task.id,

                  task.targetSeconds,

                  1

                );

                return {

                  ...task,

                  spentSeconds:
                    task.targetSeconds,

                  isRunning: false,

                  completed: true

                };

              }

              updateTaskInDB(

                task.id,

                newTime,

                0

              );

              return {

                ...task,

                spentSeconds: newTime

              };

            }

            return task;

          })

        );

      }, 1000);

  };

  const pauseTimer = (id) => {

    clearInterval(
      intervalRef.current
    );

    setTasks(tasks.map(task =>

      task.id === id

        ? {
            ...task,
            isRunning: false
          }

        : task

    ));

  };

  const stopAllTimers = () => {

    clearInterval(
      intervalRef.current
    );

    setTasks(prev =>

      prev.map(task => ({

        ...task,
        isRunning: false

      }))

    );

  };

  /* Cleanup */

  useEffect(() => {

    return () =>
      clearInterval(
        intervalRef.current
      );

  }, []);

  /* ================= UPDATE DATABASE ================= */

  const updateTaskInDB =
    async (
      id,
      spentSeconds,
      completed
    ) => {

      await fetch(

        "http://localhost:5000/update-task",

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            id,
            spentSeconds,
            completed

          })

        }

      );

    };

  /* ================= DELETE ================= */

  const deleteTask =
    async (id) => {

      stopAllTimers();

      await fetch(

        `http://localhost:5000/delete-task/${id}`,

        { method: "DELETE" }

      );

      setTasks(

        tasks.filter(

          task => task.id !== id

        )

      );

    };

  /* ================= FORMAT TIME ================= */

  const formatTime =
    (seconds) => {

      const hrs =
        Math.floor(
          seconds / 3600
        );

      const mins =
        Math.floor(
          (seconds % 3600) / 60
        );

      const secs =
        seconds % 60;

      return `${hrs}h ${mins}m ${secs}s`;

    };

  /* ================= ML FEATURE ================= */

  /* Learning Efficiency */

  const totalSpent =
    tasks.reduce(

      (sum, t) =>

        sum + t.spentSeconds,

      0

    );

  const totalTarget =
    tasks.reduce(

      (sum, t) =>

        sum + t.targetSeconds,

      0

    );

  const efficiency =

    totalTarget === 0

      ? 0

      : Math.round(

          (totalSpent /

           totalTarget) * 100

        );

  return (

    <div className="app-container">

      <Header username={username} />

      <main className="tasks-page">

        <h1>
          Task Tracker
        </h1>

        <p>
          Track your focused learning hours daily.
        </p>

        {/* ADD TASK */}

        <form

          className="task-form"

          onSubmit={addTask}

        >

          <input
            type="text"
            placeholder="Task Name"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Target Hours"
            value={targetHours}
            onChange={(e) =>
              setTargetHours(e.target.value)
            }
          />

          <button

            type="submit"

            className="primary-btn"

          >

            Add Learning Task

          </button>

        </form>

        {/* ML INSIGHT */}

        <div className="ml-insight">

          <h2>
            🧠 Learning Efficiency
          </h2>

          <p>

            Your efficiency score:

            <strong>

              {efficiency}%

            </strong>

          </p>

        </div>

        {/* TASK LIST */}

        <div className="tasks-grid">

          {tasks.length === 0 && (

            <p>
              No learning tasks added yet.
            </p>

          )}

          {tasks.map(task => {

            const progress =

              (task.spentSeconds /

               task.targetSeconds)

              * 100;

            return (

              <div

                className="task-card"

                key={task.id}

              >

                <h3>

                  {task.title}

                </h3>

                <p>

                  ⏱ Target:

                  {formatTime(
                    task.targetSeconds
                  )}

                </p>

                <p>

                  📈 Spent:

                  {formatTime(
                    task.spentSeconds
                  )}

                </p>

                <div className="progress-bar">

                  <div

                    className="progress-fill"

                    style={{

                      width:
                        `${progress}%`

                    }}

                  ></div>

                </div>

                {task.completed ? (

                  <p
                    style={{
                      color: "green"
                    }}
                  >

                    ✅ Completed

                  </p>

                ) : (

                  <div className="task-actions">

                    {!task.isRunning ? (

                      <button

                        className="complete-btn"

                        onClick={() =>

                          startTimer(task.id)

                        }

                      >

                        Start

                      </button>

                    ) : (

                      <button

                        className="primary-btn"

                        onClick={() =>

                          pauseTimer(task.id)

                        }

                      >

                        Pause

                      </button>

                    )}

                    <button

                      className="delete-btn"

                      onClick={() =>

                        deleteTask(task.id)

                      }

                    >

                      Delete

                    </button>

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </main>

      <Footer />

    </div>

  );

}

export default Tasks;