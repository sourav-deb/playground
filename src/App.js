import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@/App.css';
import { Home } from '@/pages/Home';
import { RPSGame } from '@/games/RPS/RPSGame';
import { Game1024 } from '@/games/1024/Game1024';
import { SemantrisGame } from '@/games/Semantris/SemantrisGame';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-[#0F172A] text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rps" element={<RPSGame />} />
          <Route path="/1024" element={<Game1024 />} />
          <Route path="/semantris" element={<SemantrisGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;