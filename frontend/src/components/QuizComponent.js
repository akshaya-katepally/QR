import React, { useState, useEffect } from 'react';

function QuizComponent() {
  // ────────── State ──────────
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);   // sec
  const [totalTime, setTotalTime] = useState(0);   // sec
  const [timerActive, setTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);   // sec after submit

  // UI helpers
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  // ────────── Timer effect (counts‑down & auto‑submit) ──────────
  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft === 0) {
      handleSubmitAll(true);      // auto‑submit, skip unanswered check
      return;
    }
    const id = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, timerActive]);

  // ────────── Handlers ──────────
  const handleFileChange = e => {
    const sel = e.target.files[0];
    setFile(sel); setFileName(sel?.name || '');
  };

  const handleGenerateQuiz = async () => {
    if (!file && !text.trim()) {
      alert('Please provide text or upload a file.');
      return;
    }

    const fd = new FormData();
    if (file) fd.append('file', file);
    if (text.trim()) fd.append('text', text.trim());
    fd.append('num_questions', numQuestions);

    setLoading(true); setProgressText('Generating quiz…');
    try {
      const res = await fetch('http://localhost:5000/quiz', { method: 'POST', body: fd });
      const data = await res.json();

      if (Array.isArray(data.quiz)) {
        setQuiz(data.quiz);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setTimeTaken(0);

        // 20 s per question — change if you want another pace
        const alloc = data.quiz.length * 15;
        setTotalTime(alloc);
        setTimeLeft(alloc);
        setTimerActive(true);
      } else {
        setQuiz([]);
      }
      setProgressText('Done!');
    } catch (err) {
      console.error('Quiz error:', err);
      setProgressText('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText(''); setFile(null); setFileName('');
    setQuiz([]); setAnswers({}); setSubmitted(false); setScore(0);
    setTimerActive(false); setTimeLeft(0); setTimeTaken(0);
  };

  const handleOptionSelect = (idx, opt) => {
    if (submitted) return;
    setAnswers(p => ({ ...p, [idx]: opt }));
  };

  // skipCheck = true when timer expires
  const handleSubmitAll = (skipCheck = false) => {
    if (!skipCheck && Object.keys(answers).length < quiz.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    const correctCnt = quiz.reduce((acc, q, i) =>
      acc + (answers[i] === q.correct_answer ? 1 : 0), 0);

    setScore(correctCnt);
    setSubmitted(true);
    setTimerActive(false);
    setTimeTaken(totalTime - timeLeft);
  };

  const handleRetry = () => {
    setAnswers({}); setSubmitted(false); setScore(0);
    setTimeTaken(0);
    setTimeLeft(totalTime);   // restart with same total
    setTimerActive(true);
  };

  const handleDownload = () => {
    if (quiz.length === 0) return;
    const txt = quiz.map((q, i) => {
      const opts = Object.entries(q.options).map(([k, v]) => `${k}: ${v}`).join('\n');
      return `Q${i + 1}: ${q.question}\n\nOptions:\n${opts}\n\nCorrect: ${q.correct_answer}\nExplanation: ${q.explanation}\n${'='.repeat(60)}\n`;
    }).join('\n');
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'quiz.txt'; a.click();
  };

  // Format seconds → mm:ss
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ────────── Styles ──────────
  const styles = {
    container: { maxWidth: 700, margin: '40px auto', textAlign: 'center', padding: 20, color: '#fff', fontFamily: 'Segoe UI, sans-serif', borderRadius: 8 },
    uploadBox: {
      border: '2px dashed #3d3d3d', borderRadius: 8, padding: '40px 20px', color: '#ccc', cursor: 'pointer', margin: '20px 0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: isHovering ? '#374151' : '#192231', transition: 'background 0.3s'
    },
    textarea: { width: '100%', minHeight: 150, background: '#1F2938', color: '#fff', border: '1px solid #333', borderRadius: 8, padding: 12, marginTop: 16, resize: 'vertical' },
    actions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginTop: 24, flexWrap: 'wrap', },
    button: { padding: '10px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', color: '#fff', background: '#4F46E5' },
    clearButton: { background: '#374151' },
    downloadButton: { background: '#374151' },
    inputSmall: { padding: '6px', borderRadius: 6, border: '1px solid #555', width: 60, background: '#111', color: '#fff' },
    loadingBox: { marginTop: 20, padding: 10, background: '#20283A', borderRadius: 6, textAlign: 'center' },
    quizBox: { marginTop: 24, background: '#111827', padding: 20, borderRadius: 8, textAlign: 'left' },
    questionBox: { marginBottom: 16, background: '#1E293B', padding: 16, borderRadius: 8, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' },
    question: { color: '#93C5FD', fontSize: '1rem', marginBottom: 8 },
    // option: (sel, correct, sub) => ({
    //   margin: '6px 0', padding: '10px', borderRadius: 6, cursor: sub ? 'default' : 'pointer', background:'rgb(40, 51, 70)',
    //   border: sub ? (correct ? '1.8px solidrgb(4, 64, 45)' : sel ? '1.8px solid #F43F5E' : '1px solid #333')
    //     : (sel ? '#2563EB' : '#374151'),
    //   color: '#fff' 
    // }),
    option: (sel, correct, sub) => {
    /* default look */
    let background = 'rgb(40, 51, 70)';      // dark slate‑blue fill
    let border     = sel ? '#2563EB'         // blue outline while choosing
                         : '#374151';        // neutral outline

    if (!sub) { 
      /* ───── before submit ─S──── */
      if (sel) background = 'rgb(90, 198, 244)';       // blue fill on selection
    } else {
      /* ───── after submit ───── */
      border = '#374151';                    // freeze outline to neutral

      if (correct)      background = 'rgb(50, 141, 112)';  // green fill for right answer
      else if (sel)     background = 'rgb(207, 91, 91)';  // red fill for user’s wrong pick
    }

    return {
      margin: '6px 0',
      padding: '10px',
      borderRadius: 6,
      cursor: sub ? 'default' : 'pointer',
      background,
      border: `1.8px solid ${border}`,
      color: '#fff'
    };
  },
    submitAll: { marginTop: 30, background: '#10B981' },
    retry: { marginTop: 16, background: '#4F46E5' },
    floatingTimer: { position: 'fixed', top: '70px', right: '30px', zIndex: 1000, background: '#DC2626', color: '#fff', padding: '8px 14px', borderRadius: 8, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' },
    floatingScore: { position: 'fixed', top: '70px', left: '30px', zIndex: 1000, background: '#111827', color: '#F3F4F6', padding: '12px 20px', borderRadius: 10, fontWeight: '600', fontSize: '0.95rem', border: '1px solid #334155', fontFamily: 'Segoe UI, sans-serif', minWidth: '180px', textAlign: 'center', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', lineHeight: 1.5 },
    explanation: { color: 'rgb(150, 162, 165)', fontStyle: 'italic', marginTop: 10 }
  };

  // ────────── Render ──────────
  return (
    <div style={styles.container}>
      

      {/* Floating Timer (top-right) */}
      {timerActive && !submitted && (
        <div style={styles.floatingTimer}>
          ⏳ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      )}

      {/* Floating Score (top-left) */}
      {submitted && (
        <div style={styles.floatingScore}>
          ✅ Score: {score}/{quiz.length} <br />
          ⏱ Time: {fmt(timeTaken)}
        </div>
      )}



      <h2>Quiz Generator</h2>

      {/* Upload */}
      <label style={styles.uploadBox}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input type="file" hidden onChange={handleFileChange} />
        <div>📤 <strong>Click to upload</strong><br />
          {fileName && <p style={{ fontSize: 14, color: '#ccc' }}>📄 {fileName}</p>}
        </div>
      </label>

      {/* Textarea */}
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Or paste your text here…" style={styles.textarea} />

      {/* Action bar (now includes question‑count input) */}
      <div style={styles.actions}>
        {/* Clear (left edge) */}
        <button
          style={{ ...styles.button, ...styles.clearButton }}
          onClick={handleClear}
        >
          Clear
        </button>

        {/* Questions (will float between left & right items) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ color: '#fff' }}>Questions:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={e => setNumQuestions(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              border: '1px solid #374151',
              width: 50,
              background: '#374151',
              color: '#fff',
            }}
          />
        </div>

        {/* Generate Quiz (always present) */}
        <button style={styles.button} onClick={handleGenerateQuiz}>
          Generate Quiz
        </button>

        {/* Conditionally render Download (right edge when shown) */}
        {quiz.length > 0 && (
          <button
            style={{ ...styles.button, ...styles.downloadButton }}
            onClick={handleDownload}
          >
            ⬇ Download
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div style={styles.loadingBox}>
          <p>{progressText}</p>
          <progress style={{ width: '100%' }} />
        </div>
      )}

      {/* Quiz */}
      {quiz.length > 0 && (
        <div style={styles.quizBox}>
          {quiz.map((q, idx) => {
            const sel = answers[idx];
            const correct = sel === q.correct_answer;
            return (
              <div key={idx} style={styles.questionBox}>
                <p style={styles.question}><strong>Q{idx + 1}:</strong> {q.question}</p>
                {Object.entries(q.options).map(([k, v]) => (
                  <div key={k}
                    style={styles.option(sel === k, q.correct_answer === k, submitted)}
                    onClick={() => handleOptionSelect(idx, k)}
                  >
                    <strong>{k}:</strong> {v}
                  </div>
                ))}

                {submitted && (
                  <>
                    <p style={styles.explanation}>Explanation: {q.explanation}</p>
                  </>
                )}
              </div>
            );
          })}

          {!submitted ? (
            <button onClick={() => handleSubmitAll(false)} style={{ ...styles.button, ...styles.submitAll }}>
              Submit All
            </button>
          ) : (
            <button onClick={handleRetry} style={{ ...styles.button, ...styles.retry }}>
              Retry Quiz
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizComponent;


// import React, { useState, useEffect } from 'react';

// // ————————————————————————————————————————————————
// //  QuizComponent – same logic, refreshed styles to match mock‑up
// // ————————————————————————————————————————————————

// function QuizComponent() {
//   // ────────── State ──────────
//   const [text, setText] = useState('');
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [numQuestions, setNumQuestions] = useState(10);

//   const [quiz, setQuiz] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   // Timer
//   const [timeLeft, setTimeLeft] = useState(0); // sec
//   const [totalTime, setTotalTime] = useState(0); // sec
//   const [timerActive, setTimerActive] = useState(false);
//   const [timeTaken, setTimeTaken] = useState(0); // sec after submit

//   // UI helpers
//   const [loading, setLoading] = useState(false);
//   const [progressText, setProgressText] = useState('');
//   const [isHovering, setIsHovering] = useState(false);

//   // ────────── Timer effect (counts‑down & auto‑submit) ──────────
//   useEffect(() => {
//     if (!timerActive) return;

//     if (timeLeft === 0) {
//       handleSubmitAll(true); // auto‑submit
//       return;
//     }
//     const id = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
//     return () => clearTimeout(id);
//   }, [timeLeft, timerActive]);

//   // ────────── Handlers ──────────
//   const handleFileChange = (e) => {
//     const sel = e.target.files[0];
//     setFile(sel);
//     setFileName(sel?.name || '');
//   };

//   const handleGenerateQuiz = async () => {
//     if (!file && !text.trim()) {
//       alert('Please provide text or upload a file.');
//       return;
//     }

//     const fd = new FormData();
//     if (file) fd.append('file', file);
//     if (text.trim()) fd.append('text', text.trim());
//     fd.append('num_questions', numQuestions);

//     setLoading(true);
//     setProgressText('Generating quiz…');
//     try {
//       const res = await fetch('http://localhost:5000/quiz', {
//         method: 'POST',
//         body: fd,
//       });
//       const data = await res.json();

//       if (Array.isArray(data.quiz)) {
//         setQuiz(data.quiz);
//         setAnswers({});
//         setSubmitted(false);
//         setScore(0);
//         setTimeTaken(0);

//         const alloc = data.quiz.length * 15; // 15 s / Q  – tweak here
//         setTotalTime(alloc);
//         setTimeLeft(alloc);
//         setTimerActive(true);
//       } else {
//         setQuiz([]);
//       }
//       setProgressText('Done!');
//     } catch (err) {
//       console.error('Quiz error:', err);
//       setProgressText('An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClear = () => {
//     setText('');
//     setFile(null);
//     setFileName('');

//     setQuiz([]);
//     setAnswers({});
//     setSubmitted(false);
//     setScore(0);

//     setTimerActive(false);
//     setTimeLeft(0);
//     setTimeTaken(0);
//   };

//   const handleOptionSelect = (idx, opt) => {
//     if (submitted) return;
//     setAnswers((p) => ({ ...p, [idx]: opt }));
//   };

//   // skipCheck = true when timer expires
//   const handleSubmitAll = (skipCheck = false) => {
//     if (!skipCheck && Object.keys(answers).length < quiz.length) {
//       alert('Please answer all questions before submitting.');
//       return;
//     }

//     const correctCnt = quiz.reduce(
//       (acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0),
//       0
//     );

//     setScore(correctCnt);
//     setSubmitted(true);
//     setTimerActive(false);
//     setTimeTaken(totalTime - timeLeft);
//   };

//   const handleRetry = () => {
//     setAnswers({});
//     setSubmitted(false);
//     setScore(0);
//     setTimeTaken(0);
//     setTimeLeft(totalTime);
//     setTimerActive(true);
//   };

//   const handleDownload = () => {
//     if (quiz.length === 0) return;
//     const txt = quiz
//       .map((q, i) => {
//         const opts = Object.entries(q.options)
//           .map(([k, v]) => `${k}: ${v}`)
//           .join('\n');
//         return `Q${i + 1}: ${q.question}\n\nOptions:\n${opts}\n\nCorrect: ${q.correct_answer}\nExplanation: ${q.explanation}\n${'='.repeat(
//           60
//         )}\n`;
//       })
//       .join('\n');
//     const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = 'quiz.txt';
//     a.click();
//   };

//   // Format seconds → mm:ss
//   const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

//   // ────────── Styles ──────────
//   const styles = {
//     // layout
//     container: {
//       maxWidth: 760,
//       margin: '40px auto',
//       padding: 24,
//       color: '#F3F4F6',
//       fontFamily: 'Segoe UI, sans-serif',
//       background: '#0F172A',
//       borderRadius: 10,
//       boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
//     },

//     // upload + textarea
//     uploadBox: {
//       border: '2px dashed #374151',
//       borderRadius: 8,
//       padding: '36px 20px',
//       color: '#E5E7EB',
//       cursor: 'pointer',
//       margin: '20px 0',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       background: isHovering ? '#1E293B' : '#192231',
//       transition: 'background 0.3s',
//     },
//     textarea: {
//       width: '100%',
//       minHeight: 140,
//       background: '#1F2938',
//       color: '#F9FAFB',
//       border: '1px solid #374151',
//       borderRadius: 8,
//       padding: 12,
//       marginTop: 16,
//       resize: 'vertical',
//     },

//     // action bar
//     actions: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       gap: 18,
//       marginTop: 24,
//       flexWrap: 'wrap',
//     },
//     button: {
//       padding: '10px 22px',
//       borderRadius: 6,
//       border: 'none',
//       cursor: 'pointer',
//       color: '#fff',
//       background: '#4F46E5',
//     },
//     clearButton: { background: '#374151' },
//     downloadButton: { background: '#374151' },

//     // quiz display
//     quizHeading: { marginTop: 32, marginBottom: 12, textAlign: 'left' },
//     quizBox: {
//       background: '#0B1120',
//       padding: 24,
//       borderRadius: 10,
//     },
//     questionCard: {
//       marginBottom: 24,
//       background: '#1E293B',
//       padding: 20,
//       borderRadius: 10,
//       boxShadow: '0 4px 8px rgba(0,0,0,0.25)',
//     },
//     question: { color: '#93C5FD', fontSize: '1rem', marginBottom: 10 },
//     optionsHeading: { fontWeight: 600, margin: '4px 0 6px', color: '#D1D5DB' },

//     option: (sel, correct, submitted) => {
//       // base colours
//       let bg = '#374151';
//       let border = '1px solid #1E293B';

//       if (!submitted && sel) bg = '#2563EB';

//       if (submitted) {
//         if (sel && correct) {
//           bg = '#047857'; // green fill when user picked correctly
//           border = '1px solid #047857';
//         } else if (correct && !sel) {
//           border = '1.8px solid #047857';
//         } else if (sel && !correct) {
//           border = '1.8px solid #DC2626';
//         }
//       }

//       return {
//         margin: '6px 0',
//         padding: '10px 12px',
//         borderRadius: 6,
//         cursor: submitted ? 'default' : 'pointer',
//         background: bg,
//         border,
//         display: 'flex',
//         alignItems: 'center',
//         gap: 6,
//       };
//     },

//     correctAnswer: {
//       color: '#10B981',
//       fontWeight: 600,
//       marginTop: 12,
//     },
//     explanation: {
//       color: '#FACC15',
//       fontStyle: 'italic',
//       marginTop: 6,
//     },

//     // misc floating widgets
//     floatingTimer: {
//       position: 'fixed',
//       top: 70,
//       right: 30,
//       zIndex: 1000,
//       background: '#B91C1C',
//       color: '#fff',
//       padding: '8px 14px',
//       borderRadius: 8,
//       fontWeight: 'bold',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
//     },
//     floatingScore: {
//       position: 'fixed',
//       top: 70,
//       left: 30,
//       zIndex: 1000,
//       background: '#0B1120',
//       color: '#F3F4F6',
//       padding: '12px 20px',
//       borderRadius: 10,
//       fontWeight: 600,
//       fontSize: '0.95rem',
//       border: '1px solid #334155',
//       minWidth: 180,
//       textAlign: 'center',
//       whiteSpace: 'nowrap',
//       textShadow: '0 1px 2px rgba(0,0,0,0.6)',
//       backdropFilter: 'blur(6px)',
//       lineHeight: 1.5,
//     },
//   };

//   // ────────── Render ──────────
//   return (
//     <div style={styles.container}>
//       {/* Floating HUD */}
//       {timerActive && !submitted && (
//         <div style={styles.floatingTimer}>
//           ⏳ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
//         </div>
//       )}
//       {submitted && (
//         <div style={styles.floatingScore}>
//           ✅ Score: {score}/{quiz.length} <br />
//           ⏱ Time: {fmt(timeTaken)}
//         </div>
//       )}

//       <h2 style={{ textAlign: 'center' }}>Quiz Generator</h2>

//       {/* Upload */}
//       <label
//         style={styles.uploadBox}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//       >
//         <input type="file" hidden onChange={handleFileChange} />
//         <div>
//           📤 <strong>Click to upload</strong>
//           {fileName && (
//             <p style={{ fontSize: 14, color: '#ccc' }}>📄 {fileName}</p>
//           )}
//         </div>
//       </label>

//       {/* Textarea */}
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Or paste your text here…"
//         style={styles.textarea}
//       />

//       {/* Action bar */}
//       <div style={styles.actions}>
//         <button style={{ ...styles.button, ...styles.clearButton }} onClick={handleClear}>
//           Clear
//         </button>

//         {/* Question count */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//           <label>Questions:</label>
//           <input
//             type="number"
//             min={1}
//             max={20}
//             value={numQuestions}
//             onChange={(e) => setNumQuestions(e.target.value)}
//             style={{
//               padding: '8px 12px',
//               borderRadius: 6,
//               border: '1px solid #374151',
//               width: 60,
//               background: '#374151',
//               color: '#fff',
//             }}
//           />
//         </div>

//         <button style={styles.button} onClick={handleGenerateQuiz}>
//           Generate Quiz
//         </button>

//         {quiz.length > 0 && (
//           <button style={{ ...styles.button, ...styles.downloadButton }} onClick={handleDownload}>
//             ⬇ Download
//           </button>
//         )}
//       </div>

//       {/* Loading */}
//       {loading && (
//         <div style={{ marginTop: 20, textAlign: 'center' }}>
//           <p>{progressText}</p>
//           <progress style={{ width: '100%' }} />
//         </div>
//       )}

//       {/* ————— Generated Quiz ————— */}
//       {quiz.length > 0 && (
//         <>
//           <h3 style={styles.quizHeading}>Generated Quiz:</h3>
//           <div style={styles.quizBox}>
//             {quiz.map((q, idx) => {
//               const sel = answers[idx];
//               const correct = q.correct_answer;
//               return (
//                 <div key={idx} style={styles.questionCard}>
//                   <p style={styles.question}>
//                     <strong>Q{idx + 1}:</strong> {q.question}
//                   </p>

//                   <p style={styles.optionsHeading}>Options:</p>
//                   {Object.entries(q.options).map(([k, v]) => {
//                     const style = styles.option(sel === k, correct === k, submitted);
//                     const showTick = submitted && sel === k && correct === k;
//                     return (
//                       <div key={k} style={style} onClick={() => handleOptionSelect(idx, k)}>
//                         <strong>{k}:</strong> {v} {showTick && '✓'}
//                       </div>
//                     );
//                   })}

//                   {submitted && (
//                     <>
//                       <p style={styles.correctAnswer}>Correct Answer: {correct}</p>
//                       <p style={styles.explanation}>Explanation: {q.explanation}</p>
//                     </>
//                   )}
//                 </div>
//               );
//             })}

//             {!submitted ? (
//               <button
//                 onClick={() => handleSubmitAll(false)}
//                 style={{ ...styles.button, background: '#10B981', marginTop: 30 }}
//               >
//                 Submit All
//               </button>
//             ) : (
//               <button
//                 onClick={handleRetry}
//                 style={{ ...styles.button, background: '#4F46E5', marginTop: 20 }}
//               >
//                 Retry Quiz
//               </button>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default QuizComponent;
