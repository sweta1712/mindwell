import React, { createContext, useContext, useState, useEffect } from 'react';

const GameStatsContext = createContext();

export const useGameStats = () => {
  const context = useContext(GameStatsContext);
  if (!context) {
    throw new Error('useGameStats must be used within a GameStatsProvider');
  }
  return context;
};

export const GameStatsProvider = ({ children }) => {
  const [gameStats, setGameStats] = useState({
    totalGamesPlayed: 0,
    totalScore: 0,
    currentStreak: 0,
    bestStreak: 0,
    daysPlayed: 0,
    lastPlayDate: null,
    gameHistory: [],
    averageScore: 0
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
      try {
        const parsedStats = JSON.parse(savedStats);
        setGameStats(parsedStats);
      } catch (error) {
        console.error('Error loading game stats:', error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }, [gameStats]);

  const updateGameStats = (gameType, score, won = false) => {
    const today = new Date().toDateString();
    const lastPlayDate = gameStats.lastPlayDate;
    
    setGameStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update basic stats
      newStats.totalGamesPlayed += 1;
      newStats.totalScore += score;
      newStats.averageScore = Math.round(newStats.totalScore / newStats.totalGamesPlayed);
      
      // Update streak
      if (won) {
        newStats.currentStreak += 1;
        if (newStats.currentStreak > newStats.bestStreak) {
          newStats.bestStreak = newStats.currentStreak;
        }
      } else {
        newStats.currentStreak = 0;
      }
      
      // Update days played
      if (lastPlayDate !== today) {
        newStats.daysPlayed += 1;
        newStats.lastPlayDate = today;
      }
      
      // Add to game history
      newStats.gameHistory.push({
        gameType,
        score,
        won,
        date: new Date().toISOString(),
        streak: newStats.currentStreak
      });
      
      // Keep only last 100 games in history
      if (newStats.gameHistory.length > 100) {
        newStats.gameHistory = newStats.gameHistory.slice(-100);
      }
      
      return newStats;
    });
  };

  const resetStats = () => {
    setGameStats({
      totalGamesPlayed: 0,
      totalScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      daysPlayed: 0,
      lastPlayDate: null,
      gameHistory: [],
      averageScore: 0
    });
  };

  const getGameTypeStats = (gameType) => {
    const gameTypeHistory = gameStats.gameHistory.filter(game => game.gameType === gameType);
    const totalGames = gameTypeHistory.length;
    const wins = gameTypeHistory.filter(game => game.won).length;
    const totalScore = gameTypeHistory.reduce((sum, game) => sum + game.score, 0);
    
    return {
      gamesPlayed: totalGames,
      wins,
      winRate: totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0,
      averageScore: totalGames > 0 ? Math.round(totalScore / totalGames) : 0,
      bestScore: gameTypeHistory.length > 0 ? Math.max(...gameTypeHistory.map(game => game.score)) : 0
    };
  };

  const value = {
    gameStats,
    updateGameStats,
    resetStats,
    getGameTypeStats
  };

  return (
    <GameStatsContext.Provider value={value}>
      {children}
    </GameStatsContext.Provider>
  );
};

export default GameStatsContext; 