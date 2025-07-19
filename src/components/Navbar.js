import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo">
            <Link to="/" className="navbar-brand">🧠 MindWell</Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="navbar-mobile-menu-btn">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-btn"
            >
              ☰
            </button>
          </div>

          {/* Desktop menu - only show when authenticated */}
          {isAuthenticated() && (
            <div className="navbar-menu">
              <div className="navbar-links">
                <Link 
                  to="/" 
                  className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                >
                  Home
                </Link>
                <Link 
                  to="/resources" 
                  className={`navbar-link ${isActive('/resources') ? 'active' : ''}`}
                >
                  Resources
                </Link>
                <Link 
                  to="/mood-tracking" 
                  className={`navbar-link ${isActive('/mood-tracking') ? 'active' : ''}`}
                >
                  Mood Tracking
                </Link>
                <Link 
                  to="/meditation" 
                  className={`navbar-link ${isActive('/meditation') ? 'active' : ''}`}
                >
                  Meditation
                </Link>
                <Link 
                  to="/self-help" 
                  className={`navbar-link ${isActive('/self-help') ? 'active' : ''}`}
                >
                  Self-Help Tools
                </Link>
                <Link 
                  to="/mind-games" 
                  className={`navbar-link ${isActive('/mind-games') ? 'active' : ''}`}
                >
                  Mind Games
                </Link>
                <Link 
                  to="/community" 
                  className={`navbar-link ${isActive('/community') ? 'active' : ''}`}
                >
                  Community
                </Link>
              </div>
            </div>
          )}
            
          {/* Authentication Section */}
          <div className="navbar-auth">
            {isAuthenticated() ? (
              <div className="user-menu">
                <button 
                  className="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="user-avatar-small"
                  />
                  <span className="user-name">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <img 
                        src={user?.avatar} 
                        alt={user?.name}
                        className="user-avatar"
                      />
                      <div>
                        <p className="user-dropdown-name">{user?.name}</p>
                        <p className="user-dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <button 
                      className="user-dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/register" className="navbar-btn auth-btn">
                  <User size={16} />
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            {/* Only show navigation links when authenticated */}
            {isAuthenticated() && (
              <>
                <Link 
                  to="/" 
                  className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/resources" 
                  className={`mobile-menu-link ${isActive('/resources') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resources
                </Link>
                <Link 
                  to="/mood-tracking" 
                  className={`mobile-menu-link ${isActive('/mood-tracking') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mood Tracking
                </Link>
                <Link 
                  to="/meditation" 
                  className={`mobile-menu-link ${isActive('/meditation') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meditation
                </Link>
                <Link 
                  to="/self-help" 
                  className={`mobile-menu-link ${isActive('/self-help') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Self-Help Tools
                </Link>
                <Link 
                  to="/mind-games" 
                  className={`mobile-menu-link ${isActive('/mind-games') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mind Games
                </Link>
                <Link 
                  to="/community" 
                  className={`mobile-menu-link ${isActive('/community') ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>
              </>
            )}
            
            {/* Mobile Authentication */}
            <div className="mobile-auth">
              {isAuthenticated() ? (
                <div className="mobile-user-info">
                  <div className="mobile-user-profile">
                    <img 
                      src={user?.avatar} 
                      alt={user?.name}
                      className="user-avatar-small"
                    />
                    <span>{user?.name}</span>
                  </div>
                  <button 
                    className="mobile-logout-btn"
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link 
                    to="/register" 
                    className="mobile-auth-btn auth-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} />
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;