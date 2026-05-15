
import React, { useState, useEffect } from 'react';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `Contact Form: ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:help@ConnectUs.edu?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '48px 16px',
      position: 'relative',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    headerCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: '32px',
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 32px',
      textAlign: 'center',
    },
    headerTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    },
    headerSub: {
      color: '#e9d5ff',
      marginTop: '12px',
      marginBottom: 0,
      fontSize: '18px',
    },
    emergencyCard: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      borderRadius: '20px',
      padding: '32px',
      marginBottom: '32px',
      color: 'white',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      textAlign: 'center',
      animation: 'pulse 2s infinite',
    },
    emergencyTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    emergencyNumber: {
      fontSize: '48px',
      fontWeight: 'bold',
      marginBottom: '8px',
      letterSpacing: '2px',
    },
    emergencySub: {
      fontSize: '18px',
      marginTop: '8px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '32px',
    },
    infoCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '28px 20px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    infoIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    infoTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2d3748',
      marginBottom: '12px',
    },
    infoText: {
      color: '#4a5568',
      marginBottom: '4px',
      fontSize: '16px',
    },
    infoSmall: {
      fontSize: '13px',
      color: '#a0aec0',
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    formHeader: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      padding: '20px 32px',
    },
    formHeaderText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
    form: {
      padding: '32px',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2d3748',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      outline: 'none',
    },
    textarea: {
      width: '100%',
      padding: '14px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      outline: 'none',
      resize: 'vertical',
    },
    button: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '16px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    successMsg: {
      backgroundColor: '#c6f6d5',
      border: '2px solid #38a169',
      color: '#22543d',
      padding: '14px',
      borderRadius: '12px',
      marginTop: '20px',
      textAlign: 'center',
      fontWeight: '500',
    },
    mapNote: {
      backgroundColor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px',
      marginTop: '32px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    mapText: {
      color: '#2d3748',
      fontSize: '16px',
    },
  };

  // Add hover effects with JavaScript (or you can use CSS classes)
  const [hoveredCard, setHoveredCard] = useState(null);

  const getInfoCardStyle = (index) => ({
    ...styles.infoCard,
    transform: hoveredCard === index ? 'translateY(-8px)' : 'translateY(0)',
    boxShadow: hoveredCard === index ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 30px rgba(0,0,0,0.1)',
  });

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>📬 Contact Us</h1>
            <p style={styles.headerSub}>We're here to support you 24/7</p>
          </div>
        </div>

        {/* Emergency Banner */}
        <div style={styles.emergencyCard}>
          <div style={styles.emergencyTitle}>
            <span>🚨</span> Emergency Hotline <span>🚨</span>
          </div>
          <div style={styles.emergencyNumber}>988</div>
          <div style={styles.emergencySub}>Available 24/7 - Crisis Support</div>
          <div style={{ marginTop: '16px', fontSize: '16px' }}>
            Campus Security: <strong>(555) 123-4567</strong>
          </div>
        </div>

        {/* Info Cards */}
        <div style={styles.grid}>
          <div 
            style={getInfoCardStyle(0)}
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.infoIcon}>📞</div>
            <h3 style={styles.infoTitle}>Call Us</h3>
            <p style={styles.infoText}><strong>(555) 123-4567</strong></p>
            <p style={styles.infoSmall}>Mon-Fri, 9am - 5pm</p>
          </div>
          
          <div 
            style={getInfoCardStyle(1)}
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.infoIcon}>✉️</div>
            <h3 style={styles.infoTitle}>Email Us</h3>
            <p style={styles.infoText}><strong>help@ConnectUs.edu</strong></p>
            <p style={styles.infoSmall}>Response within 24-48 hrs</p>
          </div>
          
          <div 
            style={getInfoCardStyle(2)}
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.infoIcon}>📍</div>
            <h3 style={styles.infoTitle}>Visit Us</h3>
            <p style={styles.infoText}>Student Services Building</p>
            <p style={styles.infoSmall}>Room 101, Campus Main</p>
          </div>
        </div>

        {/* Contact Form */}
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.formHeaderText}>💬 Send us a message</h3>
          </div>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Message *</label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            
            <button 
              type="submit" 
              style={styles.button}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 10px 20px rgba(102,126,234,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              ✨ Send Message
            </button>
            
            {submitted && (
              <div style={styles.successMsg}>
                ✅ Email client opened! Please click send to complete.
              </div>
            )}
          </form>
        </div>

        {/* Map Note */}
        <div style={styles.mapNote}>
          <p style={styles.mapText}>
            🗺️ <strong>Campus Map & Directions</strong> - Available at Student Services (Room 101)<br/>
            <span style={{ fontSize: '13px', color: '#718096' }}>Monday-Friday • 9 AM - 4 PM</span>
          </p>
        </div>
      </div>

      {/* Add animation keyframes */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact;