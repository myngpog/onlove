import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FloatingWords from './FloatingWords';
import About from './About.jsx';


function Home() {
  const [inputValue, setInputValue] = useState("")
  const [newDefinition, setNewDefinition] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const trimmed = inputValue.trim();
    if (trimmed) {
      try {
        await fetch('http://localhost:3001/api/addDefinitions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        });

        setNewDefinition(trimmed);
        setInputValue("");
      } catch (err) {
        console.error("Error submitting definition:", err);
      }
    }
  };

  return (
    <>
      <FloatingWords newEntry={newDefinition} />

      <header className="header">
        <Link to="/about" className="about">about the project</Link>
      </header>

      <div className="container">
        <h1 className="title">What is love?</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="input-line"
            type="text"
            placeholder="in its purest, rawest form"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
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
