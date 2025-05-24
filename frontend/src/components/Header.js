import React from 'react';

function Header({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="logo">Quick Recap</div>
      <div className="nav-links">
        <button
          className={activeTab === 'summarize' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('summarize')}
        >
          Summarize
        </button>
        <button
          className={activeTab === 'qna' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('qna')}
        >
          QnA
        </button>
        <button
          className={activeTab === 'flashcards' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setActiveTab('flashcards')}
        >
          Flashcards
        </button>
      </div>
    </nav>
  );
}

export default Header;
