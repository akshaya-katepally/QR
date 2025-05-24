import React, { useState } from 'react';
import Header from './components/Header';
import Summarizer from './components/Summarizer';
import Flashcards from './components/Flashcards';
import QnAGenerator from './components/QnAGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('summarize');
  const [qnaData, setQnaData] = useState([]);
  const [flashcardsData, setFlashcardsData] = useState([]);

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'summarize' && (
        <Summarizer setQnaData={setQnaData} setFlashcardsData={setFlashcardsData} />
      )}
      {activeTab === 'qna' && <QnAGenerator qnaData={qnaData} setQnaData={setQnaData} />}
      {activeTab === 'flashcards' && <Flashcards flashcardsData={flashcardsData} setFlashcardsData={setFlashcardsData} />}
    </div>
  );
}

export default App;
