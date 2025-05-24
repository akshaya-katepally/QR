import React, { useState } from 'react';

function Summarizer({ setQnaData, setFlashcardsData }) {
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [summaryLevel, setSummaryLevel] = useState('summary');
  const [generateFlashcards, setGenerateFlashcards] = useState(true);
  const [generateQnA, setGenerateQnA] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSummarize = async () => {
    if (files.length === 0 && !text.trim()) {
      alert('Please provide text or upload at least one file.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('pdf_files', file));
    if (text.trim()) formData.append('texts', text.trim());
    formData.append('summary_level', summaryLevel);

    try {
      setLoading(true);
      setProgressText('Generating summary...');

      const res = await fetch('http://localhost:5000/summarizes', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setResult(data.summary || 'No summary returned.');

      if (generateQnA) {
        setProgressText('Generating QnA...');
        const qnaForm = new FormData();
        if (files[0]) qnaForm.append('file', files[0]);
        if (text.trim()) qnaForm.append('text', text.trim());

        const qnaRes = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: qnaForm
        });
        const qna = await qnaRes.json();
        setQnaData(qna.answers || []);
      }

      if (generateFlashcards) {
        setProgressText('Generating flashcards...');
        const fcForm = new FormData();
        if (files[0]) fcForm.append('file', files[0]);
        if (text.trim()) fcForm.append('texts', text.trim());

        const fcRes = await fetch('http://localhost:5000/uploads', {
          method: 'POST',
          body: fcForm
        });
        const fc = await fcRes.json();
        setFlashcardsData(fc.summary || []);
      }

      setProgressText('Done!');
    } catch (err) {
      console.error('Error:', err);
      setResult('Error contacting backend.');
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
      flexWrap: 'wrap',
      marginTop: 20,
      gap: 12,
    },
    select: {
      background: '#374151',
      color: 'white',
      border: 'none',
      padding: 8,
      borderRadius: 4,
    },
    label: {
      color: '#ccc',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    button: {
      padding: '10px 20px',
      borderRadius: 6,
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      backgroundColor: '#4F46E5',
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
  };

  return (
    <div style={styles.container}>
      <h2>Instant Summarize + QnA + Flashcards</h2>

      <label style={styles.uploadBox}>
        <input type="file" onChange={handleFileChange} multiple hidden />
        <div>
          📤 <strong>Click to upload</strong><br />
          {files.map((file, idx) => <p key={idx}>📄 {file.name}</p>)}
        </div>
      </label>

      <textarea
        style={styles.textarea}
        placeholder="Or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>

      <div style={styles.actions}>
        <select
          value={summaryLevel}
          onChange={(e) => setSummaryLevel(e.target.value)}
          style={styles.select}
        >
          <option value="abstract">Abstract</option>
          <option value="summary">Summary</option>
          <option value="article">Article</option>
        </select>

        <label style={styles.label}>
          <input
            type="checkbox"
            checked={generateFlashcards}
            onChange={() => setGenerateFlashcards(!generateFlashcards)}
          />
          Generate Flashcards
        </label>

        <label style={styles.label}>
          <input
            type="checkbox"
            checked={generateQnA}
            onChange={() => setGenerateQnA(!generateQnA)}
          />
          Generate QnA
        </label>

        <button style={styles.button} onClick={handleSummarize}>Summarize</button>
      </div>

      {loading && (
        <div style={styles.loadingBox}>
          <p>{progressText}</p>
          <progress style={{ width: '100%' }} />
        </div>
      )}

      {result && (
        <div style={styles.resultBox}>
          <h3>Summary:</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default Summarizer;
