import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useLenis = () => {
  const location = useLocation();

  useEffect(() => {
    // Create a simple smooth scrolling behavior with CSS
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Enhanced smooth scrolling for better experience
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth !important;
      }
      
      * {
        scroll-behavior: smooth !important;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto !important;
        }
        * {
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.documentElement.style.scrollBehavior = '';
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
};

export default useLenis; 