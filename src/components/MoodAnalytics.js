import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Brain, AlertTriangle, Calendar, Activity, Lightbulb } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MoodAnalytics = ({ moodEntries = [] }) => {
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [timeFrame, setTimeFrame] = useState('7'); // 7, 30, 90 days

  // Process mood data for charts
  const getFilteredEntries = () => {
    const days = parseInt(timeFrame);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return moodEntries.filter(entry => new Date(entry.date) >= cutoffDate);
  };

  const getMoodTrendData = () => {
    const filteredEntries = getFilteredEntries().slice().reverse();
    
    return {
      labels: filteredEntries.map(entry => 
        new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Mood Score',
          data: filteredEntries.map(entry => entry.mood),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
        },
      ],
    };
  };

  const getMoodDistributionData = () => {
    const moodCounts = [0, 0, 0, 0, 0]; // [1,2,3,4,5]
    getFilteredEntries().forEach(entry => {
      moodCounts[entry.mood - 1]++;
    });

    return {
      labels: ['Terrible 😢', 'Not Great 😔', 'Okay 😐', 'Good 😊', 'Excellent 😄'],
      datasets: [
        {
          data: moodCounts,
          backgroundColor: [
            '#EF4444',
            '#F97316',
            '#EAB308',
            '#84CC16',
            '#22C55E',
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  const getActivityCorrelationData = () => {
    const activityMoodMap = {};
    
    getFilteredEntries().forEach(entry => {
      entry.activities?.forEach(activity => {
        if (!activityMoodMap[activity]) {
          activityMoodMap[activity] = { total: 0, count: 0 };
        }
        activityMoodMap[activity].total += entry.mood;
        activityMoodMap[activity].count += 1;
      });
    });

    const activities = Object.keys(activityMoodMap);
    const averageMoods = activities.map(activity => 
      activityMoodMap[activity].total / activityMoodMap[activity].count
    );

    return {
      labels: activities,
      datasets: [
        {
          label: 'Average Mood Impact',
          data: averageMoods,
          backgroundColor: averageMoods.map(mood => {
            if (mood >= 4) return '#22C55E';
            if (mood >= 3) return '#84CC16';
            if (mood >= 2.5) return '#EAB308';
            if (mood >= 2) return '#F97316';
            return '#EF4444';
          }),
          borderRadius: 8,
        },
      ],
    };
  };

  const generateInsights = () => {
    const entries = getFilteredEntries();
    if (entries.length === 0) return [];

    const insights = [];
    
    // Mood trend analysis
    const recentMoods = entries.slice(-7).map(e => e.mood);
    const earlierMoods = entries.slice(0, 7).map(e => e.mood);
    
    if (recentMoods.length >= 3 && earlierMoods.length >= 3) {
      const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const earlierAvg = earlierMoods.reduce((a, b) => a + b, 0) / earlierMoods.length;
      
      if (recentAvg > earlierAvg + 0.5) {
        insights.push({
          type: 'positive',
          icon: <TrendingUp className="w-5 h-5" />,
          title: 'Mood Improving!',
          description: `Your mood has improved by ${(recentAvg - earlierAvg).toFixed(1)} points recently. Keep up the great work!`,
          color: '#22C55E'
        });
      } else if (recentAvg < earlierAvg - 0.5) {
        insights.push({
          type: 'concern',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Mood Decline Detected',
          description: `Your mood has decreased recently. Consider trying some self-help tools or reaching out for support.`,
          color: '#F97316'
        });
      }
    }

    // Activity insights
    const activityMoodMap = {};
    entries.forEach(entry => {
      entry.activities?.forEach(activity => {
        if (!activityMoodMap[activity]) {
          activityMoodMap[activity] = { total: 0, count: 0 };
        }
        activityMoodMap[activity].total += entry.mood;
        activityMoodMap[activity].count += 1;
      });
    });

    const sortedActivities = Object.entries(activityMoodMap)
      .map(([activity, data]) => ({
        activity,
        avgMood: data.total / data.count,
        count: data.count
      }))
      .filter(item => item.count >= 2)
      .sort((a, b) => b.avgMood - a.avgMood);

    if (sortedActivities.length > 0) {
      const bestActivity = sortedActivities[0];
      insights.push({
        type: 'tip',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Mood Booster Found!',
        description: `${bestActivity.activity} seems to improve your mood the most (avg: ${bestActivity.avgMood.toFixed(1)}/5). Try doing this more often!`,
        color: '#3B82F6'
      });
    }

    // Consistency insight
    const streak = calculateCurrentStreak(entries);
    if (streak >= 7) {
      insights.push({
        type: 'achievement',
        icon: <Calendar className="w-5 h-5" />,
        title: 'Great Consistency!',
        description: `You've been tracking your mood for ${streak} consecutive days. This helps identify patterns!`,
        color: '#8B5CF6'
      });
    }

    return insights;
  };

  const generatePredictions = () => {
    const entries = getFilteredEntries();
    if (entries.length < 7) return [];

    const predictions = [];
    
    // Simple trend-based prediction
    const recentMoods = entries.slice(-7).map(e => e.mood);
    const trend = recentMoods.reduce((acc, mood, index) => {
      if (index === 0) return 0;
      return acc + (mood - recentMoods[index - 1]);
    }, 0) / (recentMoods.length - 1);

    if (Math.abs(trend) > 0.1) {
      predictions.push({
        type: trend > 0 ? 'positive' : 'warning',
        icon: <Brain className="w-5 h-5" />,
        title: 'Mood Prediction',
        description: `Based on recent patterns, your mood appears to be ${trend > 0 ? 'trending upward' : 'trending downward'}. ${trend > 0 ? 'Keep doing what you\'re doing!' : 'Consider additional self-care activities.'}`,
        confidence: Math.min(90, 60 + Math.abs(trend) * 20),
        color: trend > 0 ? '#22C55E' : '#F97316'
      });
    }

    return predictions;
  };

  const calculateCurrentStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
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

  useEffect(() => {
    setInsights(generateInsights());
    setPredictions(generatePredictions());
  }, [moodEntries, timeFrame]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (moodEntries.length === 0) {
    return (
      <div className="analytics-empty">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Data Yet</h3>
        <p className="text-gray-500">Start tracking your mood to see insights and analytics!</p>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Time Frame Selector */}
      <div className="time-frame-selector">
        <h3 className="analytics-title">Mood Analytics & Insights</h3>
        <div className="time-frame-buttons">
          {[
            { value: '7', label: '7 Days' },
            { value: '30', label: '30 Days' },
            { value: '90', label: '90 Days' }
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTimeFrame(option.value)}
              className={`time-frame-btn ${timeFrame === option.value ? 'active' : ''}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Mood Trend Chart */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className="chart-title">
            <Activity className="w-5 h-5" />
            Mood Trend Over Time
          </h4>
          <div className="chart-container">
            <Line data={getMoodTrendData()} options={chartOptions} />
          </div>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h4 className="chart-title">
            <Brain className="w-5 h-5" />
            Mood Distribution
          </h4>
          <div className="chart-container">
            <Doughnut data={getMoodDistributionData()} options={doughnutOptions} />
          </div>
        </motion.div>

        {/* Activity Correlation */}
        <motion.div 
          className="chart-card wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h4 className="chart-title">
            <TrendingUp className="w-5 h-5" />
            Activity Impact on Mood
          </h4>
          <div className="chart-container">
            <Bar 
              data={getActivityCorrelationData()} 
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { stepSize: 1 },
                  },
                },
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <motion.div 
          className="insights-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h4 className="section-title">
            <Brain className="w-5 h-5" />
            AI-Powered Insights
          </h4>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <motion.div 
                key={index}
                className="insight-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <div 
                  className="insight-icon"
                  style={{ backgroundColor: insight.color + '20', color: insight.color }}
                >
                  {insight.icon}
                </div>
                <div className="insight-content">
                  <h5 className="insight-title">{insight.title}</h5>
                  <p className="insight-description">{insight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Predictions */}
      {predictions.length > 0 && (
        <motion.div 
          className="predictions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h4 className="section-title">
            <Lightbulb className="w-5 h-5" />
            Predictive Analytics
          </h4>
          <div className="predictions-grid">
            {predictions.map((prediction, index) => (
              <motion.div 
                key={index}
                className="prediction-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div 
                  className="prediction-icon"
                  style={{ backgroundColor: prediction.color + '20', color: prediction.color }}
                >
                  {prediction.icon}
                </div>
                <div className="prediction-content">
                  <h5 className="prediction-title">{prediction.title}</h5>
                  <p className="prediction-description">{prediction.description}</p>
                  <div className="confidence-indicator">
                    <span className="confidence-label">Confidence:</span>
                    <div className="confidence-bar">
                      <div 
                        className="confidence-fill"
                        style={{ 
                          width: `${prediction.confidence}%`,
                          backgroundColor: prediction.color 
                        }}
                      />
                    </div>
                    <span className="confidence-percent">{prediction.confidence}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodAnalytics; 