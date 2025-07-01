// import React, { useState } from 'react';

// function QuizComponent() {
//   const [text, setText] = useState('');
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [quiz, setQuiz] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [progressText, setProgressText] = useState('');
//   const [isHovering, setIsHovering] = useState(false);

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     setFile(selected);
//     setFileName(selected?.name || '');
//   };

//   const handleGenerateQuiz = async () => {
//     if (!file && !text.trim()) {
//       alert('Please provide text or upload a file.');
//       return;
//     }

//     const formData = new FormData();
//     if (file) formData.append('file', file);
//     if (text.trim()) formData.append('text', text.trim());

//     setLoading(true);
//     setProgressText('Generating quiz...');
//     try {
//       const res = await fetch('http://localhost:5000/quiz', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await res.json();
//       setQuiz(Array.isArray(data.quiz) ? data.quiz : []);
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
//   };

//   const handleDownload = () => {
//     if (quiz.length === 0) return;

//     const content = quiz
//       .map((q, idx) => {
//         const options = Object.entries(q.options)
//           .map(([key, value]) => `${key}: ${value}`)
//           .join('\n');
//         return `Q${idx + 1}: ${q.question}\n\nOptions:\n${options}\n\nCorrect Answer: ${q.correct_answer}\nExplanation: ${q.explanation}\n\n${'='.repeat(50)}\n`;
//       })
//       .join('\n');
//     const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'quiz.txt';
//     link.click();
//   };

//   const styles = {
//     container: {
//       maxWidth: 700,
//       margin: '40px auto',
//       textAlign: 'center',
//       padding: 20,
//       color: '#fff',
//       fontFamily: 'Segoe UI, sans-serif',
//       borderRadius: 8,
//       //backgroundColor: '#1F2938',
//     },
//     uploadBox: {
//       border: '2px dashed #3d3d3d',
//       borderRadius: 8,
//       padding: '40px 20px',
//       color: '#ccc',
//       cursor: 'pointer',
//       margin: '20px 0',
//       textAlign: 'center',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: isHovering ? '#374151' : '#192231',
//       transition: 'background 0.3s',
//     },
//     textarea: {
//       width: '100%',
//       minHeight: 150,
//       background: '#1F2938',
//       color: '#fff',
//       border: '1px solid #333',
//       borderRadius: 8,
//       padding: 12,
//       marginTop: 16,
//       resize: 'vertical',
//     },
//     actions: {
//       display: 'flex',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       marginTop: 20,
//       gap: 12,
//     },
//     button: {
//       padding: '10px 20px',
//       borderRadius: 6,
//       border: 'none',
//       cursor: 'pointer',
//       color: 'white',
//       backgroundColor: '#4F46E5',
//     },
//     clearButton: {
//       backgroundColor: '#374151',
//     },
//     downloadButton: {
//       backgroundColor: '#AEB1CA',
//     },
//     loadingBox: {
//       marginTop: 20,
//       padding: 10,
//       backgroundColor: '#20283A',
//       borderRadius: 6,
//       textAlign: 'center',
//     },
//     quizBox: {
//       marginTop: 24,
//       background: '#111827',
//       padding: 20,
//       borderRadius: 8,
//       textAlign: 'left',
//     },
//     questionBox: {
//       marginBottom: 16,
//       background: '#1E293B',
//       padding: 16,
//       borderRadius: 8,
//       boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
//     },
//     question: {
//       color: '#93C5FD',
//       fontSize: '1rem',
//       marginBottom: 8,
//     },
//     answer: {
//       color: '#F3F4F6',
//       fontSize: '0.9rem',
//     },
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Quiz Generator</h2>
//       <label
//         style={styles.uploadBox}
//         onMouseEnter={() => setIsHovering(true)}
//         onMouseLeave={() => setIsHovering(false)}
//       >
//         <input type="file" onChange={handleFileChange} hidden />
//         <div>
//           Click to upload
//           {fileName && <p style={{ color: '#ccc', marginTop: 8 }}>📄 {fileName}</p>}
//         </div>
//       </label>
//       <textarea
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//         placeholder="Or paste your content here..."
//         style={styles.textarea}
//       />
//       <div style={styles.actions}>
//         <button style={{ ...styles.button, ...styles.clearButton }} onClick={handleClear}>
//           Clear
//         </button>
//         <button style={styles.button} onClick={handleGenerateQuiz}>
//           Generate Quiz
//         </button>
//         {quiz.length > 0 && (
//           <button style={{ ...styles.button, ...styles.downloadButton }} onClick={handleDownload}>
//             Download
//           </button>
//         )}
//       </div>

//       {loading && (
//         <div style={styles.loadingBox}>
//           <p>{progressText}</p>
//           <progress style={{ width: '100%' }} />
//         </div>
//       )}

//       {quiz.length > 0 && (
//         <div style={styles.quizBox}>
//           <h3>Generated Quiz:</h3>
//           {quiz.map((q, idx) => (
//             <div key={idx} style={styles.questionBox}>
//               <p style={styles.question}>
//                 <strong>Q{idx + 1}:</strong> {q.question}
//               </p>
              
//               <div style={{ marginBottom: 12 }}>
//                 <strong style={{ color: '#93C5FD' }}>Options:</strong>
//                 {Object.entries(q.options).map(([key, value]) => (
//                   <div key={key} style={{ 
//                     margin: '4px 0', 
//                     padding: '8px 12px', 
//                     backgroundColor: key === q.correct_answer ? '#065F46' : '#374151',
//                     borderRadius: 4,
//                     color: key === q.correct_answer ? '#D1FAE5' : '#F3F4F6'
//                   }}>
//                     <strong>{key}:</strong> {value}
//                     {key === q.correct_answer && <span style={{ marginLeft: 8, color: '#34D399' }}>✓</span>}
//                   </div>
//                 ))}
//               </div>

//               <p style={{ ...styles.answer, color: '#34D399' }}>
//                 <strong>Correct Answer:</strong> {q.correct_answer}
//               </p>
              
//               {q.explanation && (
//                 <p style={{ ...styles.answer, color: '#FDE68A', fontStyle: 'italic' }}>
//                   <strong>Explanation:</strong> {q.explanation}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default QuizComponent;


import React, { useState } from 'react';

function QuizComponent() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);

  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({}); // user selections
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected?.name || '');
  };

  const handleGenerateQuiz = async () => {
    if (!file && !text.trim()) {
      alert('Please provide text or upload a file.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text.trim());
    formData.append('num_questions', numQuestions);

    setLoading(true);
    setProgressText('Generating quiz...');
    try {
      const res = await fetch('http://localhost:5000/quiz', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (Array.isArray(data.quiz)) {
        setQuiz(data.quiz);
        setAnswers({});
        setSubmitted(false);
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
    setText('');
    setFile(null);
    setFileName('');
    setQuiz([]);
    setAnswers({});
    setSubmitted(false);
  };

  const handleDownload = () => {
    if (quiz.length === 0) return;

    const content = quiz
      .map((q, idx) => {
        const options = Object.entries(q.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
        return `Q${idx + 1}: ${q.question}\n\nOptions:\n${options}\n\nCorrect Answer: ${q.correct_answer}\nExplanation: ${q.explanation}\n\n${'='.repeat(50)}\n`;
      })
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'quiz.txt';
    link.click();
  };

  const handleOptionSelect = (index, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [index]: option }));
  };

  const handleSubmitAll = () => {
    if (Object.keys(answers).length < quiz.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    setSubmitted(true);
  };

  const styles = {
    container: {
      maxWidth: 700,
      margin: '40px auto',
      textAlign: 'center',
      padding: 20,
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      borderRadius: 8,
    },
    uploadBox: {
      border: '2px dashed #3d3d3d',
      borderRadius: 8,
      padding: '40px 20px',
      color: '#ccc',
      cursor: 'pointer',
      margin: '20px 0',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isHovering ? '#374151' : '#192231',
      transition: 'background 0.3s',
    },
    textarea: {
      width: '100%',
      minHeight: 150,
      background: '#1F2938',
      color: '#fff',
      border: '1px solid #333',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      resize: 'vertical',
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 20,
      gap: 12,
    },
    button: {
      padding: '10px 20px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      color: 'white',
      backgroundColor: '#4F46E5',
    },
    clearButton: {
      backgroundColor: '#374151',
    },
    downloadButton: {
      backgroundColor: '#AEB1CA',
    },
    loadingBox: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#20283A',
      borderRadius: 6,
      textAlign: 'center',
    },
    quizBox: {
      marginTop: 24,
      background: '#111827',
      padding: 20,
      borderRadius: 8,
      textAlign: 'left',
    },
    questionBox: {
      marginBottom: 16,
      background: '#1E293B',
      padding: 16,
      borderRadius: 8,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    },
    question: {
      color: '#93C5FD',
      fontSize: '1rem',
      marginBottom: 8,
    },
    option: (isSelected, isCorrect, isSubmitted) => ({
      margin: '6px 0',
      padding: '10px',
      borderRadius: 6,
      cursor: isSubmitted ? 'default' : 'pointer',
      backgroundColor: isSelected ? '#2563EB' : '#374151',
      color: '#fff',
      border: isSubmitted && isCorrect ? '2px solid #10B981' : '1px solid #333',
    }),
    submitAll: {
      marginTop: 30,
      backgroundColor: '#10B981',
    },
    explanation: {
      color: '#FBBF24',
      fontStyle: 'italic',
      marginTop: 10,
    },
  };

  return (
    <div style={styles.container}>
      <h2>Quiz Generator</h2>
      <label
        style={styles.uploadBox}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input type="file" onChange={handleFileChange} hidden />
        <div>
          📤 <strong>Click to upload</strong><br />
          {fileName && <p style={{ fontSize: 14, color: '#ccc' }}>📄 {fileName}</p>}
        </div>
      </label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or paste your text here..."
        style={styles.textarea}
      />
      <div style={{ marginTop: 16 }}>
        <label style={{ color: '#fff' }}>
          Number of Questions:&nbsp;
          <input
            type="number"
            min="1"
            max="20"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            style={{
              padding: '6px',
              borderRadius: 6,
              border: '1px solid #555',
              width: 60,
              backgroundColor: '#111',
              color: '#fff'
            }}
          />
        </label>
      </div>
      <div style={styles.actions}>
        <button style={{ ...styles.button, ...styles.clearButton }} onClick={handleClear}>
          Clear
        </button>
        <button style={styles.button} onClick={handleGenerateQuiz}>
          Generate Quiz
        </button>
        {quiz.length > 0 && (
          <button style={{ ...styles.button, ...styles.downloadButton }} onClick={handleDownload}>
            Download
          </button>
        )}
      </div>

      {loading && (
        <div style={styles.loadingBox}>
          <p>{progressText}</p>
          <progress style={{ width: '100%' }} />
        </div>
      )}

      {quiz.length > 0 && (
        <div style={styles.quizBox}>
          <h3>Attempt the Quiz:</h3>
          {quiz.map((q, idx) => {
            const selected = answers[idx];
            const isCorrect = selected === q.correct_answer;

            return (
              <div key={idx} style={styles.questionBox}>
                <p style={styles.question}>
                  <strong>Q{idx + 1}:</strong> {q.question}
                </p>

                {Object.entries(q.options).map(([key, value]) => (
                  <div
                    key={key}
                    style={styles.option(selected === key, q.correct_answer === key, submitted)}
                    onClick={() => handleOptionSelect(idx, key)}
                  >
                    <strong>{key}:</strong> {value}
                    {submitted && key === q.correct_answer && (
                      <span style={{ marginLeft: 8, color: '#34D399' }}>✓</span>
                    )}
                  </div>
                ))}

                {submitted && (
                  <>
                    <p style={{ color: isCorrect ? '#10B981' : '#EF4444', marginTop: 10 }}>
                      {isCorrect ? 'Correct!' : `Incorrect. Correct Answer: ${q.correct_answer}`}
                    </p>
                    <p style={styles.explanation}>
                      Explanation: {q.explanation}
                    </p>
                  </>
                )}
              </div>
            );
          })}

          {!submitted && (
            <button
              onClick={handleSubmitAll}
              style={{ ...styles.button, ...styles.submitAll }}
            >
              Submit All
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizComponent;
