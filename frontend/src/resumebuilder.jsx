import "./App.css";
import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "./Header";
import Footer from "./Footer";

function Resume() {

  const resumeRef = useRef();

  const [data, setData] = useState({

    fullName: "",
    jobTitle: "",

    phone: "",
    email: "",
    address: "",
    website: "",

    profile: "",

    skills: "",
    languages: "",

    experience: "",
    education: "",

    referenceName: "",
    referenceRole: "",
    referencePhone: "",
    referenceEmail: ""

  });

  /* ================= LOAD ================= */

  useEffect(() => {

    const saved =
      localStorage.getItem("resumeData");

    if (saved) {

      setData(
        JSON.parse(saved)
      );

    }

  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {

    localStorage.setItem(
      "resumeData",
      JSON.stringify(data)
    );

  }, [data]);

  /* ================= HANDLE ================= */

  const handleChange = (e) => {

    setData({

      ...data,
      [e.target.name]:
        e.target.value

    });

  };

  /* ================= RESUME PROGRESS ================= */

  useEffect(() => {

    const fields = [

      data.fullName,
      data.jobTitle,

      data.phone,
      data.email,
      data.address,
      data.website,

      data.profile,

      data.skills,
      data.languages,

      data.experience,
      data.education

    ];

    const filledFields =
      fields.filter(
        field =>
          field &&
          field.trim() !== ""
      ).length;

    const totalFields =
      fields.length;

    const progress =
      Math.round(
        (filledFields / totalFields) * 100
      );

    /* SAVE TO DASHBOARD */

    localStorage.setItem(
      "resumeProgress",
      progress
    );

  }, [data]);

  /* ================= AI SAMPLE ================= */

  const generateAI = () => {

    setData({

      fullName: "BHARATH RAJ",
      jobTitle: "MARKETING MANAGER",

      phone: "+124-4236-7894",
      email: "hello@bharath.com",
      address: "123 Any City",
      website: "www.bharath.com",

      profile:
        "Motivated professional with strong leadership and strategic planning abilities.",

      skills:
        "Strategic Planning\nProblem Solving\nCreative Thinking\nData Analysis",

      languages:
        "English\nHindi",

      experience:
        "Marketing Manager - Borcelle Studio (2030 - Present)\nManaged campaigns\nImproved team productivity",

      education:
        "MBA - Wardiere University\n2029 - 2031",

      referenceName: "Estelle Darcy",
      referenceRole: "CTO",
      referencePhone: "+124-4236-7894",
      referenceEmail: "hello@bharath.com"

    });

  };

  /* ================= PDF FIX ================= */

  const downloadPDF = async () => {

    const element =
      resumeRef.current;

    const canvas =
      await html2canvas(element, {

        scale: 2,
        useCORS: true

      });

    const imgData =
      canvas.toDataURL("image/png");

    const pdf =
      new jsPDF("p", "mm", "a4");

    const imgWidth = 210;

    const imgHeight =
      (canvas.height * imgWidth) /
      canvas.width;

    let heightLeft =
      imgHeight;

    let position = 0;

    pdf.addImage(

      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight

    );

    heightLeft -= 297;

    while (heightLeft > 0) {

      position =
        heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(

        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight

      );

      heightLeft -= 297;

    }

    pdf.save(

      `${data.fullName || "Resume"}.pdf`

    );

  };

  /* ================= LIST ================= */

  const renderList = (text) =>

    text
      ?.split("\n")
      .map((item, i) =>

        item.trim()

          ? <li key={i}>
              {item}
            </li>

          : null

      );

  return (

    <div>

      <Header />

      <div className="resume-container">

        {/* FORM */}

        <div className="resume-form">

          <h2>Resume Builder</h2>

          <button
            className="ai-btn"
            onClick={generateAI}
          >
            Generate AI Resume
          </button>

          <input
            name="fullName"
            placeholder="Full Name"
            value={data.fullName}
            onChange={handleChange}
          />

          <input
            name="jobTitle"
            placeholder="Job Title"
            value={data.jobTitle}
            onChange={handleChange}
          />

          <input
            name="phone"
            placeholder="Phone"
            value={data.phone}
            onChange={handleChange}
          />

          <input
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            value={data.address}
            onChange={handleChange}
          />

          <input
            name="website"
            placeholder="Website"
            value={data.website}
            onChange={handleChange}
          />

          <textarea
            name="profile"
            placeholder="Profile"
            value={data.profile}
            onChange={handleChange}
          />

          <textarea
            name="skills"
            placeholder="Skills"
            value={data.skills}
            onChange={handleChange}
          />

          <textarea
            name="languages"
            placeholder="Languages"
            value={data.languages}
            onChange={handleChange}
          />

          <textarea
            name="experience"
            placeholder="Experience"
            value={data.experience}
            onChange={handleChange}
          />

          <textarea
            name="education"
            placeholder="Education"
            value={data.education}
            onChange={handleChange}
          />

          <button
            onClick={downloadPDF}
            className="download-btn"
          >
            Download PDF
          </button>

        </div>

        {/* PREVIEW */}

        <div
          className="resume-preview"
          ref={resumeRef}
        >

          {/* HEADER */}

          <div className="resume-header">

            <h1>
              {data.fullName || "BHARATH RAJ"}
            </h1>

            <h2>
              {data.jobTitle || "MARKETING MANAGER"}
            </h2>
          <hr/>
          </div>

          <div className="resume-body">

            {/* LEFT */}

            <div className="left-side">

              <h3>CONTACT</h3>

              <p>📞 {data.phone}</p>
              <p>✉ {data.email}</p>
              <p>📍 {data.address}</p>
              <p>🌐 {data.website}</p>

              <h3>SKILLS</h3>

              <ul>
                {renderList(data.skills)}
              </ul>

              <h3>LANGUAGES</h3>

              <ul>
                {renderList(data.languages)}
              </ul>

            </div>

            {/* RIGHT */}

            <div className="right-side">

              <div className="timeline-line"></div>

              <div className="timeline-block">

                <div className="circle">👤</div>

                <div className="content">

                  <h3>PROFILE</h3>

                  <p>
                    {data.profile}
                  </p>

                </div>

              </div>

              <div className="timeline-block">

                <div className="circle">💼</div>

                <div className="content">

                  <h3>WORK EXPERIENCE</h3>

                  <ul>
                    {renderList(data.experience)}
                  </ul>

                </div>

              </div>

              <div className="timeline-block">

                <div className="circle">🎓</div>

                <div className="content">

                  <h3>EDUCATION</h3>

                  <ul>
                    {renderList(data.education)}
                  </ul>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

}

export default Resume;