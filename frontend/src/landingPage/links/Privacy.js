
import React, { useEffect } from 'react';

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #f3f4f6 100%)',
      padding: '48px 16px',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
      padding: '24px 32px',
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
    headerDate: {
      color: '#ddd6fe',
      marginTop: '8px',
    },
    content: {
      padding: '32px',
    },
    infoBox: {
      backgroundColor: '#eff6ff',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '12px',
    },
    text: {
      color: '#4b5563',
      lineHeight: '1.6',
    },
    list: {
      color: '#4b5563',
      lineHeight: '1.6',
      paddingLeft: '24px',
    },
    listItem: {
      marginBottom: '8px',
    },
    borderBox: {
      borderLeft: '4px solid #10b981',
      paddingLeft: '16px',
      marginBottom: '24px',
    },
    emergencyBanner: {
      backgroundColor: '#fef2f2',
      padding: '16px',
      borderTop: '1px solid #fecaca',
      textAlign: 'center',
    },
    emergencyText: {
      color: '#991b1b',
      fontWeight: '500',
      margin: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Privacy Policy</h1>
            <p style={styles.headerDate}>Effective: April 2026</p>
          </div>

          <div style={styles.content}>
            <div style={styles.infoBox}>
              <h2 style={styles.sectionTitle}>Information We Collect</h2>
              <p style={styles.text}>We collect account details, usage data, and emergency contact preferences to improve your experience.</p>
            </div>

            <div>
              <h2 style={styles.sectionTitle}>How We Use Your Data</h2>
              <ul style={styles.list}>
                <li style={styles.listItem}>To provide campus support at (555) 123-4567</li>
                <li style={styles.listItem}>To respond to emergencies via 988</li>
                <li style={styles.listItem}>To send important updates to help@ConnectUs.edu</li>
                <li style={styles.listItem}>To improve platform security</li>
              </ul>
            </div>

            <div style={styles.borderBox}>
              <h2 style={styles.sectionTitle}>Data Protection</h2>
              <p style={styles.text}>We use encryption and secure servers. However, no method is 100% secure. For emergencies, always call 988 directly.</p>
            </div>

            <div>
              <h2 style={styles.sectionTitle}>Your Rights</h2>
              <p style={styles.text}>You can request data deletion or correction by emailing <strong>help@ConnectUs.edu</strong>. Allow 5-7 business days.</p>
            </div>

            <div>
              <h2 style={styles.sectionTitle}>Cookies & Tracking</h2>
              <p style={styles.text}>We use essential cookies for login and security. No third-party trackers.</p>
            </div>
          </div>

          <div style={styles.emergencyBanner}>
            <p style={styles.emergencyText}>🚨 Emergency? Call 988 immediately (24/7) or campus security at (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;