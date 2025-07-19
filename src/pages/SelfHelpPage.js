import React, { useState } from 'react';
import { selfHelpTools, toolCategories } from '../data/selfHelpTools';

const SelfHelpPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState(null);
  const [expandedTools, setExpandedTools] = useState({});

  const filteredTools = selectedCategory === 'All' 
    ? selfHelpTools 
    : selfHelpTools.filter(tool => tool.category === selectedCategory);

  const openToolDetails = (tool) => {
    setSelectedTool(tool);
  };

  const closeToolDetails = () => {
    setSelectedTool(null);
  };

  const toggleToolExpansion = (toolId) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Self-Help Tools</h1>
        <p className="page-description">
          Discover practical tools and techniques to improve your mental well-being and develop healthy coping strategies.
        </p>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Filter by Category:</h3>
        <div className="filter-buttons">
          {toolCategories.map(category => (
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

      {/* Tools Grid */}
      <div className="tools-grid">
        {filteredTools.map(tool => (
          <div key={tool.id} className="tool-card">
            <div className="tool-header">
              <div className="tool-icon-large">{tool.icon}</div>
              <div className="tool-meta">
                <h3 className="tool-title">{tool.title}</h3>
                <span className="tool-category">{tool.category}</span>
              </div>
            </div>
            
            <p className="tool-description">{tool.description}</p>

            <div className="tool-actions">
              <button
                onClick={() => toggleToolExpansion(tool.id)}
                className="expand-tool-btn"
              >
                {expandedTools[tool.id] ? 'Hide Details' : 'Show Details'}
              </button>
              <button
                onClick={() => openToolDetails(tool)}
                className="practice-tool-btn"
              >
                Start Practice
              </button>
            </div>

            {/* Expanded Details */}
            {expandedTools[tool.id] && (
              <div className="tool-details">
                <div className="instructions-section">
                  <h4 className="details-title">Instructions:</h4>
                  <ol className="instructions-list">
                    {tool.instructions.map((instruction, index) => (
                      <li key={index} className="instruction-item">
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="benefits-section">
                  <h4 className="details-title">Benefits:</h4>
                  <ul className="benefits-list">
                    {tool.benefits.map((benefit, index) => (
                      <li key={index} className="benefit-item">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tool Practice Modal */}
      {selectedTool && (
        <div className="modal-overlay" onClick={closeToolDetails}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <span className="modal-icon">{selectedTool.icon}</span>
                <h2 className="modal-title">{selectedTool.title}</h2>
              </div>
              <button onClick={closeToolDetails} className="close-btn">×</button>
            </div>
            
            <div className="modal-body">
              <div className="practice-description">
                <p>{selectedTool.description}</p>
              </div>

              <div className="practice-instructions">
                <h3 className="practice-section-title">How to Practice:</h3>
                <div className="instruction-cards">
                  {selectedTool.instructions.map((instruction, index) => (
                    <div key={index} className="instruction-card">
                      <div className="instruction-number">{index + 1}</div>
                      <div className="instruction-text">{instruction}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="practice-benefits">
                <h3 className="practice-section-title">Benefits You'll Experience:</h3>
                <div className="benefit-tags">
                  {selectedTool.benefits.map((benefit, index) => (
                    <span key={index} className="benefit-tag">
                      ✓ {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="practice-tips">
                <h3 className="practice-section-title">Tips for Success:</h3>
                <div className="tips-grid">
                  <div className="tip-card">
                    <span className="tip-icon">🎯</span>
                    <div className="tip-content">
                      <h4>Start Small</h4>
                      <p>Begin with short sessions and gradually increase duration.</p>
                    </div>
                  </div>
                  <div className="tip-card">
                    <span className="tip-icon">🕒</span>
                    <div className="tip-content">
                      <h4>Be Consistent</h4>
                      <p>Regular practice is more effective than occasional long sessions.</p>
                    </div>
                  </div>
                  <div className="tip-card">
                    <span className="tip-icon">🤝</span>
                    <div className="tip-content">
                      <h4>Be Patient</h4>
                      <p>Give yourself time to learn and don't judge your progress.</p>
                    </div>
                  </div>
                  <div className="tip-card">
                    <span className="tip-icon">📝</span>
                    <div className="tip-content">
                      <h4>Track Progress</h4>
                      <p>Keep notes about your experience and what works best.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Practice Section */}
      <div className="quick-practice-section">
        <h2 className="section-title">Quick Practice Exercises</h2>
        <div className="quick-exercises">
          <div className="quick-exercise-card">
            <div className="exercise-icon">🫁</div>
            <h3 className="exercise-title">4-7-8 Breathing</h3>
            <p className="exercise-description">
              Inhale for 4, hold for 7, exhale for 8. Repeat 4 times for instant calm.
            </p>
            <div className="exercise-duration">2 minutes</div>
          </div>
          
          <div className="quick-exercise-card">
            <div className="exercise-icon">👀</div>
            <h3 className="exercise-title">5-4-3-2-1 Grounding</h3>
            <p className="exercise-description">
              Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.
            </p>
            <div className="exercise-duration">3 minutes</div>
          </div>
          
          <div className="quick-exercise-card">
            <div className="exercise-icon">💪</div>
            <h3 className="exercise-title">Progressive Relaxation</h3>
            <p className="exercise-description">
              Tense and release each muscle group from toes to head.
            </p>
            <div className="exercise-duration">10 minutes</div>
          </div>
          
          <div className="quick-exercise-card">
            <div className="exercise-icon">🧘</div>
            <h3 className="exercise-title">Mindful Moment</h3>
            <p className="exercise-description">
              Focus on your breath and observe thoughts without judgment.
            </p>
            <div className="exercise-duration">5 minutes</div>
          </div>
        </div>
      </div>

      {/* Crisis Resources */}
      <div className="crisis-section">
        <div className="crisis-card">
          <h3 className="crisis-title">🚨 In Crisis? Get Immediate Help</h3>
          <p className="crisis-description">
            If you're experiencing a mental health emergency, please reach out immediately:
          </p>
          <div className="crisis-contacts">
            <a href="tel:988" className="crisis-link">📞 988 - Suicide & Crisis Lifeline</a>
            <a href="sms:741741" className="crisis-link">💬 Text HOME to 741741</a>
            <a href="tel:911" className="crisis-link">🚑 911 - Emergency Services</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfHelpPage; 