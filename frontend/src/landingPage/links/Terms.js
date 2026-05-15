
import React, { useEffect } from 'react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f3f4f6 100%)',
      padding: '48px 16px',
    },
    wrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    },
    header: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      padding: '24px 32px',
    },
    headerTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
    headerDate: {
      color: '#bfdbfe',
      marginTop: '8px',
      marginBottom: 0,
    },
    content: {
      padding: '32px',
    },
    section: {
      borderBottom: '1px solid #e5e7eb',
      paddingBottom: '16px',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '8px',
    },
    text: {
      color: '#4b5563',
      lineHeight: '1.6',
    },
    emergencyBox: {
      backgroundColor: '#fef2f2',
      padding: '16px',
      borderRadius: '8px',
      marginTop: '8px',
    },
    emergencyNumber: {
      color: '#dc2626',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    footer: {
      backgroundColor: '#f9fafb',
      padding: '16px 32px',
      borderTop: '1px solid #e5e7eb',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Terms of Service</h1>
            <p style={styles.headerDate}>Last updated: April 2026</p>
          </div>

          <div style={styles.content}>
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>1. Acceptance of Terms</h2>
              <p style={styles.text}>By accessing ConnectUs, you agree to be bound by these Terms of Service. If you disagree, please do not use our platform.</p>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>2. Emergency & Support</h2>
              <div style={styles.emergencyBox}>
                <p style={styles.text}>🚨 <strong>Emergency:</strong> <span style={styles.emergencyNumber}>988 (24/7)</span></p>
                <p style={styles.text}>📞 <strong>Campus Support:</strong> (555) 123-4567</p>
                <p style={styles.text}>📧 <strong>Email:</strong> help@ConnectUs.edu</p>
              </div>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>3. User Responsibilities</h2>
              <p style={styles.text}>You agree to use ConnectUs for lawful purposes only. Harassment, spam, or sharing harmful content is strictly prohibited.</p>
            </div>

            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>4. Privacy & Data</h2>
              <p style={styles.text}>Your use of ConnectUs is also governed by our Privacy Policy. We protect your data but cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 style={styles.sectionTitle}>5. Termination</h2>
              <p style={styles.text}>We reserve the right to suspend or terminate accounts that violate these terms.</p>
            </div>
          </div>

          <div style={styles.footer}>
            📞 Emergency: 988 | Campus: (555) 123-4567 | 📧 help@ConnectUs.edu
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;