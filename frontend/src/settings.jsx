import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { useState, useEffect } from "react";

function Settings() {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {

    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPic = localStorage.getItem("profilePic");

    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
    if (storedPic) setPreview(storedPic);

  }, []);

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }

  };

  const handleUpdate = async (e) => {

    e.preventDefault();

    try {

      const formData = new FormData();

      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await fetch("http://localhost:5000/update-profile", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {

        localStorage.setItem("username", username);

        if (data.profilePic) {
          localStorage.setItem("profilePic", data.profilePic);
          setPreview(data.profilePic); // update preview to real URL
        }

        alert("Profile Updated Successfully");

      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
      alert("Server Error");
    }

  };

  return (
    <div className="settings-page">

      <Header username={username} profilePic={preview} />

      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your profile, preferences, and application settings.</p>
      </header>

      {/* Profile Section */}
      <section className="settings-section">
        <h2>Profile</h2>

        <form className="settings-form" onSubmit={handleUpdate}>

          {/* Profile Picture */}
          <div className="profile-pic-container">

            <img
              src={preview || "https://via.placeholder.com/120"}
              alt="profile"
              className="profile-preview"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

          </div>

          <label>
            Full Name:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            New Password:
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button type="submit" className="primary-btn">
            Update Profile
          </button>

        </form>
      </section>

      {/* Preferences */}
      <section className="settings-section">
        <h2>Preferences</h2>

        <form className="settings-form">

          <label>
            Theme:
            <select>
              <option>Light</option>
              <option>Dark</option>
              <option>System Default</option>
            </select>
          </label>

          <label>
            Notifications:
            <select>
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </label>

          <button type="submit" className="primary-btn">
            Save Preferences
          </button>

        </form>
      </section>

      {/* Security */}
      <section className="settings-section">
        <h2>Security</h2>

        <ul className="security-list">
          <li>🔒 Two-Factor Authentication <button className="secondary-btn">Enable</button></li>
          <li>📱 Manage Devices <button className="secondary-btn">View Devices</button></li>
          <li>🛡️ Account Recovery Options <button className="secondary-btn">Update</button></li>
        </ul>

      </section>

      {/* Application */}
      <section className="settings-section">
        <h2>Application</h2>

        <ul className="app-settings-list">
          <li>🌐 Language: English</li>
          <li>📅 Timezone: IST</li>
          <li>🔔 Internship Progress Reminders: Enabled</li>
        </ul>

      </section>

      <Footer />

    </div>
  );
}

export default Settings;