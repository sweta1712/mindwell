import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStats } from '../context/GameStatsContext';
import { useAuth } from '../context/AuthContext';
// eslint-disable-next-line no-unused-vars
import { TrendingUp, Trophy, Calendar, Target, LogOut } from 'lucide-react';

const MindGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState(null);
  const { gameStats, updateGameStats } = useGameStats();
  const { user, isAuthenticated } = useAuth();

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match pairs of cards to improve memory and focus',
      icon: '🧠',
      category: 'Memory',
      difficulty: 'Easy',
      benefits: ['Improves memory', 'Enhances concentration', 'Reduces anxiety'],
      color: 'purple'
    },
    {
      id: 'breathing',
      title: 'Breathing Bubbles',
      description: 'Follow the breathing patterns to find your calm',
      icon: '🫧',
      category: 'Relaxation',
      difficulty: 'Easy',
      benefits: ['Reduces stress', 'Calms mind', 'Improves focus'],
      color: 'blue'
    },
    {
      id: 'colors',
      title: 'Color Harmony',
      description: 'Match colors quickly to boost mood and alertness',
      icon: '🌈',
      category: 'Focus',
      difficulty: 'Medium',
      benefits: ['Boosts mood', 'Improves reaction time', 'Reduces tension'],
      color: 'rainbow'
    },
    {
      id: 'puzzle',
      title: 'Sliding Zen',
      description: 'Solve sliding puzzles for mindful problem-solving',
      icon: '🧩',
      category: 'Logic',
      difficulty: 'Medium',
      benefits: ['Enhances logic', 'Promotes mindfulness', 'Builds patience'],
      color: 'green'
    },
    {
      id: 'words',
      title: 'Word Flow',
      description: 'Connect words and let your thoughts flow freely',
      icon: '💭',
      category: 'Creativity',
      difficulty: 'Easy',
      benefits: ['Stimulates creativity', 'Improves mood', 'Reduces worry'],
      color: 'yellow'
    },
    {
      id: 'stress-ball',
      title: 'Digital Stress Ball',
      description: 'Click to release tension and track your stress relief',
      icon: '⚽',
      category: 'Relief',
      difficulty: 'Easy',
      benefits: ['Releases tension', 'Provides quick relief', 'Improves mood'],
      color: 'orange'
    },
    {
      id: 'patterns',
      title: 'Pattern Quest',
      description: 'Recognize patterns to sharpen cognitive abilities',
      icon: '🔍',
      category: 'Cognitive',
      difficulty: 'Hard',
      benefits: ['Sharpens mind', 'Improves focus', 'Builds confidence'],
      color: 'indigo'
    },
    {
      id: 'focus-dot',
      title: 'Mindful Dot',
      description: 'Follow the moving dot for meditation and focus',
      icon: '🎯',
      category: 'Meditation',
      difficulty: 'Easy',
      benefits: ['Improves mindfulness', 'Reduces anxiety', 'Enhances focus'],
      color: 'teal'
    },
    {
      id: 'quick-math',
      title: 'Math Zen',
      description: 'Solve simple math problems for mental clarity',
      icon: '🔢',
      category: 'Logic',
      difficulty: 'Medium',
      benefits: ['Clears mind', 'Builds confidence', 'Reduces overthinking'],
      color: 'red'
    },
    {
      id: 'drawing',
      title: 'Zen Doodle',
      description: 'Free drawing canvas for creative expression',
      icon: '🎨',
      category: 'Creativity',
      difficulty: 'Easy',
      benefits: ['Promotes relaxation', 'Encourages expression', 'Reduces stress'],
      color: 'pink'
    }
  ];

  // Memory Game Component
  const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const emojis = ['🌸', '🌻', '🌺', '🌷', '🌹', '🌼', '💐', '🌿'];

    const initializeGame = () => {
      const shuffledCards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, isFlipped: false }));
      setCards(shuffledCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameWon(false);
    };

    useEffect(() => {
      const shuffledCards = [...emojis, ...emojis]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, isFlipped: false }));
      setCards(shuffledCards);
      setFlipped([]);
      setMatched([]);
      setMoves(0);
      setGameWon(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCardClick = (cardIndex) => {
      if (flipped.length === 2 || flipped.includes(cardIndex) || matched.includes(cardIndex)) return;

      const newFlipped = [...flipped, cardIndex];
      setFlipped(newFlipped);

      if (newFlipped.length === 2) {
        setMoves(moves + 1);
        const [first, second] = newFlipped;
        if (cards[first].emoji === cards[second].emoji) {
          setMatched([...matched, first, second]);
          setFlipped([]);
          if (matched.length + 2 === cards.length) {
            setGameWon(true);
            // Calculate score based on moves (fewer moves = higher score)
            const score = Math.max(100 - moves * 2, 10);
            updateGameStats('Memory Match', score, true);
          }
        } else {
          setTimeout(() => setFlipped([]), 1000);
        }
      }
    };

    return (
      <div className="memory-game">
        <div className="game-header">
          <h3>🧠 Memory Match</h3>
          <div className="game-stats">
            <span>Moves: {moves}</span>
            <span>Matched: {matched.length / 2}/{emojis.length}</span>
          </div>
          <button onClick={initializeGame} className="reset-btn">🔄 Reset</button>
        </div>

        {gameWon && (
          <div className="win-message">
            <h4>🎉 Congratulations!</h4>
            <p>You completed the game in {moves} moves!</p>
          </div>
        )}

        <div className="cards-grid">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`memory-card ${
                flipped.includes(index) || matched.includes(index) ? 'flipped' : ''
              }`}
              onClick={() => handleCardClick(index)}
            >
              <div className="card-front">?</div>
              <div className="card-back">{card.emoji}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Breathing Game Component
  const BreathingGame = () => {
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
      let interval = null;
      if (isActive) {
        interval = setInterval(() => {
          setCount(count => {
            if (phase === 'inhale' && count >= 4) {
              setPhase('hold');
              return 0;
            } else if (phase === 'hold' && count >= 2) {
              setPhase('exhale');
              return 0;
            } else if (phase === 'exhale' && count >= 6) {
              setPhase('inhale');
              setCycle(c => {
                const newCycle = c + 1;
                // Auto-complete session after 5 cycles
                if (newCycle >= 5) {
                  setTimeout(() => {
                    setIsActive(false);
                    setPhase('ready');
                    const score = newCycle * 10;
                    updateGameStats('Breathing Bubbles', score, true);
                  }, 1000);
                }
                return newCycle;
              });
              return 0;
            }
            return count + 1;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isActive, phase, count]);

    const startBreathing = () => {
      setIsActive(true);
      setPhase('inhale');
      setCount(0);
      setCycle(0);
    };

    const stopBreathing = () => {
      setIsActive(false);
      setPhase('ready');
      setCount(0);
      
      // Track breathing session completion
      if (cycle > 0) {
        const score = cycle * 10; // 10 points per cycle
        updateGameStats('Breathing Bubbles', score, true);
      }
      setCycle(0);
    };

    const getPhaseInstructions = () => {
      switch (phase) {
        case 'inhale': return 'Breathe In...';
        case 'hold': return 'Hold...';
        case 'exhale': return 'Breathe Out...';
        default: return 'Click Start to Begin';
      }
    };

    return (
      <div className="breathing-game">
        <div className="game-header">
          <h3>🫧 Breathing Bubbles</h3>
          <p>Follow the 4-2-6 breathing pattern</p>
        </div>

        <div className="breathing-container">
          <div className={`breathing-circle ${phase}`}>
            <div className="bubble-container">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`bubble bubble-${i + 1}`}></div>
              ))}
            </div>
            <div className="breathing-text">
              <div className="phase-instruction">{getPhaseInstructions()}</div>
              <div className="count-display">{count}</div>
            </div>
          </div>
        </div>

        <div className="breathing-stats">
          <div className="stat">
            <span className="stat-value">{cycle}</span>
            <span className="stat-label">Cycles</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.floor(cycle * 12)}</span>
            <span className="stat-label">Seconds</span>
          </div>
        </div>

        <div className="breathing-controls">
          {!isActive ? (
            <button onClick={startBreathing} className="start-btn">🌬️ Start Breathing</button>
          ) : (
            <button onClick={stopBreathing} className="stop-btn">⏹️ Stop</button>
          )}
        </div>
      </div>
    );
  };

  // Color Matching Game Component
  const ColorGame = () => {
    const [targetColor, setTargetColor] = useState('#FF6B6B');
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#98D8C8'];

    useEffect(() => {
      generateNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      let timer = null;
      if (isPlaying && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else if (timeLeft === 0) {
        setIsPlaying(false);
        // Track Color Harmony game completion
        if (score > 0) {
          updateGameStats('Color Harmony', score, score >= 50); // Win if scored 50+ points
        }
      }
      return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, timeLeft]);

    const generateNewRound = () => {
      const target = colors[Math.floor(Math.random() * colors.length)];
      setTargetColor(target);
      
      const correctIndex = Math.floor(Math.random() * 4);
      const newOptions = Array.from({ length: 4 }, (_, i) => {
        if (i === correctIndex) return target;
        let randomColor;
        do {
          randomColor = colors[Math.floor(Math.random() * colors.length)];
        } while (randomColor === target);
        return randomColor;
      });
      setOptions(newOptions);
    };

    const handleColorClick = (color) => {
      if (!isPlaying) return;
      
      if (color === targetColor) {
        setScore(score + 10);
        generateNewRound();
      } else {
        setScore(Math.max(0, score - 5));
      }
    };

    const startGame = () => {
      setIsPlaying(true);
      setScore(0);
      setTimeLeft(30);
      generateNewRound();
    };

    return (
      <div className="color-game">
        <div className="game-header">
          <h3>🌈 Color Harmony</h3>
          <div className="game-stats">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        {!isPlaying && timeLeft === 30 ? (
          <div className="game-start">
            <p>Match the target color as quickly as possible!</p>
            <button onClick={startGame} className="start-btn">🎨 Start Game</button>
          </div>
        ) : (
          <>
            <div className="target-color-section">
              <p>Find this color:</p>
              <div className="target-color" style={{ backgroundColor: targetColor }}></div>
            </div>

            <div className="color-options">
              {options.map((color, index) => (
                <div
                  key={index}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorClick(color)}
                ></div>
              ))}
            </div>

            {timeLeft === 0 && (
              <div className="game-over">
                <h4>🎉 Game Over!</h4>
                <p>Final Score: {score}</p>
                <button onClick={startGame} className="restart-btn">🔄 Play Again</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Stress Ball Game Component
  const StressBallGame = () => {
    const [clicks, setClicks] = useState(0);
    const [isSqueezing, setIsSqueezing] = useState(false);
    const [dailyClicks, setDailyClicks] = useState(0);
    const [stressLevel, setStressLevel] = useState(100);

    const handleBallClick = () => {
      const newClicks = clicks + 1;
      const newStressLevel = Math.max(0, stressLevel - 2);
      
      setClicks(newClicks);
      setDailyClicks(dailyClicks + 1);
      setIsSqueezing(true);
      setStressLevel(newStressLevel);
      setTimeout(() => setIsSqueezing(false), 150);
      
      // Track achievements
      if (newStressLevel <= 20 && stressLevel > 20) {
        // First time reaching low stress - award points
        updateGameStats('Digital Stress Ball', 50, true);
      } else if (newClicks % 25 === 0) {
        // Award points every 25 clicks
        updateGameStats('Digital Stress Ball', 10, false);
      }
    };

    const resetCounter = () => {
      setClicks(0);
      setStressLevel(100);
    };

    const getStressColor = () => {
      if (stressLevel > 70) return '#FF6B6B';
      if (stressLevel > 40) return '#FFEAA7';
      return '#96CEB4';
    };

    const getEncouragement = () => {
      if (stressLevel < 20) return "🌟 You're feeling much calmer!";
      if (stressLevel < 50) return "😌 Great progress, keep going!";
      if (stressLevel < 80) return "💪 You're doing well!";
      return "🌱 Take a deep breath and start squeezing!";
    };

    return (
      <div className="stress-ball-game">
        <div className="game-header">
          <h3>⚽ Digital Stress Ball</h3>
          <p>Click the ball to release tension</p>
        </div>

        <div className="stress-level-indicator">
          <span>Stress Level:</span>
          <div className="stress-bar">
            <div 
              className="stress-fill" 
              style={{ 
                width: `${stressLevel}%`,
                backgroundColor: getStressColor()
              }}
            ></div>
          </div>
          <span>{stressLevel}%</span>
        </div>

        <div className="ball-container">
          <div 
            className={`stress-ball ${isSqueezing ? 'squeezed' : ''}`}
            onClick={handleBallClick}
            style={{ borderColor: getStressColor() }}
          >
            <div className="ball-face">
              {stressLevel < 30 ? '😊' : stressLevel < 70 ? '😐' : '😰'}
            </div>
          </div>
        </div>

        <div className="encouragement-text">
          {getEncouragement()}
        </div>

        <div className="click-stats">
          <div className="stat">
            <span className="stat-value">{clicks}</span>
            <span className="stat-label">Session Clicks</span>
          </div>
          <div className="stat">
            <span className="stat-value">{dailyClicks}</span>
            <span className="stat-label">Today's Clicks</span>
          </div>
        </div>

        <button onClick={resetCounter} className="reset-btn">🔄 Reset Session</button>
      </div>
    );
  };

  // Quick Math Game Component
  const QuickMathGame = () => {
    const [problem, setProblem] = useState({ num1: 0, num2: 0, operator: '+', answer: 0 });
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
      generateProblem();
    }, []);

    const generateProblem = () => {
      const operators = ['+', '-', '×'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let num1, num2, answer;

      switch (operator) {
        case '+':
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
          answer = num1 + num2;
          break;
        case '-':
          num1 = Math.floor(Math.random() * 50) + 25;
          num2 = Math.floor(Math.random() * 25) + 1;
          answer = num1 - num2;
          break;
        case '×':
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = num1 * num2;
          break;
        default:
          num1 = 1;
          num2 = 1;
          answer = 2;
      }

      setProblem({ num1, num2, operator, answer });
      setUserAnswer('');
      setFeedback('');
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const userNum = parseInt(userAnswer);
      
      if (userNum === problem.answer) {
        setScore(score + 10);
        setStreak(streak + 1);
        setFeedback('✅ Correct!');
        setTimeout(() => generateProblem(), 1000);
      } else {
        setStreak(0);
        setFeedback(`❌ Wrong! Answer: ${problem.answer}`);
        setTimeout(() => generateProblem(), 2000);
      }
    };

    return (
      <div className="math-game">
        <div className="game-header">
          <h3>🔢 Math Zen</h3>
          <div className="game-stats">
            <span>Score: {score}</span>
            <span>Streak: {streak}</span>
          </div>
        </div>

        <div className="math-problem">
          <div className="problem-display">
            {problem.num1} {problem.operator} {problem.num2} = ?
          </div>

          <form onSubmit={handleSubmit} className="answer-form">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Your answer"
              className="answer-input"
              autoFocus
            />
            <button type="submit" disabled={!userAnswer}>
              ✓ Submit
            </button>
          </form>

          {feedback && (
            <div className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>

        <div className="zen-tips">
          <p>💡 Take your time and breathe</p>
          <p>🧘‍♀️ Math can be meditative</p>
        </div>
      </div>
    );
  };

  // Drawing Canvas Component
  const DrawingCanvas = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    const colors = ['#000000', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1'];

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
    }, []);

    const startDrawing = (e) => {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(x, y);
    };

    const draw = (e) => {
      if (!isDrawing) return;
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const context = canvas.getContext('2d');
      context.lineWidth = brushSize;
      context.strokeStyle = currentColor;
      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
    };

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
      <div className="drawing-game">
        <div className="game-header">
          <h3>🎨 Zen Doodle</h3>
          <p>Express yourself freely through art</p>
        </div>

        <div className="drawing-tools">
          <div className="color-palette">
            {colors.map(color => (
              <div
                key={color}
                className={`color-picker ${currentColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              ></div>
            ))}
          </div>

          <div className="brush-controls">
            <label>Brush Size:</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(e.target.value)}
            />
            <span>{brushSize}px</span>
          </div>

          <button onClick={clearCanvas} className="clear-btn">🗑️ Clear</button>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        <div className="zen-quotes">
          <p>"Every artist was first an amateur." - Emerson</p>
          <p>"Art washes away from the soul the dust of everyday life." - Picasso</p>
        </div>
      </div>
    );
  };

  // Sliding Puzzle Game Component
  const SlidingPuzzleGame = () => {
    const [tiles, setTiles] = useState([]);
    const [emptyPos, setEmptyPos] = useState(8);
    const [moves, setMoves] = useState(0);
    const [isWin, setIsWin] = useState(false);

    useEffect(() => {
      initializePuzzle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initializePuzzle = () => {
      const initialTiles = Array.from({ length: 8 }, (_, i) => i + 1);
      // Shuffle tiles
      for (let i = 0; i < 100; i++) {
        const randomIndex = Math.floor(Math.random() * 8);
        const temp = initialTiles[randomIndex];
        initialTiles[randomIndex] = initialTiles[7];
        initialTiles[7] = temp;
      }
      setTiles(initialTiles);
      setEmptyPos(8);
      setMoves(0);
      setIsWin(false);
    };

    const moveTile = (index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const emptyRow = Math.floor(emptyPos / 3);
      const emptyCol = emptyPos % 3;

      if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
          (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
        const newTiles = [...tiles];
        if (index < emptyPos) {
          newTiles[emptyPos] = newTiles[index];
          newTiles[index] = null;
        } else {
          newTiles[index] = newTiles[emptyPos];
          newTiles[emptyPos] = null;
        }
        setTiles(newTiles);
        setEmptyPos(index);
        setMoves(moves + 1);

        // Check win condition
        const isCorrect = newTiles.every((tile, idx) => 
          idx === 8 ? tile === null : tile === idx + 1
        );
        setIsWin(isCorrect);
      }
    };

    return (
      <div className="sliding-puzzle-game">
        <div className="game-header">
          <h3>🧩 Sliding Zen</h3>
          <div className="game-stats">
            <span>Moves: {moves}</span>
          </div>
          <button onClick={initializePuzzle} className="reset-btn">🔄 Reset</button>
        </div>

        {isWin && (
          <div className="win-message">
            <h4>🎉 Zen Achieved!</h4>
            <p>You solved the puzzle in {moves} moves!</p>
          </div>
        )}

        <div className="puzzle-grid">
          {Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index}
              className={`puzzle-tile ${index === emptyPos ? 'empty' : ''}`}
              onClick={() => moveTile(index)}
            >
              {index === emptyPos ? '' : (tiles[index] || index + 1)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Word Flow Game Component
  const WordFlowGame = () => {
    const [currentWord, setCurrentWord] = useState('');
    const [wordChain, setWordChain] = useState(['PEACE']);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);

    // eslint-disable-next-line no-unused-vars
    const positiveWords = [
      'LOVE', 'JOY', 'HOPE', 'CALM', 'PEACE', 'HAPPY', 'BRIGHT', 'SERENE',
      'GENTLE', 'KIND', 'WARM', 'LIGHT', 'SMILE', 'DREAM', 'TRUST', 'GRACE'
    ];

    useEffect(() => {
      let timer = null;
      if (isPlaying && timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else if (timeLeft === 0) {
        setIsPlaying(false);
      }
      return () => clearTimeout(timer);
    }, [isPlaying, timeLeft]);

    const startGame = () => {
      setIsPlaying(true);
      setScore(0);
      setTimeLeft(120);
      setWordChain(['PEACE']);
      setCurrentWord('');
    };

    const submitWord = () => {
      if (!isPlaying || !currentWord.trim()) return;

      const word = currentWord.trim().toUpperCase();
      const lastWord = wordChain[wordChain.length - 1];
      
      if (word.length >= 3 && 
          word[0] === lastWord[lastWord.length - 1] &&
          !wordChain.includes(word)) {
        setWordChain([...wordChain, word]);
        setScore(score + word.length * 10);
        setCurrentWord('');
      } else {
        // Show error feedback
        setCurrentWord('');
      }
    };

    return (
      <div className="word-flow-game">
        <div className="game-header">
          <h3>💭 Word Flow</h3>
          <div className="game-stats">
            <span>Score: {score}</span>
            <span>Time: {timeLeft}s</span>
          </div>
        </div>

        {!isPlaying && timeLeft === 120 ? (
          <div className="game-start">
            <p>Connect words by using the last letter of the previous word!</p>
            <p>Example: PEACE → ENERGY → YOGA</p>
            <button onClick={startGame} className="start-btn">🌊 Start Flow</button>
          </div>
        ) : (
          <>
            <div className="word-chain">
              {wordChain.map((word, index) => (
                <div key={index} className="word-bubble">
                  {word}
                </div>
              ))}
            </div>

            {isPlaying && (
              <div className="word-input-section">
                <p>Next word must start with: <strong>{wordChain[wordChain.length - 1].slice(-1)}</strong></p>
                <div className="word-input-form">
                  <input
                    type="text"
                    value={currentWord}
                    onChange={(e) => setCurrentWord(e.target.value)}
                    placeholder="Enter your word..."
                    className="word-input"
                    onKeyPress={(e) => e.key === 'Enter' && submitWord()}
                  />
                  <button onClick={submitWord} className="submit-word">Add</button>
                </div>
              </div>
            )}

            {timeLeft === 0 && (
              <div className="game-over">
                <h4>🌊 Flow Complete!</h4>
                <p>Final Score: {score}</p>
                <p>Words Created: {wordChain.length}</p>
                <button onClick={startGame} className="restart-btn">🔄 Start New Flow</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Pattern Quest Game Component
  const PatternQuestGame = () => {
    const [pattern, setPattern] = useState([]);
    const [userPattern, setUserPattern] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('ready'); // ready, showing, input, correct, wrong

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

    const generatePattern = (level) => {
      const newPattern = [];
      for (let i = 0; i < level + 2; i++) {
        newPattern.push(colors[Math.floor(Math.random() * colors.length)]);
      }
      return newPattern;
    };

    const showPattern = async () => {
      const newPattern = generatePattern(currentLevel);
      setPattern(newPattern);
      setUserPattern([]);
      setGameState('showing');

      for (let i = 0; i < newPattern.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 600));
        // Highlight color logic would go here
      }
      
      setGameState('input');
    };

    const handleColorClick = (color) => {
      if (gameState !== 'input') return;

      const newUserPattern = [...userPattern, color];
      setUserPattern(newUserPattern);

      if (newUserPattern.length === pattern.length) {
        const isCorrect = newUserPattern.every((c, i) => c === pattern[i]);
        if (isCorrect) {
          setScore(score + currentLevel * 100);
          setCurrentLevel(currentLevel + 1);
          setGameState('correct');
          setTimeout(() => setGameState('ready'), 1000);
        } else {
          setGameState('wrong');
          setTimeout(() => {
            setCurrentLevel(1);
            setScore(0);
            setGameState('ready');
          }, 1500);
        }
      }
    };

    return (
      <div className="pattern-quest-game">
        <div className="game-header">
          <h3>🔍 Pattern Quest</h3>
          <div className="game-stats">
            <span>Level: {currentLevel}</span>
            <span>Score: {score}</span>
          </div>
        </div>

        <div className="pattern-status">
          {gameState === 'ready' && (
            <button onClick={showPattern} className="start-pattern">
              🎯 Start Level {currentLevel}
            </button>
          )}
          {gameState === 'showing' && <p>🔍 Watch the pattern...</p>}
          {gameState === 'input' && <p>🎨 Repeat the pattern!</p>}
          {gameState === 'correct' && <p>✅ Correct! Next level...</p>}
          {gameState === 'wrong' && <p>❌ Wrong pattern. Starting over...</p>}
        </div>

        <div className="color-grid">
          {colors.map(color => (
            <div
              key={color}
              className={`color-tile ${color}`}
              onClick={() => handleColorClick(color)}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="pattern-display">
          <div className="pattern-sequence">
            Pattern: {pattern.length} colors
          </div>
          <div className="user-sequence">
            Your input: {userPattern.join(' → ')}
          </div>
        </div>
      </div>
    );
  };

  // Mindful Dot Game Component
  const MindfulDotGame = () => {
    const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
    const [isActive, setIsActive] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [breathCount, setBreathCount] = useState(0);

    useEffect(() => {
      let timer = null;
      if (isActive) {
        timer = setInterval(() => {
          setSessionTime(prev => prev + 1);
          
          // Move dot in a slow, meditative pattern
          setDotPosition(prev => ({
            x: 50 + Math.sin(sessionTime * 0.02) * 30,
            y: 50 + Math.cos(sessionTime * 0.03) * 20
          }));
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [isActive, sessionTime]);

    const startSession = () => {
      setIsActive(true);
      setSessionTime(0);
      setBreathCount(0);
    };

    const stopSession = () => {
      setIsActive(false);
    };

    const handleBreath = () => {
      setBreathCount(prev => prev + 1);
    };

    return (
      <div className="mindful-dot-game">
        <div className="game-header">
          <h3>🎯 Mindful Dot</h3>
          <div className="game-stats">
            <span>Time: {Math.floor(sessionTime / 60)}:{(sessionTime % 60).toString().padStart(2, '0')}</span>
            <span>Breaths: {breathCount}</span>
          </div>
        </div>

        <div className="dot-container">
          <div 
            className={`mindful-dot ${isActive ? 'active' : ''}`}
            style={{
              left: `${dotPosition.x}%`,
              top: `${dotPosition.y}%`
            }}
          />
          <div className="focus-circle" />
        </div>

        <div className="mindful-instructions">
          <p>Focus on the moving dot and let your mind be present</p>
          <p>Click "Breathe" when you take conscious breaths</p>
        </div>

        <div className="mindful-controls">
          {!isActive ? (
            <button onClick={startSession} className="start-btn">
              🧘‍♀️ Start Meditation
            </button>
          ) : (
            <div className="active-controls">
              <button onClick={handleBreath} className="breath-btn">
                🌬️ Breathe
              </button>
              <button onClick={stopSession} className="stop-btn">
                ⏹️ End Session
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSelectedGame = () => {
    switch (selectedGame?.id) {
      case 'memory':
        return <MemoryGame />;
      case 'breathing':
        return <BreathingGame />;
      case 'colors':
        return <ColorGame />;
      case 'puzzle':
        return <SlidingPuzzleGame />;
      case 'words':
        return <WordFlowGame />;
      case 'stress-ball':
        return <StressBallGame />;
      case 'patterns':
        return <PatternQuestGame />;
      case 'focus-dot':
        return <MindfulDotGame />;
      case 'quick-math':
        return <QuickMathGame />;
      case 'drawing':
        return <DrawingCanvas />;
      default:
        return (
          <div className="game-placeholder">
            <h3>🚧 Coming Soon!</h3>
            <p>This game is under development. Check back soon!</p>
          </div>
        );
    }
  };

  if (selectedGame) {
    return (
      <div className="page-container">
        <div className="game-container">
          <div className="game-header-nav">
            <button 
              onClick={() => setSelectedGame(null)} 
              className="back-to-games-btn"
            >
              ← Back to Games
            </button>
            <div className="current-game-info">
              <span className="game-icon">{selectedGame.icon}</span>
              <span className="game-title">{selectedGame.title}</span>
              <span className="game-category">{selectedGame.category}</span>
            </div>
          </div>

          <div className="game-content">
            {renderSelectedGame()}
          </div>

          <div className="game-benefits">
            <h4>🌟 Benefits of this game:</h4>
            <ul>
              {selectedGame.benefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* User Profile Header */}
      {isAuthenticated() && (
        <div className="user-profile-header">
          <img 
            src={user?.avatar} 
            alt={user?.name}
            className="user-avatar"
          />
          <div className="user-info">
            <h3>{user?.name}</h3>
            <p>Level {Math.floor(gameStats.totalScore / 500) + 1} Player • {gameStats.daysPlayed} days active</p>
          </div>
        </div>
      )}

      {/* Live Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="live-indicator">
          <div className="live-dot"></div>
          Live Game Statistics
        </div>
        <div className="stats-grid">
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.totalGamesPlayed}</div>
            <div className="stat-label">Games Played</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.daysPlayed}</div>
            <div className="stat-label">Days Active</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.currentStreak}</div>
            <div className="stat-label">Current Streak</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.totalScore}</div>
            <div className="stat-label">Total Score</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.averageScore}</div>
            <div className="stat-label">Average Score</div>
          </motion.div>
          <motion.div 
            className="stat-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-value">{gameStats.bestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </motion.div>
        </div>
      </div>

      <div className="mind-games-header">
        <h1 className="page-title">🎮 Mind Games</h1>
        <p className="page-description">
          Play therapeutic games designed to reduce stress, boost mood, and enhance mental wellness
        </p>
      </div>

      <div className="games-section">
        <div className="section-header">
          <h2>🎯 Choose Your Game</h2>
          <p>Each game is designed with specific mental health benefits in mind</p>
        </div>

        <div className="games-grid">
          {games.map(game => (
            <div 
              key={game.id} 
              className={`game-card ${game.color}`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="game-card-header">
                <div className="game-icon">{game.icon}</div>
                <div className="game-difficulty">{game.difficulty}</div>
              </div>
              
              <h3 className="game-title">{game.title}</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-category-tag">
                {game.category}
              </div>
              
              <div className="game-benefits-preview">
                <h4>Benefits:</h4>
                <ul>
                  {game.benefits.slice(0, 2).map((benefit, index) => (
                    <li key={index}>• {benefit}</li>
                  ))}
                  {game.benefits.length > 2 && <li>• +{game.benefits.length - 2} more</li>}
                </ul>
              </div>
              
              <button className="play-game-btn">
                🎮 Play Game
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="wellness-tips">
        <div className="tip-card">
          <h3>💡 Gaming for Wellness</h3>
          <ul>
            <li>🎯 Play for 10-15 minutes to see benefits</li>
            <li>🧘‍♀️ Focus on the experience, not just winning</li>
            <li>⏰ Take breaks between games</li>
            <li>😊 Choose games that match your current mood</li>
            <li>🌱 Consistency matters more than duration</li>
          </ul>
        </div>
      </div>

      <div className="crisis-section">
        <div className="crisis-card">
          <h3>🚨 Need Support?</h3>
          <p>If you're feeling overwhelmed, reach out for help</p>
          <div className="crisis-contacts">
            <a href="tel:988" className="crisis-link">📞 988 - Crisis Lifeline</a>
            <a href="sms:741741" className="crisis-link">💬 Text HOME to 741741</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindGamesPage; 