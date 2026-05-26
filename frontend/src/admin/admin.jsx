import { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../AdminHeader";
import Footer from "../Footer";
import "../App.css";

function AdminPage() {

  /* ================= STATES ================= */

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  const [searchUser, setSearchUser] =
    useState("");

  const [searchCourse, setSearchCourse] =
    useState("");

  const [newUser, setNewUser] =
    useState({
      username: "",
      email: ""
    });

  const [newCourse, setNewCourse] =
    useState({
      title: "",
      description: "",
      career: "",
      skillGap: "",
      link: ""
    });

  const [editingUserId,
    setEditingUserId] = useState(null);

  const [editingCourseId,
    setEditingCourseId] = useState(null);

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/admin/users"
        );

      if (res.data.success) {

        setUsers(res.data.users);

      }

    } catch (err) {

      console.error(err);

    }

  };

  /* ================= FETCH COURSES ================= */

  const fetchCourses = async () => {

    try {

      const res =
        await axios.get(
          "http://localhost:5000/admin/courses"
        );

      if (res.data.success) {

        setCourses(res.data.courses);

      }

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchUsers();
    fetchCourses();

  }, []);

  /* ================= USER CRUD ================= */

  const addUser = async () => {

    try {

      await axios.post(
        "http://localhost:5000/admin/users",
        newUser
      );

      fetchUsers();

      setNewUser({
        username: "",
        email: ""
      });

    } catch {

      alert("Add User Failed");

    }

  };

  const deleteUser = async (id) => {

    if (!window.confirm(
      "Delete this user?"
    )) return;

    try {

      await axios.delete(
        `http://localhost:5000/admin/users/${id}`
      );

      fetchUsers();

    } catch {

      alert("Delete Failed");

    }

  };

  const updateUser = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/admin/users/${id}`,
        newUser
      );

      setEditingUserId(null);

      fetchUsers();

    } catch {

      alert("Update Failed");

    }

  };

  /* ================= COURSE CRUD ================= */

  const addCourse = async () => {

    try {

      await axios.post(
        "http://localhost:5000/admin/courses",
        newCourse
      );

      fetchCourses();

      setNewCourse({
        title: "",
        description: "",
        career: "",
        skillGap: "",
        link: ""
      });

    } catch {

      alert("Add Course Failed");

    }

  };

  const deleteCourse = async (id) => {

    if (!window.confirm(
      "Delete this course?"
    )) return;

    try {

      await axios.delete(
        `http://localhost:5000/admin/courses/${id}`
      );

      fetchCourses();

    } catch {

      alert("Delete Failed");

    }

  };

  const updateCourse = async (id) => {

    try {

      await axios.put(
        `http://localhost:5000/admin/courses/${id}`,
        newCourse
      );

      setEditingCourseId(null);

      fetchCourses();

    } catch {

      alert("Update Failed");

    }

  };

  /* ================= SEARCH ================= */

  const filteredUsers =
    users.filter(u =>
      u.username
        .toLowerCase()
        .includes(
          searchUser.toLowerCase()
        )
    );

  const filteredCourses =
    courses.filter(c =>
      c.title
        .toLowerCase()
        .includes(
          searchCourse.toLowerCase()
        )
    );

  return (

    <>

      <AdminHeader />

      <div className="admin-dashboard">

        <h1>
          🛠 Admin Dashboard
        </h1>

        {/* ================= USERS ================= */}

        <h2>
          👥 Manage Users
        </h2>

        <input
          type="text"
          placeholder="Search Users..."
          value={searchUser}
          onChange={(e) =>
            setSearchUser(
              e.target.value
            )
          }
          className="search-input"
        />

        {/* ADD USER */}

        <div className="admin-form">

          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                username: e.target.value
              })
            }
          />

          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value
              })
            }
          />

          <button
            className="cta-btn"
            onClick={addUser}
          >
            Add User
          </button>

        </div>

        {/* USERS TABLE */}

        <table className="admin-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Profile</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.map(u => (

              <tr key={u.id}>

                <td>{u.id}</td>

                <td>{u.username}</td>

                <td>{u.email}</td>

                <td>

                  {u.profile_pic ? (

                    <img
                      src={`http://localhost:5000/uploads/${u.profile_pic}`}
                      width="40"
                      alt="profile"
                    />

                  ) : "No Pic"}

                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteUser(u.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {/* ================= COURSES ================= */}

        <h2>
          📚 Manage Courses
        </h2>

        <input
          type="text"
          placeholder="Search Courses..."
          value={searchCourse}
          onChange={(e) =>
            setSearchCourse(
              e.target.value
            )
          }
          className="search-input"
        />

        {/* ADD COURSE */}

        <div className="admin-form">

          <input
            type="text"
            placeholder="Title"
            value={newCourse.title}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                title: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                description: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Career"
            value={newCourse.career}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                career: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Skill Gap"
            value={newCourse.skillGap}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                skillGap: e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="YouTube Link"
            value={newCourse.link}
            onChange={(e) =>
              setNewCourse({
                ...newCourse,
                link: e.target.value
              })
            }
          />

          <button
            className="cta-btn"
            onClick={addCourse}
          >
            Add Course
          </button>

        </div>

        {/* COURSE LIST */}

        <ul className="course-list">

          {filteredCourses.map(c => (

            <li key={c.id}>

              <strong>
                {c.title}
              </strong>

              {" — "}

              {c.description}

              <button
                className="delete-btn"
                onClick={() =>
                  deleteCourse(c.id)
                }
              >
                Delete
              </button>

            </li>

          ))}

        </ul>

      </div>

      <Footer />

    </>

  );

}

export default AdminPage;