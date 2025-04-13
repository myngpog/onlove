import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FloatingWords from './FloatingWords';
import About from './About.jsx';
import { bannedWords } from './blockList.js';

function containsSlur(text) {
  const lowered = text.toLowerCase();
  return bannedWords.some(word => lowered.includes(word));
}

function Home() {
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(0);
  const [inputValue, setInputValue] = useState("")
  const [newDefinition, setNewDefinition] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (isCooldown) {
      alert(`maybe take some time to read :)`);
      return;
    }
  
    const trimmed = inputValue.trim();
    if (!trimmed) return;
  
    if (containsSlur(trimmed)) {
      alert("Please keep it kind and respectful.");
      return;
    }
  
    try {
      await fetch('http://localhost:3001/api/addDefinitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
  
      setNewDefinition(trimmed);
      setInputValue('');
  
      setIsCooldown(true);
      setCooldownTimeLeft(120);
  
      const interval = setInterval(() => {
        setCooldownTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Error submitting definition:", err);
    }
  };
  return (
    <>
      <FloatingWords newEntry={newDefinition} />

      <header className="header">
        <Link to="/about" className="about">about this project</Link>
      </header>

      <div className="container">
        <h1 className="title">What is love?</h1>
        <form onSubmit={handleSubmit}>
        <input
          className="input-line"
          type="text"
          placeholder={
            isCooldown
              ? `take some time to read :)`
              : "in its purest, rawest form"
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isCooldown}
        />
        </form>
      </div>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
