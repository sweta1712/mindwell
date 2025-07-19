import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMoodEntries, saveMoodEntry, deleteMoodEntry } from '../utils/localStorage';
import GamificationSystem from '../components/GamificationSystem';
import MoodAnalytics from '../components/MoodAnalytics';
import SmartCrisisDetection from '../components/SmartCrisisDetection';
import VoiceInput from '../components/VoiceInput';
import { TrendingUp, Mic, BarChart3, Sparkles } from 'lucide-react';

const MoodTrackingPage = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [moodNote, setMoodNote] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('track'); // track, analytics, gamification
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [meditationSessions] = useState(5); // Mock data - would come from meditation tracking
  const [toolsUsed] = useState(3); // Mock data - would come from self-help tools usage

  const moods = [
    { value: 5, label: 'Excellent', emoji: '😄', color: '#22c55e' },
    { value: 4, label: 'Good', emoji: '😊', color: '#84cc16' },
    { value: 3, label: 'Okay', emoji: '😐', color: '#eab308' },
    { value: 2, label: 'Not Great', emoji: '😔', color: '#f97316' },
    { value: 1, label: 'Terrible', emoji: '😢', color: '#ef4444' }
  ];

  const activities = [
    'Work', 'Exercise', 'Social Time', 'Family Time', 'Relaxation',
    'Meditation', 'Reading', 'Music', 'Outdoor Activities', 'Learning',
    'Creative Activities', 'Hobbies', 'Sleep', 'Eating Well', 'Therapy'
  ];

  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, []);

  const handleSubmitMood = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsLoading(true);

    const newEntry = {
      id: Date.now().toString(),
      mood: parseInt(selectedMood),
      note: moodNote,
      activities: selectedActivities,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString()
    };

    const success = saveMoodEntry(newEntry);
    
    if (success) {
      const updatedEntries = getMoodEntries();
      setMoodEntries(updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
      
      // Reset form
      setSelectedMood('');
      setMoodNote('');
      setSelectedActivities([]);
      
      // Show success animation
      showSuccessAnimation();
    }

    setIsLoading(false);
  };

  const showSuccessAnimation = () => {
    // Create floating celebration effect
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉';
    celebration.style.position = 'fixed';
    celebration.style.top = '50%';
    celebration.style.left = '50%';
    celebration.style.fontSize = '3rem';
    celebration.style.zIndex = '9999';
    celebration.style.pointerEvents = 'none';
    celebration.style.animation = 'float-up 2s ease-out forwards';
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.remove();
    }, 2000);
  };

  const handleVoiceResult = (result) => {
    if (typeof result === 'object') {
      // Handle structured voice input
      if (result.type === 'mood') {
        setSelectedMood(result.mood.toString());
        setMoodNote(result.text);
        // Auto-submit if we have a clear mood
        if (result.confidence > 0.7) {
          setTimeout(() => handleSubmitMood({ preventDefault: () => {} }), 1000);
        }
      } else if (result.type === 'crisis') {
        // Crisis detection will handle this automatically
        console.log('Crisis detected via voice:', result);
      }
    } else {
      // Handle plain text
      setMoodNote(result);
    }
  };

  const handleDeleteEntry = (entryId) => {
    const success = deleteMoodEntry(entryId);
    if (success) {
      const updatedEntries = getMoodEntries();
      setMoodEntries(updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const getMoodStats = () => {
    if (moodEntries.length === 0) return null;

    const average = moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length;
    const recentEntries = moodEntries.slice(0, 7);
    const recentAverage = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;

    return {
      totalEntries: moodEntries.length,
      averageMood: average.toFixed(1),
      recentAverage: recentAverage.toFixed(1),
      streak: calculateStreak()
    };
  };

  const calculateStreak = () => {
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

  const getMoodEmoji = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const getMoodLabel = (moodValue) => {
    const mood = moods.find(m => m.value === moodValue);
    return mood ? mood.label : 'Unknown';
  };

  const stats = getMoodStats();

  const tabs = [
    { id: 'track', label: 'Track Mood', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'gamification', label: 'Progress', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="page-container mood-tracking-page">
      <div className="page-header">
        <h1 className="page-title">Advanced Mood Tracking</h1>
        <p className="page-description">
          Track your emotions with AI insights, voice input, and gamified progress tracking.
        </p>
      </div>

      {/* Crisis Detection System */}
      <SmartCrisisDetection 
        moodEntries={moodEntries}
        currentMoodNote={moodNote}
        chatMessages={[]} // Would be populated from community chat
      />

      {/* Tab Navigation */}
      <div className="advanced-tabs">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'track' && (
          <motion.div
            key="track"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Statistics Dashboard */}
            {stats && (
              <div className="stats-dashboard">
                <div className="stat-card">
                  <div className="stat-number">{stats.totalEntries}</div>
                  <div className="stat-label">Total Entries</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.averageMood}/5</div>
                  <div className="stat-label">Average Mood</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.recentAverage}/5</div>
                  <div className="stat-label">Recent Average (7 days)</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{stats.streak}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>
            )}

            {/* Voice Input Section */}
            <div className="voice-section">
              <button
                onClick={() => setShowVoiceInput(!showVoiceInput)}
                className="voice-toggle-btn"
              >
                <Mic className="w-5 h-5" />
                {showVoiceInput ? 'Hide Voice Input' : 'Use Voice Input'}
              </button>
              
              <AnimatePresence>
                {showVoiceInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="voice-input-section"
                  >
                    <VoiceInput
                      onTextResult={handleVoiceResult}
                      placeholder="Say how you're feeling... e.g., 'I'm feeling great today'"
                      autoSubmit={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mood Entry Form */}
            <div className="mood-form-section enhanced">
              <h2 className="section-title">How are you feeling today?</h2>
              <form onSubmit={handleSubmitMood} className="mood-form">
                {/* Mood Selection */}
                <div className="mood-selection">
                  <h3 className="form-label">Select your mood:</h3>
                  <div className="mood-options enhanced">
                    {moods.map(mood => (
                      <motion.button
                        key={mood.value}
                        type="button"
                        onClick={() => setSelectedMood(mood.value.toString())}
                        className={`mood-option ${selectedMood === mood.value.toString() ? 'selected' : ''}`}
                        style={{ borderColor: selectedMood === mood.value.toString() ? mood.color : '#e5e7eb' }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: mood.value * 0.1 }}
                      >
                        <div className="mood-emoji">{mood.emoji}</div>
                        <div className="mood-label">{mood.label}</div>
                        {selectedMood === mood.value.toString() && (
                          <motion.div
                            className="mood-selected-indicator"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ backgroundColor: mood.color }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Activities Selection */}
                <div className="activities-selection">
                  <h3 className="form-label">What activities did you do today? (Optional)</h3>
                  <div className="activities-grid enhanced">
                    {activities.map(activity => (
                      <motion.button
                        key={activity}
                        type="button"
                        onClick={() => toggleActivity(activity)}
                        className={`activity-tag ${selectedActivities.includes(activity) ? 'selected' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {activity}
                        {selectedActivities.includes(activity) && (
                          <motion.span
                            className="activity-check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            ✓
                          </motion.span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Note Section */}
                <div className="note-section">
                  <h3 className="form-label">Additional notes (Optional)</h3>
                  <textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What influenced your mood today? Any thoughts or reflections..."
                    className="mood-textarea enhanced"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <motion.button 
                  type="submit" 
                  disabled={!selectedMood || isLoading}
                  className="submit-mood-btn enhanced"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="loading-spinner"
                      />
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Save Mood Entry ✨
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>
            </div>

            {/* History Toggle */}
            <div className="history-toggle-section">
              <motion.button
                onClick={() => setShowHistory(!showHistory)}
                className="toggle-history-btn enhanced"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {showHistory ? 'Hide History' : 'View History'} ({moodEntries.length} entries)
              </motion.button>
            </div>

            {/* Mood History */}
            <AnimatePresence>
              {showHistory && (
                <motion.div 
                  className="mood-history-section enhanced"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="section-title">Your Mood History</h2>
                  {moodEntries.length === 0 ? (
                    <div className="empty-state">
                      <p>No mood entries yet. Start tracking your mood above!</p>
                    </div>
                  ) : (
                    <div className="mood-history-list">
                      {moodEntries.map((entry, index) => (
                        <motion.div 
                          key={entry.id} 
                          className="mood-history-item enhanced"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <div className="mood-history-header">
                            <div className="mood-display">
                              <span className="mood-emoji-large">{getMoodEmoji(entry.mood)}</span>
                              <div className="mood-info">
                                <div className="mood-label-large">{getMoodLabel(entry.mood)}</div>
                                <div className="mood-date">{entry.timestamp}</div>
                              </div>
                            </div>
                            <motion.button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="delete-entry-btn"
                              title="Delete entry"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              🗑️
                            </motion.button>
                          </div>
                          
                          {entry.activities.length > 0 && (
                            <div className="entry-activities">
                              <strong>Activities:</strong>
                              <div className="activity-tags">
                                {entry.activities.map(activity => (
                                  <span key={activity} className="activity-tag-small">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {entry.note && (
                            <div className="entry-note">
                              <strong>Note:</strong>
                              <p>{entry.note}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MoodAnalytics moodEntries={moodEntries} />
          </motion.div>
        )}

        {activeTab === 'gamification' && (
          <motion.div
            key="gamification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GamificationSystem 
              moodEntries={moodEntries}
              meditationSessions={meditationSessions}
              toolsUsed={toolsUsed}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button for Quick Mood Entry */}
      <motion.div
        className="floating-action-container"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          className="floating-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('track')}
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -150%) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -250%) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MoodTrackingPage; 