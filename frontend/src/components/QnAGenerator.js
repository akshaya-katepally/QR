import React, { useState } from "react";

function QnAGenerator({ qnaData = [], setQnaData }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setFileName(selected?.name || '');
  };

  const handleGenerateQnA = async () => {
    if (!file && !text.trim()) {
      alert('Please provide text or upload a file.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text.trim());

    try {
      setLoading(true);
      setProgressText('Generating QnA...');

      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setQnaData(data.answers || []);
      setProgressText('Done!');
    } catch (err) {
      console.error(err);
      setProgressText('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setFile(null);
    setFileName('');
    setQnaData([]);
  };

  const handleDownload = () => {
    if (qnaData.length === 0) return;

    const content = qnaData
      .map(pair => `Q: ${pair.question}\nA: ${pair.answer}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'qna.txt';
    link.click();
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
      backgroundColor: isHovering ? '#374151' : '#192231',
      transition: 'background 0.3s',
    },
    textarea: {
      width: '100%',
      minHeight: 150,
      background: '#1F2938',
      color: 'white',
      border: '1px solid #333',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      resize: 'vertical',
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 20,
    },
    button: {
      padding: '10px 20px',
      borderRadius: 6,
      border: 'none',
      cursor: 'pointer',
      color: 'white',
    },
    generateBtn: {
      background: '#4F46E5',
    },
    clearBtn: {
      background: '#374151',
    },
    downloadBtn: {
      background: '#AEB1CA',
    },
    loadingBox: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#20283A',
      //border: '1px solid #cbd5e1',
      borderRadius: 6,
      textAlign: 'center',
    },
    resultBox: {
      background: '#111827',
      padding: 20,
      borderRadius: 8,
      marginTop: 24,
      textAlign: 'left',
    },
  };

  return (
    <div style={styles.container}>
      <h2>Instant QnA Generator</h2>

      <label
        style={styles.uploadBox}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input type="file" onChange={handleFileChange} hidden />
        <div>
          {/* <div style={{ fontSize: 32 }}>📤</div>
          <strong>Click to upload</strong><br /> */}
          📤 <strong>Click to upload</strong><br />
          {/* <p style={{ fontSize: 14, color: '#aaa' }}>PDF, DOCX, TXT files supported</p> */}
          {fileName && <p style={{ fontSize: 14, color: '#ccc' }}>📄 {fileName}</p>}
        </div>
      </label>

      <textarea
        placeholder="Or paste your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={styles.textarea}
      />

      <div style={styles.actions}>
        <button style={{ ...styles.button, ...styles.clearBtn }} onClick={handleClear}>
          Clear
        </button>
        <button style={{ ...styles.button, ...styles.generateBtn }} onClick={handleGenerateQnA}>
          Generate QnA
        </button>
        {qnaData.length > 0 && (
          <button style={{ ...styles.button, ...styles.downloadBtn }} onClick={handleDownload}>
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

      {qnaData.length > 0 && (
        <div style={styles.resultBox}>
          <h3>Generated QnA:</h3>
          <ul>
            {qnaData.map((pair, idx) => (
              <li key={idx}>
                <strong>Q:</strong> {pair.question}<br />
                <strong>A:</strong> {pair.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default QnAGenerator;
