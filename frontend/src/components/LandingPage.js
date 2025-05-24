import React, { useState } from 'react';

export default function LandingPage() {
const [hoveredCard, setHoveredCard] = useState(null);
const [hoveredStep, setHoveredStep] = useState(null);
  const styles = {
    container: {
      fontFamily: 'Segoe UI, sans-serif',
      backgroundColor: '#0e1420',
      color: 'white',
      margin: 0,
      padding: 0,
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#0e1420',
      padding: '16px 32px',
      borderBottom: '1px solid #2d333b',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    logo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#7F8AF4',
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
    },
    navLink: {
      color: '#b0b9cc',
      textDecoration: 'none',
      transition: 'color 0.3s',
    },
    hero: {
      textAlign: 'center',
      padding: '80px 20px 60px',
      maxWidth: 800,
      margin: '0 auto',
    },
    heroTitle: {
      fontSize: '2.5em',
      marginBottom: 20,
      color: '#cbd5e1',
    },
    highlight: {
      color: '#4F46E5',
    },
    heroText: {
      color: '#94a3b8',
      fontSize: '1.1em',
    },
    launchBtn: {
        display: 'inline-block',
        marginTop: 40,
        backgroundColor: '#4F46E5',
        color: 'white',
        padding: '14px 28px',
        borderRadius: 10,
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 6px 15px rgba(79, 70, 229, 0.3)',
    },
    section: {
      padding: '60px 20px',
      maxWidth: 1000,
      margin: '0 auto',
    },
    featuresGrid: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '80px',
        marginTop: 60,
    },
    featureCard: (isHovered) => ({
        backgroundColor: '#1f2938',
        padding: 40,
        borderRadius: 16,
        width: '100%',
        minHeight: 280,
        boxShadow: isHovered
          ? '0 0 20px 6px rgba(160, 169, 249, 0.7)'
          : '0 0 10px 3px rgba(79, 70, 229, 0.7)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.4s ease',
        flex: 1,
        textAlign: 'center',
      }),
      howSection: {
        maxWidth: 900,
        margin: '60px auto',
        padding: '0 20px',
        color: '#cbd5e1',
        position: 'relative',
      },
      timeline: {
        position: 'relative',
        marginTop: 40,
        padding: '40px 0',
        width: '100%',
      },
      verticalLine: {
        position: 'absolute',
        left: '50%',
        top: 0,
        transform: 'translateX(-50%)',
        width: 4,
        height: '100%',
        backgroundColor: '#4F46E5',
        borderRadius: 2,
      },
      stepContainer: (isLeft) => ({
        position: 'relative',
        width: '45%',
        padding: '20px 30px',
        backgroundColor: '#1f2938',
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        color: 'white',
        marginBottom: 50,
        // Align left or right
        left: isLeft ? '-8%' : '56%',
        textAlign: isLeft ? 'right' : 'left',
      }),
      stepNumber: (isLeft) => ({
        position: 'absolute',
        top: 30,
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: '#4F46E5',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        boxShadow: '0 0 10px #4F46E5',
        zIndex: 1,
        // Position the number circle *outside* the box toward the line
        right: isLeft ? -40 : 'auto',
        left: isLeft ? 'auto' : -40,
      }),
      stepTitle: {
        fontSize: '1.3em',
        marginBottom: 10,
        color: '#7F8AF4',
      },
      stepDesc: {
        fontSize: '1em',
        lineHeight: 1.5,
        color: '#cbd5e1',
      },     
    ul: {
      marginTop: 20,
      lineHeight: 1.8,
      listStyle: 'none',
      paddingLeft: 0,
    },
    footer: {
      textAlign: 'center',
      color: '#475569',
      padding: '40px 20px 20px',
      fontSize: '0.9em',
    },
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <div style={styles.logo}>Quick Recap</div>
        <div style={styles.navLinks}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how" style={styles.navLink}>How It Works</a>
          <a href="#start" style={styles.navLink}>Get Started</a>
        </div>
      </nav>

      <main style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Supercharge Your Learning with <p><span style={styles.highlight}>Instant Summarization</span></p>
        </h1>
        <p style={styles.heroText}>
          Upload documents or paste content to instantly generate summaries, flashcards, and QnA for your next exam or project.
        </p>
        <a href="/app" style={styles.launchBtn}>
          Launch App
        </a>
      </main>

      <section id="features" style={styles.section}>
        <h2 style={{ textAlign: 'center', fontSize: '2.4em', color: '#e2e8f0' }}>Features</h2>
        <div style={styles.featuresGrid}>
          {["Summarizer", "Flashcards", "QnA Generator"].map((title, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              style={styles.featureCard(hoveredCard === idx)}
            >
              <h3 style={{ color: '#7F8AF4' }}>{title}</h3>
              <p>
                {title === "Summarizer"
                  ? "Generate clean and concise summaries from PDFs, text, or even scanned documents using NLP models."
                  : title === "Flashcards"
                  ? "Create ready-to-study flashcards from your material with just one click — perfect for revision."
                  : "Train smarter by generating potential questions & answers based on your uploaded or pasted content."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={styles.howSection}>
  <h2 style={{ textAlign: 'center', fontSize: '2.4em', color: '#e2e8f0' }}>
    How It Works
  </h2>
  <div style={styles.timeline}>
    <div style={styles.verticalLine} />
    {[
      {
        title: 'Upload Files or Text',
        desc: 'Supports PDFs, DOCX, PPTX, TXT, Excel sheets, and even images with OCR.',
      },
      {
        title: 'Choose Your Output',
        desc: 'Select summary format, or add Flashcards and QnA with one click.',
      },
      {
        title: 'Generate Instantly',
        desc: 'Our AI processes your content and returns results within seconds.',
      },
      {
        title: 'Export and Save',
        desc: 'Download summaries, QnA, or flashcards as text for your study kit.',
      },
    ].map((step, idx) => {
      const isLeft = idx % 2 === 0;
      return (
        <div key={idx} style={styles.stepContainer(isLeft)}>
          <div style={styles.stepNumber(isLeft)}>{idx + 1}</div>
          <h4 style={styles.stepTitle}>{step.title}</h4>
          <p style={styles.stepDesc}>{step.desc}</p>
        </div>
      );
    })}
  </div>
</section>



      <footer style={styles.footer}>
        Built with ❤️ for smarter learning · Quick Recap 2025
      </footer>
    </div>
  );
}