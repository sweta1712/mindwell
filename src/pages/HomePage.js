import React from 'react';
import { Link } from 'react-router-dom';
import ChatBot3D from '../components/ChatBot3D';

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      {/* 3D Chatbot */}
      <ChatBot3D />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">
            Your Mental Wellness Journey Starts Here
          </h1>
          <p className="hero-subtitle">
            Find the support, tools, and community you need to thrive. Take the first step towards better mental health today.
          </p>
          <div className="hero-buttons">
            <Link to="/mood-tracking" className="hero-btn primary">
              Start Mood Tracking
            </Link>
            <Link to="/resources" className="hero-btn secondary">
              Explore Resources
            </Link>
          </div>
        </div>
      </div>

      {/* Features Overview Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Comprehensive Mental Health Support
            </h2>
            <p className="features-description">
              Our platform offers a complete suite of tools and resources designed to support your mental wellness journey.
            </p>
          </div>
          <div className="features-grid">
            {/* Feature 1 */}
            <Link to="/mood-tracking" className="feature-card interactive">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Mood Tracking</h3>
              <p className="feature-description">
                Monitor your emotions daily, identify patterns, and gain insights into your mental health journey.
              </p>
              <div className="feature-action">Track Your Mood →</div>
            </Link>

            {/* Feature 2 */}
            <Link to="/meditation" className="feature-card interactive">
              <div className="feature-icon">🧘‍♀️</div>
              <h3 className="feature-title">Guided Meditation</h3>
              <p className="feature-description">
                Access a library of guided meditations for stress relief, anxiety management, and better sleep.
              </p>
              <div className="feature-action">Start Meditating →</div>
            </Link>

            {/* Feature 3 */}
            <Link to="/self-help" className="feature-card interactive">
              <div className="feature-icon">🛠️</div>
              <h3 className="feature-title">Self-Help Tools</h3>
              <p className="feature-description">
                Practical tools and techniques for managing stress, anxiety, and improving overall well-being.
              </p>
              <div className="feature-action">Explore Tools →</div>
            </Link>

            {/* Feature 4 */}
            <Link to="/resources" className="feature-card interactive">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">Educational Resources</h3>
              <p className="feature-description">
                Learn about mental health conditions, coping strategies, and recovery through our comprehensive guides.
              </p>
              <div className="feature-action">Read Resources →</div>
            </Link>

            {/* Feature 5 */}
            <Link to="/community" className="feature-card interactive">
              <div className="feature-icon">💬</div>
              <h3 className="feature-title">Anonymous Support</h3>
              <p className="feature-description">
                Connect with others in our safe, anonymous chat rooms for peer support and understanding.
              </p>
              <div className="feature-action">Join Community →</div>
            </Link>

            {/* Feature 6 */}
            <div className="feature-card">
              <div className="feature-icon">🚨</div>
              <h3 className="feature-title">Crisis Support</h3>
              <p className="feature-description">
                Immediate access to crisis resources and professional help when you need it most.
              </p>
              <div className="feature-action">Get Help Now →</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="quick-start-section">
        <div className="quick-start-container">
          <h2 className="quick-start-title">Get Started in 3 Simple Steps</h2>
          <div className="quick-start-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Track Your Mood</h3>
              <p className="step-description">Begin by recording how you feel each day to establish a baseline.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Explore Resources</h3>
              <p className="step-description">Learn about mental health and discover coping strategies that work for you.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Practice Self-Care</h3>
              <p className="step-description">Use our meditation guides and self-help tools to build healthy habits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Support Section */}
      <div className="emergency-section">
        <div className="emergency-container">
          <div className="emergency-content">
            <h2 className="emergency-title">Need Immediate Help?</h2>
            <p className="emergency-description">
              If you're experiencing a mental health crisis or having thoughts of self-harm, help is available 24/7.
              </p>
            <div className="emergency-buttons">
              <a href="tel:988" className="emergency-btn">
                📞 Call 988 (Suicide & Crisis Lifeline)
              </a>
              <a href="sms:741741" className="emergency-btn">
                💬 Text HOME to 741741
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;