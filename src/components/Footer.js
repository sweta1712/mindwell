import React from 'react';
import { Linkedin, Instagram, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-copyright">
            <p>&copy; 2024 MindWell. All rights reserved.</p>
            <p className="footer-creator">Created with ❤️ by <span className="creator-name">Sweta Kumari</span></p>
          </div>
          
          <div className="footer-social">
            <p className="social-text">Connect with me:</p>
            <div className="social-links">
              <a 
                href="https://www.linkedin.com/in/sweta123" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link linkedin"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.instagram.com/_official_sb_2210/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
                aria-label="Instagram Profile"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://my-portfolio-xi-blush-49.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link portfolio"
                aria-label="Portfolio Website"
              >
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;