import React, { useState } from 'react';
import { resources, resourceCategories } from '../data/resources';

const ResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedResource, setSelectedResource] = useState(null);

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const openResource = (resource) => {
    setSelectedResource(resource);
  };

  const closeResource = () => {
    setSelectedResource(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Mental Health Resources</h1>
        <p className="page-description">
          Explore our comprehensive collection of mental health resources, articles, and guides to support your wellness journey.
        </p>
      </div>

      {/* Category Filter */}
      <div className="filter-section">
        <h3 className="filter-title">Filter by Category:</h3>
        <div className="filter-buttons">
          {resourceCategories.map(category => (
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

      {/* Resources Grid */}
      <div className="resources-grid">
        {filteredResources.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="resource-header">
              <span className="resource-type">{resource.type}</span>
              <span className="resource-category">{resource.category}</span>
            </div>
            <h3 className="resource-title">{resource.title}</h3>
            <p className="resource-description">{resource.description}</p>
            <div className="resource-footer">
              <span className="read-time">{resource.readTime}</span>
              <button 
                onClick={() => openResource(resource)}
                className="read-more-btn"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Modal */}
      {selectedResource && (
        <div className="modal-overlay" onClick={closeResource}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedResource.title}</h2>
              <button onClick={closeResource} className="close-btn">×</button>
            </div>
            <div className="modal-body">
              <div className="modal-meta">
                <span className="modal-type">{selectedResource.type}</span>
                <span className="modal-category">{selectedResource.category}</span>
                <span className="modal-read-time">{selectedResource.readTime}</span>
              </div>
              <div className="modal-content-text">
                {selectedResource.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="content-paragraph">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crisis Section */}
      <div className="crisis-section">
        <div className="crisis-card">
          <h3 className="crisis-title">🚨 Need Immediate Help?</h3>
          <p className="crisis-description">
            If you're in crisis, don't wait. Reach out for immediate support.
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

export default ResourcesPage; 