import { useState } from "react";
import "./App.css";

function ResumeAnalyzer() {

  const [file, setFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const email = localStorage.getItem("email");

  const roles = [
    "AI Engineer",
    "Web Developer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer"
  ];

  const getScoreClass = () => {
    if (!result) return "";
    if (result.score < 40) return "score-low";
    if (result.score < 70) return "score-medium";
    return "score-high";
  };

  const handleUpload = async () => {
    if (!file || !jobRole) {
      alert("Upload resume and select job role");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole);
    formData.append("email", email);

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch("http://localhost:5000/analyze-resume", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      setResult(data);

      localStorage.setItem("resumeProgress", 100);
      window.dispatchEvent(new Event("progressUpdated"));

      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>📄 Resume Analyzer (ATS)</h2>

      {/* Upload Box */}
      <div className="upload-box">

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <select
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
        >
          <option value="">Select Job Role</option>
          {roles.map((role, i) => (
            <option key={i} value={role}>{role}</option>
          ))}
        </select>

        <button
          className="primary-btn"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

      </div>

      {/* Results */}
      {result && (
        <div className={`result-box ${getScoreClass()}`}>

          {/* Score */}
          <h3 className={getScoreClass()}>
            ATS Score: {result.score}%
          </h3>

          {/* Score Bar */}
          <div style={{
            background: "#e0e0e0",
            borderRadius: "8px",
            overflow: "hidden",
            margin: "10px 0 20px"
          }}>
            <div style={{
              width: `${result.score}%`,
              background: result.score >= 70
                ? "#4caf50"
                : result.score >= 40
                  ? "#ff9800"
                  : "#f44336",
              height: "12px",
              borderRadius: "8px",
              transition: "width 0.6s ease"
            }} />
          </div>

          {/* Matched Skills */}
          {result.matchedSkills && result.matchedSkills.length > 0 && (
            <>
              <h4>✅ Matched Skills:</h4>
              <ul>
                {result.matchedSkills.map((skill, i) => (
                  <li key={i} style={{ color: "green" }}>
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Missing Skills */}
          {result.missingSkills && result.missingSkills.length > 0 && (
            <>
              <h4>❌ Missing Skills:</h4>
              <ul>
                {result.missingSkills.map((skill, i) => (
                  <li key={i} style={{ color: "#c0392b" }}>
                    {skill}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <>
              <h4>💡 Suggestions:</h4>
              <ul>
                {result.suggestions.map((sug, i) => (
                  <li key={i}>{sug}</li>
                ))}
              </ul>
            </>
          )}

          {/* Perfect score message */}
          {result.score === 100 && (
            <p style={{ color: "green", fontWeight: "bold", marginTop: "10px" }}>
              🎉 Perfect match! Your resume is ATS-ready for this role.
            </p>
          )}

        </div>
      )}

    </div>
  );
}

export default ResumeAnalyzer;