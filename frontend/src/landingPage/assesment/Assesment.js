import React, { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function Assessment() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [saving, setSaving] = useState(false);

  const questions = [
    {
      id: "sleep",
      icon: "😴",
      question: "How many hours do you sleep on average?",
      options: [
        { text: "7-9 hours (Healthy)", value: 1, color: "success" },
        { text: "5-6 hours", value: 2, color: "warning" },
        { text: "3-4 hours", value: 3, color: "warning" },
        { text: "Less than 3 hours", value: 4, color: "danger" }
      ]
    },
    {
      id: "stress",
      icon: "😰",
      question: "How often do you feel academic pressure?",
      options: [
        { text: "Rarely", value: 1, color: "success" },
        { text: "Sometimes", value: 2, color: "warning" },
        { text: "Often", value: 3, color: "warning" },
        { text: "Almost daily", value: 4, color: "danger" }
      ]
    },
    {
      id: "mood",
      icon: "😊",
      question: "How would you describe your mood recently?",
      options: [
        { text: "Mostly happy", value: 1, color: "success" },
        { text: "Neutral", value: 2, color: "warning" },
        { text: "Frequently sad", value: 3, color: "warning" },
        { text: "Persistently low", value: 4, color: "danger" }
      ]
    },
    {
      id: "energy",
      icon: "⚡",
      question: "How is your daily energy level?",
      options: [
        { text: "High and productive", value: 1, color: "success" },
        { text: "Normal", value: 2, color: "warning" },
        { text: "Low", value: 3, color: "warning" },
        { text: "Very exhausted", value: 4, color: "danger" }
      ]
    },
    {
      id: "focus",
      icon: "🎯",
      question: "Are you able to concentrate during lectures/study?",
      options: [
        { text: "Easily concentrate", value: 1, color: "success" },
        { text: "Sometimes distracted", value: 2, color: "warning" },
        { text: "Frequently distracted", value: 3, color: "warning" },
        { text: "Unable to focus", value: 4, color: "danger" }
      ]
    },
    {
      id: "anxiety",
      icon: "😟",
      question: "Do you experience anxiety or overthinking?",
      options: [
        { text: "Very rarely", value: 1, color: "success" },
        { text: "Occasionally", value: 2, color: "warning" },
        { text: "Often", value: 3, color: "warning" },
        { text: "Almost constantly", value: 4, color: "danger" }
      ]
    },
    {
      id: "social",
      icon: "👥",
      question: "How connected do you feel with friends or family?",
      options: [
        { text: "Very connected", value: 1, color: "success" },
        { text: "Somewhat connected", value: 2, color: "warning" },
        { text: "Isolated sometimes", value: 3, color: "warning" },
        { text: "Very isolated", value: 4, color: "danger" }
      ]
    },
    {
      id: "motivation",
      icon: "🚀",
      question: "How motivated do you feel about your goals?",
      options: [
        { text: "Highly motivated", value: 1, color: "success" },
        { text: "Moderately motivated", value: 2, color: "warning" },
        { text: "Low motivation", value: 3, color: "warning" },
        { text: "No motivation at all", value: 4, color: "danger" }
      ]
    }
  ];

  const handleChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const getScoreColor = (value) => {
    for (let q of questions) {
      for (let opt of q.options) {
        if (opt.value === value) {
          return opt.color;
        }
      }
    }
    return "secondary";
  };

  const getProgressWidth = () => {
    const totalAnswered = Object.keys(answers).length;
    return (totalAnswered / questions.length) * 100;
  };

  const analyzeMood = async () => {
    setSaving(true);
    let totalScore = Object.values(answers).reduce(
      (acc, val) => acc + parseInt(val || 0),
      0
    );

    let level = "";
    let resultObj = {};

    if (totalScore <= 12) {
      level = "Healthy";
      resultObj = {
        message: "😊 You seem emotionally healthy and balanced.",
        type: "success",
        icon: "🌟"
      };
    } 
    else if (totalScore <= 20) {
      level = "Mild Stress";
      resultObj = {
        message: "😐 Mild stress detected. Try relaxation and time management.",
        type: "warning",
        icon: "💭"
      };
    } 
    else if (totalScore <= 26) {
      level = "Moderate Stress";
      resultObj = {
        message: "😔 Moderate emotional strain. Consider talking to someone you trust.",
        type: "warning",
        icon: "🤝"
      };
    } 
    else {
      level = "High Stress";
      resultObj = {
        message: "⚠️ High emotional distress detected. Please seek professional help.",
        type: "danger",
        icon: "🆘"
      };
    }


    try {

      await axios.post(`${API}/assesment/save`, {
        userId: localStorage.getItem("userId"),
        answers: answers,
        totalScore: totalScore,
        stressLevel: level
      });

      console.log("Assessment saved successfully");
      setResult(resultObj);

    } catch (error) {

      console.log("Error saving result:", error);

    }
    setTimeout(() => {
      setSaving(false);
    }, 2000);

  };

  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <div className="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle mb-3">
          <span style={{ fontSize: "40px" }}>❤️</span>
        </div>
        <h1 className="display-5 fw-bold mb-3">Student Mental Health Assessment</h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "600px" }}>
          Take a moment to check in with yourself. This quick assessment helps you understand your current emotional well-being.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="d-flex justify-content-between mb-2">
          <span className="fw-semibold">Assessment Progress</span>
          <span className="text-primary fw-bold">{Object.keys(answers).length}/{questions.length} Questions</span>
        </div>
        <div className="progress" style={{ height: "8px" }}>
          <div 
            className="progress-bar bg-primary" 
            style={{ width: `${getProgressWidth()}%` }}
            role="progressbar"
          />
        </div>
      </div>

      {/* Questions Grid */}
      <div className="row g-4">
        {questions.map((q) => (
          <div key={q.id} className="col-lg-6">
            <div className={`card border-0 shadow-sm h-100 ${answers[q.id] ? 'border-start border-4 border-primary' : ''}`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-light rounded-circle">
                    <span style={{ fontSize: "24px" }}>{q.icon}</span>
                  </div>
                  <h5 className="card-title fw-semibold mb-0 flex-grow-1">
                    {q.question}
                  </h5>
                  {answers[q.id] && (
                    <span className={`badge bg-${getScoreColor(answers[q.id])} bg-opacity-10 text-${getScoreColor(answers[q.id])} px-3 py-2`}>
                      Score: {answers[q.id]}
                    </span>
                  )}
                </div>

                <div className="options-container">
                  {q.options.map((opt, index) => (
                    <div 
                      key={index} 
                      className={`option-item mb-2 ${answers[q.id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleChange(q.id, opt.value)}
                    >
                      <div className="form-check p-3 rounded-3 border" style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={q.id}
                          className="form-check-input"
                          value={opt.value}
                          checked={answers[q.id] === opt.value}
                          onChange={() => {}}
                          id={`${q.id}-${index}`}
                        />
                        <label className="form-check-label w-100" htmlFor={`${q.id}-${index}`}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{opt.text}</span>
                            {answers[q.id] === opt.value && (
                              <span className={`badge bg-${opt.color} ms-2`}>Selected</span>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analyze Button Section */}
      <div className="text-center mt-5">
        <button 
          className={`btn btn-lg px-5 py-3 ${allQuestionsAnswered ? 'btn-primary' : 'btn-secondary'}`}
          onClick={analyzeMood}
          disabled={!allQuestionsAnswered}
          style={{ 
            borderRadius: "50px",
            transition: "all 0.3s ease"
          }}
        >
          {allQuestionsAnswered ? (
            <>
              <span className="me-2">❤️</span>
              Analyze My Mood
            </>
          ) : (
            <>
              <span className="me-2">📝</span>
              Answer all questions to analyze
            </>
          )}
        </button>
      </div>
      
      {/* Saving Message */}

      {saving && (
        <div className="alert alert-info text-center position-fixed top-0 start-50 translate-middle-x mt-3 shadow"
            style={{ zIndex: 9999, width: "320px" }}>
          <span className="spinner-border spinner-border-sm me-2"></span>
          Saving your response...
        </div>
      )}


      {/* Result Card */}
      {result && (
        <div className="row justify-content-center mt-5">
          <div className="col-md-8">
            <div className={`card border-0 shadow-lg bg-${result.type} bg-opacity-10`}>
              <div className="card-body p-4 text-center">
                <div className="display-1 mb-3">{result.icon}</div>
                <h3 className={`fw-bold text-${result.type} mb-3`}>
                  Your Assessment Result
                </h3>
                <p className="lead mb-0">{result.message}</p>
                
                {result.type === "danger" && (
                  <div className="mt-4 p-3 bg-white bg-opacity-50 rounded">
                    <p className="small mb-0 text-secondary">
                      🆘 If you're in crisis, please reach out to a mental health professional immediately.
                      <br />
                      <strong>National Helpline: 988</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="text-center mt-5">
        <p className="small text-muted">
          This assessment is for self-reflection purposes only and is not a substitute for professional medical advice.
        </p>
      </div>

      <style jsx>{`
        .option-item.selected .form-check {
          background-color: var(--bs-primary-bg-subtle);
          border-color: var(--bs-primary) !important;
        }
        
        .option-item .form-check:hover {
          background-color: var(--bs-light);
          transition: background-color 0.2s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Assessment;