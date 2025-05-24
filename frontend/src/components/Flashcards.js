// import React, { useState } from 'react';
// import '../App.css';

// function Flashcards({ flashcardsData = [], setFlashcardsData }) {
//   const [file, setFile] = useState(null);
//   const [fileName, setFileName] = useState('');
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [progressText, setProgressText] = useState('');

//   const handleFileChange = (e) => {
//     const selected = e.target.files[0];
//     setFile(selected);
//     setFileName(selected?.name || '');
//   };

//   const handleGenerateFlashcards = async () => {
//     if (!file && !text.trim()) {
//       alert('Please provide text or upload a file.');
//       return;
//     }

//     const formData = new FormData();
//     if (file) formData.append('file', file);
//     if (text.trim()) formData.append('texts', text.trim());

//     try {
//       setLoading(true);
//       setProgressText('Generating flashcards...');

//       const res = await fetch('http://localhost:5000/uploads', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       setFlashcardsData(data.summary || []);
//       setProgressText('Done!');
//     } catch (err) {
//       console.error(err);
//       setProgressText('An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     container: {
//       maxWidth: 700,
//       margin: '40px auto',
//       textAlign: 'center',
//       padding: 20,
//       color: '#fff',
//       fontFamily: 'Segoe UI, sans-serif',
//       backgroundColor: '#0f1117',
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
//       backgroundColor: '#1d1f24',
//       transition: 'background 0.3s',
//     },   
//     textarea: {
//       width: '100%',
//       minHeight: 150,
//       background: '#1c1f26',
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
//       flexWrap: 'wrap',
//       marginTop: 20,
//       gap: 12,
//     },
//     select: {
//       background: '#2b2e34',
//       color: 'white',
//       border: 'none',
//       padding: 8,
//       borderRadius: 4,
//     },
//     label: {
//       color: '#ccc',
//       display: 'flex',
//       alignItems: 'center',
//       gap: 6,
//     },
//     button: {
//       padding: '10px 20px',
//       borderRadius: 6,
//       border: 'none',
//       color: 'white',
//       cursor: 'pointer',
//       backgroundColor: '#7048e8',
//     },
//     loadingBox: {
//       marginTop: 10,
//       padding: 10,
//       backgroundColor: '#586caedc',
//       border: '1px solid #cbd5e1',
//       borderRadius: 6,
//       textAlign: 'center',
//     },
//     resultBox: {
//       background: '#1d1f24',
//       padding: 20,
//       borderRadius: 8,
//       marginTop: 24,
//       textAlign: 'left',
//       whiteSpace: 'pre-wrap',
//     },
//   };

//   return (
//     <div className="summarizer-container">
//       <h2>Flashcard Generator</h2>

//       <label className="upload-box">
//         <input type="file" onChange={handleFileChange} hidden />
//         <div>
//           📤 <strong>Click to upload</strong><br />
//           {fileName && <p>📄 {fileName}</p>}
//         </div>
//       </label>

//       <textarea
//         placeholder="Or paste your text here..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       ></textarea>

//       <div className="actions">
//         <button className="summarize-btn" onClick={handleGenerateFlashcards}>
//           Generate Flashcards
//         </button>

//         <button className="clear-btn" onClick={() => {
//           setText('');
//           setFile(null);
//           setFileName('');
//           setFlashcardsData([]);
//         }}>
//           Clear
//         </button>

//         {flashcardsData.length > 0 && (
//           <button className="download-btn" onClick={() => {
//             const blob = new Blob([flashcardsData.join('\n\n')], { type: 'text/plain;charset=utf-8' });
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             link.download = 'flashcards.txt';
//             link.click();
//           }}>
//             ⬇ Download
//           </button>
//         )}
//       </div>

//       {loading && (
//         <div className="loading-box">
//           <p>{progressText}</p>
//           <progress style={{ width: '100%' }} />
//         </div>
//       )}

//       {flashcardsData.length > 0 && (
//         <div className="result-box">
//           <h3>Flashcards:</h3>
//           {flashcardsData.map((item, idx) => (
//             <div className="flashcard" key={idx}>
//               <div className="flashcard-inner">
//                 <div className="flashcard-front">{item}</div>
//                 <div className="flashcard-back">Try to recall!</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Flashcards;

import React, { useState } from 'react';

function Flashcards({ flashcardsData = [], setFlashcardsData }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected?.name || '');
  };

  const handleGenerateFlashcards = async () => {
    if (!file && !text.trim()) {
      alert('Please provide text or upload a file.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('texts', text.trim());

    try {
      setLoading(true);
      setProgressText('Generating flashcards...');

      const res = await fetch('http://localhost:5000/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setFlashcardsData(data.summary || []);
      setProgressText('Done!');
    } catch (err) {
      console.error(err);
      setProgressText('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 700,
      margin: '40px auto',
      textAlign: 'center',
      padding: 20,
      color: '#fff',
      fontFamily: 'Segoe UI, sans-serif',
      //backgroundColor: '#0f1117',
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
      //backgroundColor: '#1d1f24',
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
      color: 'white',
      cursor: 'pointer',
      backgroundColor: '#4F46E5',
    },
    clearButton: {
      backgroundColor: '#374151',
    },
    downloadButton: {
      backgroundColor: '#198754',
    },
    loadingBox: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#586caedc',
      border: '1px solid #cbd5e1',
      borderRadius: 6,
      textAlign: 'center',
    },
    resultBox: {
      background: '#111827',
      padding: 20,
      borderRadius: 8,
      marginTop: 24,
      textAlign: 'left',
      whiteSpace: 'pre-wrap',
    },
    flashcard: {
      backgroundColor: '#292c33',
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      cursor: 'default',
      color: '#fff',
      userSelect: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Flashcard Generator</h2>

      <label style={styles.uploadBox}>
        <input type="file" onChange={handleFileChange} hidden />
        <div>
          📤 <strong>Click to upload</strong><br />
          {fileName && <p style={{ color: '#ccc' }}>📄 {fileName}</p>}
        </div>
      </label>

      <textarea
        placeholder="Or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.actions}>
      <button
    style={{ ...styles.button, ...styles.clearButton }}
    onClick={() => {
      setText('');
      setFile(null);
      setFileName('');
      setFlashcardsData([]);
    }}
  >
    Clear
  </button>

  <button style={styles.button} onClick={handleGenerateFlashcards}>
    Generate Flashcards
  </button>

        {flashcardsData.length > 0 && (
          <button
            style={{ ...styles.button, ...styles.downloadButton }}
            onClick={() => {
              const blob = new Blob([flashcardsData.join('\n\n')], {
                type: 'text/plain;charset=utf-8',
              });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = 'flashcards.txt';
              link.click();
            }}
          >
            ⬇ Download
          </button>
        )}
      </div>

      {loading && (
        <div style={styles.loadingBox}>
          <p>{progressText}</p>
          <progress style={{ width: '100%' }} />
        </div>
      )}

      {flashcardsData.length > 0 && (
        <div style={styles.resultBox}>
          <h3>Flashcards:</h3>
          {flashcardsData.map((item, idx) => (
            <div key={idx} style={styles.flashcard}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Flashcards;
