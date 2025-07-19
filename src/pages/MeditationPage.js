import React, { useState, useEffect } from 'react';
import { meditations, categories } from '../data/meditations';

const MeditationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [customTimer, setCustomTimer] = useState(5);
  const [isCustomTimer, setIsCustomTimer] = useState(false);

  const filteredMeditations = selectedCategory === 'All' 
    ? meditations 
    : meditations.filter(meditation => meditation.category === selectedCategory);

  useEffect(() => {
    let interval;
    if (isPlaying && totalTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= totalTime) {
            setIsPlaying(false);
            alert('Meditation session complete! Great job! 🧘‍♂️');
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalTime]);

  const startMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    setTotalTime(parseInt(meditation.duration) * 60); // Convert minutes to seconds
    setCurrentTime(0);
    setIsCustomTimer(false);
  };

  const startCustomTimer = () => {
    setSelectedMeditation(null);
    setTotalTime(customTimer * 60);
    setCurrentTime(0);
    setIsCustomTimer(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (totalTime === 0) return 0;
    return (currentTime / totalTime) * 100;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Guided Meditation</h1>
        <p className="page-description">
          Find peace and calm with our collection of guided meditations and mindfulness exercises.
        </p>
      </div>

      {/* Active Session */}
      {(selectedMeditation || isCustomTimer) && (
        <div className="meditation-player">
          <div className="player-header">
            <h3 className="player-title">
              {isCustomTimer ? 'Custom Meditation Timer' : selectedMeditation.title}
            </h3>
            <button onClick={() => {
              setSelectedMeditation(null);
              setIsCustomTimer(false);
              setIsPlaying(false);
              setCurrentTime(0);
            }} className="close-player-btn">
              ×
            </button>
          </div>
          
          <div className="player-timer">
            <div className="time-display">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="separator">/</span>
              <span className="total-time">{formatTime(totalTime)}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className="player-controls">
            <button onClick={togglePlayPause} className="play-pause-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={resetTimer} className="reset-btn">
              🔄
            </button>
          </div>

          {selectedMeditation && !isCustomTimer && (
            <div className="meditation-instructions">
              <h4>Instructions:</h4>
              <ol className="instruction-list">
                {selectedMeditation.instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Custom Timer Section */}
      <div className="custom-timer-section">
        <h2 className="section-title">Custom Meditation Timer</h2>
        <div className="custom-timer-controls">
          <label className="timer-label">
            Duration (minutes):
            <input
              type="number"
              min="1"
              max="60"
              value={customTimer}
              onChange={(e) => setCustomTimer(parseInt(e.target.value))}
              className="timer-input"
            />
          </label>
          <button onClick={startCustomTimer} className="start-timer-btn">
            Start Custom Timer
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Browse Guided Meditations:</h3>
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Meditations Grid */}
      <div className="meditations-grid">
        {filteredMeditations.map(meditation => (
          <div key={meditation.id} className="meditation-card">
            <div className="meditation-header">
              <span className="meditation-duration">{meditation.duration}</span>
              <span className="meditation-category">{meditation.category}</span>
            </div>
            <h3 className="meditation-title">{meditation.title}</h3>
            <p className="meditation-description">{meditation.description}</p>
            <button 
              onClick={() => startMeditation(meditation)}
              className="start-meditation-btn"
            >
              Start Meditation
            </button>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h2 className="section-title">Benefits of Regular Meditation</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🧘‍♀️</div>
            <h3 className="benefit-title">Reduces Stress</h3>
            <p className="benefit-description">
              Regular meditation helps lower cortisol levels and reduce overall stress.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🧠</div>
            <h3 className="benefit-title">Improves Focus</h3>
            <p className="benefit-description">
              Meditation strengthens your ability to concentrate and maintain attention.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">😴</div>
            <h3 className="benefit-title">Better Sleep</h3>
            <p className="benefit-description">
              Meditation can help calm the mind and improve sleep quality.
            </p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">❤️</div>
            <h3 className="benefit-title">Emotional Well-being</h3>
            <p className="benefit-description">
              Regular practice can increase self-awareness and emotional regulation.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <h2 className="section-title">Meditation Tips for Beginners</h2>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-number">1</span>
            <div className="tip-content">
              <h4>Start Small</h4>
              <p>Begin with just 5 minutes a day and gradually increase the duration.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-number">2</span>
            <div className="tip-content">
              <h4>Find a Quiet Space</h4>
              <p>Choose a peaceful location where you won't be disturbed.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-number">3</span>
            <div className="tip-content">
              <h4>Be Consistent</h4>
              <p>Try to meditate at the same time each day to build a habit.</p>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-number">4</span>
            <div className="tip-content">
              <h4>Don't Judge</h4>
              <p>It's normal for your mind to wander. Gently bring your attention back.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditationPage; 