import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MainAppView from './components/MainAppView'; // Import the wrapper

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainAppView />} />
      </Routes>
    </Router>
  );
}

export default App;
