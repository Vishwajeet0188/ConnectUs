import React, { useState, useEffect } from "react";

function Dashboard() {
  const [showHistory, setShowHistory] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [userDetails, setUserDetails] = useState({
    name: localStorage.getItem("userName") || "Guest User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    phone: localStorage.getItem("userPhone") || "Not provided",
    age: localStorage.getItem("userAge") || "",
    gender: localStorage.getItem("userGender") || "",
    avatar: localStorage.getItem("userAvatar") || "https://ui-avatars.com/api/?name=" + encodeURIComponent(localStorage.getItem("userName") || "Guest") + "&background=8B5CF6&color=fff&size=128"
  });

  const [editForm, setEditForm] = useState({ ...userDetails });

  const getStressLevel = (score) => {
    if (score <= 10) return { text: "Healthy", color: "#10B981", light: "#D1FAE5", icon: "😊" };
    if (score <= 20) return { text: "Mild Stress", color: "#F59E0B", light: "#FEF3C7", icon: "😐" };
    if (score <= 30) return { text: "Moderate Stress", color: "#F97316", light: "#FFEDD5", icon: "😟" };
    return { text: "Severe Stress", color: "#EF4444", light: "#FEE2E2", icon: "😰" };
  };

  useEffect(() => {

    const checkExpiry = () => {

      const expiry = localStorage.getItem("loginExpiry");

      if (expiry && Date.now() > Number(expiry)) {

        localStorage.clear();

        alert("Session expired. Please login again.");

        window.location.href = "/login";
      }

    };

    checkExpiry();

    const interval = setInterval(checkExpiry, 60000);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {

    const fetchAssessments = async () => {

      try {

        const userId = localStorage.getItem("userId");

        console.log("Fetched User ID:", userId);

        if (!userId || userId === "undefined" || userId === "null") {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:8080/assesment/history/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }

        const data = await response.json();

        console.log("History Data:", data);

        if (!Array.isArray(data)) {
          setAssessments([]);
          return;
        }

        const sorted = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const formatted = sorted.map((a) => ({
          date: new Date(a.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          }),
          score: a.totalScore,
          ...getStressLevel(a.totalScore)
        }));

        setAssessments(formatted);

      } catch (error) {

        console.error("Error fetching history:", error);

      } finally {

        setLoading(false);

      }

    };

    const timer = setTimeout(() => {
      fetchAssessments();
    }, 300);

    return () => clearTimeout(timer);

  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    Object.keys(editForm).forEach(key => {
      localStorage.setItem(`user${key.charAt(0).toUpperCase() + key.slice(1)}`, editForm[key]);
    });
    setUserDetails(editForm);
    setShowEditModal(false);
  };

  const latest = assessments[0] || { 
    score: 'N/A', 
    text: 'No data', 
    color: '#9CA3AF', 
    light: '#F3F4F6',
    icon: '📊'
  };

  return (
    <>
      <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: 'Inter', sans-serif;
    }
    
    .glass-bg {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    }
    
    .glass-modal {
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    
    .animated-gradient {
      background: linear-gradient(-45deg, #667eea, #764ba2, #6B46C1, #9F7AEA);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .floating {
      animation: floating 3s ease infinite;
    }
    
    @keyframes floating {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    .pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    .hover-lift {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .hover-lift:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
`}</style>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style={{ zIndex: 1050, background: 'rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(5px)' }}>
          <div className="glass-modal rounded-4 p-4" style={{ width: '90%', maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="text-white mb-0">✏️ Edit Profile</h3>
              <button className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
            </div>
            
            {['name', 'email', 'phone', 'age', 'gender'].map((field) => (
              <div className="mb-3" key={field}>
                <label className="text-white mb-2 text-capitalize fw-light">{field}</label>
                {field === 'gender' ? (
                  <select 
                    name={field} 
                    className="form-control bg-transparent text-white border-white"
                    style={{ backdropFilter: 'blur(5px)' }}
                    value={editForm[field]} 
                    onChange={handleEditChange}
                  >
                    <option value="" className="text-dark">Select</option>
                    <option value="Male" className="text-dark">Male</option>
                    <option value="Female" className="text-dark">Female</option>
                    <option value="Other" className="text-dark">Other</option>
                  </select>
                ) : (
                  <input
                    type={field === 'email' ? 'email' : field === 'age' ? 'number' : 'text'}
                    name={field}
                    className="form-control bg-transparent text-white border-white"
                    style={{ backdropFilter: 'blur(5px)' }}
                    value={editForm[field]}
                    onChange={handleEditChange}
                    placeholder={`Enter your ${field}`}
                  />
                )}
              </div>
            ))}
            
            <div className="d-flex gap-3 mt-4">
              <button className="btn btn-outline-light flex-grow-1" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn btn-light flex-grow-1" onClick={saveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard with Animated Gradient Background */}
      <div className="min-vh-100 p-4 animated-gradient" style={{ position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Bubbles */}
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ pointerEvents: 'none', zIndex: 0 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i}
                 className="position-absolute rounded-circle"
                 style={{
                   width: `${Math.random() * 300 + 100}px`,
                   height: `${Math.random() * 300 + 100}px`,
                   background: 'rgba(255, 255, 255, 0.05)',
                   top: `${Math.random() * 100}%`,
                   left: `${Math.random() * 100}%`,
                   animation: `floating ${Math.random() * 5 + 3}s infinite`,
                   animationDelay: `${Math.random() * 2}s`
                 }}>
            </div>
          ))}
        </div>

        {/* Content with higher z-index */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          
          {/* Glass Profile Card */}
          <div className="glass-card rounded-4 p-4 mb-4 hover-lift">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="rounded-circle overflow-hidden" style={{ width: '80px', height: '80px' }}>
                  <img src={userDetails.avatar} alt="avatar" className="w-100 h-100 object-fit-cover" />
                </div>
              </div>
              <div className="col">
                <h2 className="text-white mb-1">{userDetails.name}</h2>
                <p className="text-white-50 mb-2">{userDetails.email}</p>
                <div className="d-flex gap-3">
                  <span className="text-white small"><i className="bi bi-telephone me-1"></i>{userDetails.phone}</span>
                  <span className="text-white small"><i className="bi bi-calendar me-1"></i>{userDetails.age || 'Age'} • {userDetails.gender || 'Gender'}</span>
                </div>
              </div>
              <div className="col-auto">
                <button className="btn btn-light rounded-pill px-4 py-2" onClick={() => setShowEditModal(true)}>
                  <i className="bi bi-pencil me-2"></i>Edit
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons - Glass Style */}
          <div className="d-flex gap-3 mb-4">
            <button className="btn glass-bg text-white border-white rounded-pill px-4 py-2 hover-lift" 
                    onClick={() => window.location.href="/assesment"}>
              <i className="bi bi-plus-circle me-2"></i>New Assessment
            </button>
            <button className={`btn rounded-pill px-4 py-2 hover-lift ${showHistory ? 'glass-bg text-white' : 'glass-bg text-white border-white'}`}
                    onClick={() => setShowHistory(!showHistory)}>
              <i className={`bi ${showHistory ? 'bi-eye-slash' : 'bi-clock-history'} me-2`}></i>
              {showHistory ? 'Hide' : 'View'} History
            </button>
          </div>

          {/* Stats Cards - Glass Design */}
          <div className="row g-4 mb-4">
            {[
              { label: 'Total Tests', value: assessments.length, icon: 'clipboard-data', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
              { label: 'Latest Score', value: latest.score, icon: 'activity', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
              { label: 'Stress Level', value: latest.text, icon: 'heart-pulse', gradient: `linear-gradient(135deg, ${latest.color}, ${latest.color}dd)` }
            ].map((stat, i) => (
              <div className="col-md-4" key={i}>
                <div className="glass-card rounded-4 p-4 h-100 hover-lift">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                      <i className={`bi bi-${stat.icon} fs-4 text-white`}></i>
                    </div>
                    <h6 className="text-white-50 mb-0">{stat.label}</h6>
                  </div>
                  {loading ? (
                    <div className="spinner-border text-white" />
                  ) : (
                    <h3 className="text-white fw-bold mb-0">{stat.value}</h3>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* History Section - Glass Table */}
          {showHistory && (
            <div className="glass-card rounded-4 mb-4 overflow-hidden">
              <div className="p-4 border-bottom border-white border-opacity-25">
                <h5 className="text-white mb-0">📊 Assessment History</h5>
              </div>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-white" />
                </div>
              ) : assessments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-x display-1 text-white opacity-50"></i>
                  <p className="text-white-50 mt-3">No assessments yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
                    <thead style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                      <tr>
                        <th className="px-4 py-3 text-white">Date</th>
                        <th className="py-3 text-white">Score</th>
                        <th className="py-3 text-white">Level</th>
                        <th className="py-3 text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessments.map((test, i) => (
                        <tr key={i} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                          <td className="px-4 py-3 text-white">
                            <i className="bi bi-calendar3 me-2 opacity-50"></i>
                            {test.date}
                          </td>
                          <td className="py-3 text-white fw-semibold">{test.score}</td>
                          <td className="py-3">
                            <span className="badge px-3 py-2 rounded-pill" 
                                  style={{ background: test.light, color: test.color }}>
                              {test.icon} {test.text}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="badge rounded-circle p-2" 
                                  style={{ background: test.color, width: '10px', height: '10px', display: 'inline-block' }}>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Wellness Tips Carousel */}
          <div className="glass-card rounded-4 p-4">
            <div className="row align-items-center">
              <div className="col">
                <div className="d-flex align-items-center mb-2">
                  <span className="display-6 me-3 floating">🧘</span>
                  <h5 className="text-white mb-0">Mindfulness Moment</h5>
                </div>
                <p className="text-white-50 mb-0">Take 3 deep breaths. Inhale peace, exhale stress. You're doing great! ✨</p>
              </div>
              <div className="col-auto">
                <div className="pulse">
                  <i className="bi bi-brightness-high-fill text-white fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    </>
  );
}





export default Dashboard;  