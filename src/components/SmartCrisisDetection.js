import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Phone, MessageCircle, Heart, Shield, UserCheck } from 'lucide-react';

const SmartCrisisDetection = ({ moodEntries = [], currentMoodNote = '', chatMessages = [] }) => {
  const [riskLevel, setRiskLevel] = useState('low'); // low, medium, high, critical
  const [alerts, setAlerts] = useState([]);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Crisis keywords and phrases to monitor
  const crisisKeywords = {
    critical: [
      'kill myself', 'end it all', 'not worth living', 'better off dead',
      'suicide', 'end my life', 'want to die', 'harm myself',
      'nobody cares', 'no point', 'give up', 'can\'t go on'
    ],
    high: [
      'hopeless', 'worthless', 'burden', 'trapped', 'no way out',
      'empty', 'numb', 'dark place', 'can\'t cope', 'overwhelming',
      'exhausted', 'broken', 'failing', 'disaster'
    ],
    medium: [
      'stressed', 'anxious', 'worried', 'scared', 'alone',
      'sad', 'depressed', 'tired', 'struggling', 'difficult'
    ]
  };

  const crisisResources = [
    {
      name: 'National Suicide Prevention Lifeline',
      number: '988',
      description: '24/7 crisis support and suicide prevention',
      icon: <Phone className="w-5 h-5" />
    },
    {
      name: 'Crisis Text Line',
      number: '741741',
      text: 'HOME',
      description: 'Text HOME to 741741 for crisis counseling',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      name: 'Emergency Services',
      number: '911',
      description: 'Immediate emergency response',
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  const analyzeTextForCrisis = (text) => {
    if (!text || typeof text !== 'string') return 'low';
    
    const lowerText = text.toLowerCase();
    
    // Check for critical keywords
    for (const keyword of crisisKeywords.critical) {
      if (lowerText.includes(keyword)) {
        return 'critical';
      }
    }
    
    // Check for high-risk keywords
    let highRiskCount = 0;
    for (const keyword of crisisKeywords.high) {
      if (lowerText.includes(keyword)) {
        highRiskCount++;
      }
    }
    
    if (highRiskCount >= 2) return 'high';
    if (highRiskCount >= 1) return 'medium';
    
    // Check for medium-risk keywords
    let mediumRiskCount = 0;
    for (const keyword of crisisKeywords.medium) {
      if (lowerText.includes(keyword)) {
        mediumRiskCount++;
      }
    }
    
    if (mediumRiskCount >= 3) return 'medium';
    
    return 'low';
  };

  const analyzeMoodPattern = () => {
    if (moodEntries.length < 3) return 'low';
    
    const recentEntries = moodEntries.slice(-7); // Last 7 entries
    const averageMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    
    // Check for consistently low mood
    const lowMoodCount = recentEntries.filter(entry => entry.mood <= 2).length;
    const veryLowMoodCount = recentEntries.filter(entry => entry.mood === 1).length;
    
    if (veryLowMoodCount >= 3) return 'critical';
    if (lowMoodCount >= 5) return 'high';
    if (averageMood <= 2) return 'medium';
    
    // Check for sudden mood drops
    if (recentEntries.length >= 3) {
      const lastMood = recentEntries[recentEntries.length - 1].mood;
      const previousMoods = recentEntries.slice(-3, -1);
      const previousAverage = previousMoods.reduce((sum, entry) => sum + entry.mood, 0) / previousMoods.length;
      
      if (lastMood <= 2 && previousAverage >= 4) return 'high';
      if (lastMood <= 1 && previousAverage >= 3) return 'critical';
    }
    
    return 'low';
  };

  const generateAlert = (type, level, message, suggestions = []) => {
    const alertId = Date.now() + Math.random();
    const newAlert = {
      id: alertId,
      type,
      level,
      message,
      suggestions,
      timestamp: new Date(),
      dismissed: false
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep only 5 most recent alerts
    
    if (level === 'critical') {
      setShowCrisisModal(true);
    }
    
    return newAlert;
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
  };

  const getRiskLevelInfo = (level) => {
    switch (level) {
      case 'critical':
        return {
          color: '#DC2626',
          backgroundColor: '#FEE2E2',
          icon: <AlertTriangle className="w-6 h-6" />,
          title: 'Crisis Detected',
          description: 'Immediate attention needed'
        };
      case 'high':
        return {
          color: '#EA580C',
          backgroundColor: '#FED7AA',
          icon: <Shield className="w-6 h-6" />,
          title: 'High Risk',
          description: 'Consider seeking support'
        };
      case 'medium':
        return {
          color: '#D97706',
          backgroundColor: '#FEF3C7',
          icon: <Heart className="w-6 h-6" />,
          title: 'Moderate Concern',
          description: 'Monitor closely'
        };
      default:
        return {
          color: '#059669',
          backgroundColor: '#D1FAE5',
          icon: <UserCheck className="w-6 h-6" />,
          title: 'Low Risk',
          description: 'Doing well'
        };
    }
  };

  useEffect(() => {
    // Run crisis detection every time inputs change
    const currentTime = Date.now();
    if (currentTime - lastCheckTime < 1000) return; // Throttle to once per second
    
    setLastCheckTime(currentTime);
    
    // Analyze current mood note
    const textRisk = analyzeTextForCrisis(currentMoodNote);
    
    // Analyze mood patterns
    const patternRisk = analyzeMoodPattern();
    
    // Analyze chat messages (recent ones)
    let chatRisk = 'low';
    if (chatMessages.length > 0) {
      const recentMessages = chatMessages.slice(-5).map(msg => msg.text).join(' ');
      chatRisk = analyzeTextForCrisis(recentMessages);
    }
    
    // Determine overall risk level (take the highest)
    const risks = [textRisk, patternRisk, chatRisk];
    let overallRisk = 'low';
    
    if (risks.includes('critical')) overallRisk = 'critical';
    else if (risks.includes('high')) overallRisk = 'high';
    else if (risks.includes('medium')) overallRisk = 'medium';
    
    setRiskLevel(overallRisk);
    
    // Generate alerts based on risk level changes
    if (overallRisk === 'critical' && riskLevel !== 'critical') {
      generateAlert(
        'crisis',
        'critical',
        'Crisis indicators detected. Your safety is important - please reach out for immediate help.',
        [
          'Call 988 for immediate crisis support',
          'Text HOME to 741741',
          'Go to your nearest emergency room',
          'Contact a trusted friend or family member'
        ]
      );
    } else if (overallRisk === 'high' && !['high', 'critical'].includes(riskLevel)) {
      generateAlert(
        'warning',
        'high',
        'Concerning patterns detected. Consider reaching out for professional support.',
        [
          'Talk to a mental health professional',
          'Use our self-help tools',
          'Connect with our community support',
          'Practice mindfulness exercises'
        ]
      );
    } else if (overallRisk === 'medium' && riskLevel === 'low') {
      generateAlert(
        'caution',
        'medium',
        'Some concerning indicators noted. Take extra care of yourself.',
        [
          'Try a guided meditation',
          'Use breathing exercises',
          'Connect with supportive friends',
          'Consider professional guidance'
        ]
      );
    }
  }, [moodEntries, currentMoodNote, chatMessages]);

  const riskInfo = getRiskLevelInfo(riskLevel);

  return (
    <div className="crisis-detection-container">
      {/* Risk Level Indicator */}
      <motion.div 
        className="risk-indicator"
        style={{ 
          backgroundColor: riskInfo.backgroundColor,
          borderColor: riskInfo.color 
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="risk-header">
          <div 
            className="risk-icon"
            style={{ color: riskInfo.color }}
          >
            {riskInfo.icon}
          </div>
          <div className="risk-info">
            <h4 className="risk-title" style={{ color: riskInfo.color }}>
              {riskInfo.title}
            </h4>
            <p className="risk-description">{riskInfo.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Active Alerts */}
      <AnimatePresence>
        {alerts.filter(alert => !alert.dismissed).map(alert => (
          <motion.div
            key={alert.id}
            className={`alert alert-${alert.level}`}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="alert-content">
              <h5 className="alert-message">{alert.message}</h5>
              {alert.suggestions.length > 0 && (
                <ul className="alert-suggestions">
                  {alert.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
            <button 
              onClick={() => dismissAlert(alert.id)}
              className="alert-dismiss"
            >
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Crisis Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <motion.div 
            className="crisis-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCrisisModal(false)}
          >
            <motion.div 
              className="crisis-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="crisis-modal-header">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <h3 className="crisis-modal-title">
                  You're Not Alone - Help is Available
                </h3>
              </div>
              
              <div className="crisis-modal-content">
                <p className="crisis-message">
                  We've detected that you might be going through a difficult time. 
                  Your life has value and there are people who want to help. 
                  Please reach out for immediate support:
                </p>
                
                <div className="crisis-resources">
                  {crisisResources.map((resource, index) => (
                    <motion.div 
                      key={resource.name}
                      className="crisis-resource"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="resource-icon">
                        {resource.icon}
                      </div>
                      <div className="resource-info">
                        <h4 className="resource-name">{resource.name}</h4>
                        <p className="resource-description">{resource.description}</p>
                        <div className="resource-contact">
                          {resource.text ? (
                            <a 
                              href={`sms:${resource.number}`}
                              className="resource-button primary"
                            >
                              Text {resource.text} to {resource.number}
                            </a>
                          ) : (
                            <a 
                              href={`tel:${resource.number}`}
                              className="resource-button primary"
                            >
                              Call {resource.number}
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="crisis-encouragement">
                  <h4>Remember:</h4>
                  <ul>
                    <li>Crisis feelings are temporary</li>
                    <li>You deserve support and care</li>
                    <li>Professional help is available 24/7</li>
                    <li>Many people have felt this way and found help</li>
                  </ul>
                </div>
              </div>
              
              <div className="crisis-modal-footer">
                <button 
                  onClick={() => setShowCrisisModal(false)}
                  className="crisis-close-btn"
                >
                  I'll Reach Out for Help
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Crisis Resources (Always Visible) */}
      <div className="quick-crisis-resources">
        <h4 className="quick-resources-title">Quick Crisis Support</h4>
        <div className="quick-resources-buttons">
          <a href="tel:988" className="quick-resource-btn crisis">
            <Phone className="w-4 h-4" />
            Call 988
          </a>
          <a href="sms:741741" className="quick-resource-btn warning">
            <MessageCircle className="w-4 h-4" />
            Text 741741
          </a>
          <a href="tel:911" className="quick-resource-btn emergency">
            <AlertTriangle className="w-4 h-4" />
            Call 911
          </a>
        </div>
      </div>
    </div>
  );
};

export default SmartCrisisDetection; 