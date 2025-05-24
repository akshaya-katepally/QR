// components/MainAppView.jsx
import React, { useState } from 'react';
import Header from './Header';
import Summarizer from './Summarizer';
import Flashcards from './Flashcards';
import QnAGenerator from './QnAGenerator';

export default function MainAppView() {
  const [activeTab, setActiveTab] = useState('summarize');
  const [qnaData, setQnaData] = useState([]);
  const [flashcardsData, setFlashcardsData] = useState([]);

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'summarize' && (
        <Summarizer setQnaData={setQnaData} setFlashcardsData={setFlashcardsData} />
      )}
      {activeTab === 'qna' && (
        <QnAGenerator qnaData={qnaData} setQnaData={setQnaData} />
      )}
      {activeTab === 'flashcards' && (
        <Flashcards flashcardsData={flashcardsData} setFlashcardsData={setFlashcardsData} />
      )}
    </div>
  );
}
