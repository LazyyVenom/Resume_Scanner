import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [resume, setResume] = useState(null)
  const [reviewResults, setReviewResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [darkTheme, setDarkTheme] = useState(true) // Default to dark theme

  useEffect(() => {
    // Apply dark theme class to root element
    if (darkTheme) {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [darkTheme])

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setResume(e.target.result)
        // In a real app, you would send the file to your backend
        scanResume(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const scanResume = async (resumeContent) => {
    setIsLoading(true)
    // Simulate API call to analyze resume
    // In a real app, replace with actual API call
    setTimeout(() => {
      setReviewResults({
        score: 85,
        strengths: ["Strong technical skills", "Good education background", "Clear formatting"],
        improvements: ["Add more quantifiable achievements", "Include more keywords from job description", "Expand on leadership experience"]
      })
      setIsLoading(false)
    }, 1500)
  }

  const toggleTheme = () => {
    setDarkTheme(prev => !prev)
  }

  return (
    <div className="app-container">
      <button 
        className="theme-toggle" 
        onClick={toggleTheme} 
        aria-label="Toggle dark mode"
      >
        {darkTheme ? '☀️' : '🌙'}
      </button>
      
      <header className="app-header">
        <h1 className="app-title">Resume Scanner</h1>
      </header>
      
      <div className="upload-section">
        <label className="file-label">Upload Resume (PDF or TXT)</label>
        <input
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>
      
      <div className="content-container">
        {/* Left side - Resume Display */}
        <div className="panel">
          <h2 className="panel-title">Your Resume</h2>
          {resume ? (
            <div className="resume-view">{resume}</div>
          ) : (
            <div className="empty-state">
              Upload a resume to see it here
            </div>
          )}
        </div>
        
        {/* Right side - Review Results */}
        <div className="panel">
          <h2 className="panel-title">Review Results</h2>
          {isLoading ? (
            <div className="loader">
              <div className="spinner"></div>
            </div>
          ) : reviewResults ? (
            <div>
              <div className="score-section">
                <h3 className="score-title">Overall Score</h3>
                <div className="score-value">{reviewResults.score}/100</div>
              </div>
              
              <div className="list-section">
                <h3 className="list-title">Strengths</h3>
                <ul className="list-items">
                  {reviewResults.strengths.map((item, index) => (
                    <li key={index} className="list-item-strength">{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="list-section">
                <h3 className="list-title">Areas for Improvement</h3>
                <ul className="list-items">
                  {reviewResults.improvements.map((item, index) => (
                    <li key={index} className="list-item-improvement">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              Upload a resume to see feedback here
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
