import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Flame, Star, Trophy, Heart, Brain, Zap } from 'lucide-react';

const GamificationSystem = ({ moodEntries = [], meditationSessions = 0, toolsUsed = 0 }) => {
  const [userLevel, setUserLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);

  // Achievement definitions
  const allAchievements = [
    {
      id: 'first_mood',
      title: 'First Steps',
      description: 'Logged your first mood entry',
      icon: <Heart className="w-6 h-6" />,
      points: 10,
      requirement: () => moodEntries.length >= 1,
      color: '#ef4444'
    },
    {
      id: 'week_streak',
      title: 'Week Warrior',
      description: '7 days of consecutive mood tracking',
      icon: <Flame className="w-6 h-6" />,
      points: 50,
      requirement: () => currentStreak >= 7,
      color: '#f97316'
    },
    {
      id: 'meditation_master',
      title: 'Meditation Master',
      description: 'Completed 10 meditation sessions',
      icon: <Brain className="w-6 h-6" />,
      points: 100,
      requirement: () => meditationSessions >= 10,
      color: '#8b5cf6'
    },
    {
      id: 'tool_explorer',
      title: 'Tool Explorer',
      description: 'Used 5 different self-help tools',
      icon: <Target className="w-6 h-6" />,
      points: 75,
      requirement: () => toolsUsed >= 5,
      color: '#10b981'
    },
    {
      id: 'consistent_tracker',
      title: 'Consistency Champion',
      description: '30 mood entries logged',
      icon: <Award className="w-6 h-6" />,
      points: 200,
      requirement: () => moodEntries.length >= 30,
      color: '#3b82f6'
    },
    {
      id: 'mood_improver',
      title: 'Mood Improver',
      description: 'Average mood improved by 1 point',
      icon: <Star className="w-6 h-6" />,
      points: 150,
      requirement: () => calculateMoodImprovement() >= 1,
      color: '#eab308'
    },
    {
      id: 'wellness_guru',
      title: 'Wellness Guru',
      description: 'Reached level 10',
      icon: <Trophy className="w-6 h-6" />,
      points: 500,
      requirement: () => userLevel >= 10,
      color: '#dc2626'
    },
    {
      id: 'super_streak',
      title: 'Super Streaker',
      description: '30 days consecutive tracking',
      icon: <Zap className="w-6 h-6" />,
      points: 300,
      requirement: () => currentStreak >= 30,
      color: '#7c3aed'
    }
  ];

  const calculateMoodImprovement = () => {
    if (moodEntries.length < 7) return 0;
    
    const firstWeek = moodEntries.slice(-7);
    const lastWeek = moodEntries.slice(0, 7);
    
    const firstAvg = firstWeek.reduce((sum, entry) => sum + entry.mood, 0) / firstWeek.length;
    const lastAvg = lastWeek.reduce((sum, entry) => sum + entry.mood, 0) / lastWeek.length;
    
    return firstAvg - lastAvg;
  };

  const calculateStreak = () => {
    if (moodEntries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < moodEntries.length; i++) {
      const entryDate = new Date(moodEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculatePoints = () => {
    let points = 0;
    
    // Points for mood entries
    points += moodEntries.length * 5;
    
    // Bonus points for streak
    points += currentStreak * 2;
    
    // Points for meditation sessions
    points += meditationSessions * 15;
    
    // Points for using tools
    points += toolsUsed * 10;
    
    // Achievement points
    achievements.forEach(achievement => {
      points += achievement.points;
    });
    
    return points;
  };

  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  const getProgressToNextLevel = () => {
    const pointsForCurrentLevel = (userLevel - 1) * 100;
    const pointsForNextLevel = userLevel * 100;
    const currentProgress = totalPoints - pointsForCurrentLevel;
    const totalNeeded = pointsForNextLevel - pointsForCurrentLevel;
    
    return (currentProgress / totalNeeded) * 100;
  };

  useEffect(() => {
    const streak = calculateStreak();
    setCurrentStreak(streak);
    
    const points = calculatePoints();
    setTotalPoints(points);
    
    const level = calculateLevel(points);
    setUserLevel(level);
    
    // Check for new achievements
    const earnedAchievements = allAchievements.filter(achievement => 
      achievement.requirement() && !achievements.some(earned => earned.id === achievement.id)
    );
    
    if (earnedAchievements.length > 0) {
      setAchievements(prev => [...prev, ...earnedAchievements]);
    }
  }, [moodEntries, meditationSessions, toolsUsed]);

  return (
    <div className="gamification-container">
      {/* Level Progress */}
      <motion.div 
        className="level-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="level-header">
          <div className="level-info">
            <h3 className="level-title">Level {userLevel}</h3>
            <p className="level-points">{totalPoints} points</p>
          </div>
          <div className="level-icon">
            <Trophy className="w-8 h-8" style={{ color: '#fbbf24' }} />
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-bar">
            <motion.div 
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressToNextLevel()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="progress-text">
            {Math.round(getProgressToNextLevel())}% to Level {userLevel + 1}
          </p>
        </div>
      </motion.div>

      {/* Current Streak */}
      <motion.div 
        className="streak-card"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="streak-content">
          <Flame className="w-6 h-6" style={{ color: '#f97316' }} />
          <div className="streak-info">
            <h4 className="streak-number">{currentStreak}</h4>
            <p className="streak-label">Day Streak</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <motion.div 
          className="stat-item"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Heart className="w-5 h-5" style={{ color: '#ef4444' }} />
          <span className="stat-number">{moodEntries.length}</span>
          <span className="stat-label">Moods Logged</span>
        </motion.div>
        
        <motion.div 
          className="stat-item"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Brain className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          <span className="stat-number">{meditationSessions}</span>
          <span className="stat-label">Meditations</span>
        </motion.div>
        
        <motion.div 
          className="stat-item"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Target className="w-5 h-5" style={{ color: '#10b981' }} />
          <span className="stat-number">{toolsUsed}</span>
          <span className="stat-label">Tools Used</span>
        </motion.div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div 
          className="achievements-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h4 className="achievements-title">Recent Achievements</h4>
          <div className="achievements-grid">
            {achievements.slice(-3).map((achievement, index) => (
              <motion.div 
                key={achievement.id}
                className="achievement-badge"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.7 + index * 0.1,
                  type: "spring",
                  bounce: 0.4
                }}
              >
                <div 
                  className="achievement-icon"
                  style={{ backgroundColor: achievement.color }}
                >
                  {achievement.icon}
                </div>
                <div className="achievement-info">
                  <h5 className="achievement-name">{achievement.title}</h5>
                  <p className="achievement-desc">{achievement.description}</p>
                  <span className="achievement-points">+{achievement.points} pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Next Achievement Preview */}
      {(() => {
        const nextAchievement = allAchievements.find(achievement => 
          !achievements.some(earned => earned.id === achievement.id)
        );
        
        if (nextAchievement) {
          return (
            <motion.div 
              className="next-achievement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h4 className="next-achievement-title">Next Achievement</h4>
              <div className="next-achievement-card">
                <div 
                  className="next-achievement-icon"
                  style={{ backgroundColor: nextAchievement.color }}
                >
                  {nextAchievement.icon}
                </div>
                <div className="next-achievement-info">
                  <h5>{nextAchievement.title}</h5>
                  <p>{nextAchievement.description}</p>
                  <span className="next-achievement-points">
                    {nextAchievement.points} points
                  </span>
                </div>
              </div>
            </motion.div>
          );
        }
        return null;
      })()}
    </div>
  );
};

export default GamificationSystem; 