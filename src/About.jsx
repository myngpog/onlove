import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function About() {
    return (
    <>
    <header className="header">
        <Link to="/" className="about">go back</Link>
    </header>
    <div>
        <p className="about-text">
            A gentle reminder of what it means to be alive.<br />
            A complimentary addition to my debut novel, this social project explores what love is; in all its forms and definitions.
        </p>
        <div className="credits">
            <p>Made with love by</p>
            <a href="https://mynguyen.vercel.app/" target="_blank" rel="noopener noreferrer">concept</a>
            <a href="https://art-of-tamngu.vercel.app/" target="_blank" rel="noopener noreferrer">art</a>
        </div>
        <a href="https://your-db-site.com" className="link-button" target="_blank" rel="noopener noreferrer">definitions</a>
    </div>
    </>
    )
  }
  
  export default About
  