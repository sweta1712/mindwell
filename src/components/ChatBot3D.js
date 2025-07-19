import React, { useState, useEffect, useRef } from 'react';

// Animated 2D Character Component
const AnimatedChatBot = ({ isActive, onClick, isMinimized }) => {
  const [currentEmotion, setCurrentEmotion] = useState('happy');
  
  useEffect(() => {
    const emotions = ['happy', 'thinking', 'excited', 'calm'];
    const interval = setInterval(() => {
      setCurrentEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const getEmoji = () => {
    switch (currentEmotion) {
      case 'thinking': return '🤔';
      case 'excited': return '🤗';
      case 'calm': return '😌';
      default: return '😊';
    }
  };

  return (
    <div className={`animated-chatbot ${isActive ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`} onClick={onClick}>
      <div className="bot-body">
        <div className="bot-head">
          <div className="bot-face">
            <div className="bot-eyes">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="bot-mouth"></div>
          </div>
          <div className="bot-emoji">{getEmoji()}</div>
        </div>
        <div className="bot-body-main">
          <div className="bot-chest">
            <div className="heart-beat">💙</div>
          </div>
        </div>
      </div>
      
      {/* Floating particles - only show when not minimized */}
      {!isMinimized && (
        <div className="particles">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`particle particle-${i + 1}`}>✨</div>
          ))}
        </div>
      )}
      
      {/* Pulse rings */}
      <div className="pulse-rings">
        <div className="pulse-ring ring-1"></div>
        <div className="pulse-ring ring-2"></div>
        <div className="pulse-ring ring-3"></div>
      </div>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = ({ isOpen, onClose, messages, onSendMessage, onUserInteraction }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      onUserInteraction(); // Reset timer on user interaction
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onUserInteraction(); // Reset timer on typing
  };

  const handleClose = () => {
    onClose();
    onUserInteraction(); // Reset timer when closing
  };

  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 1500);
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="chatbot-interface">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="bot-avatar">🤖</div>
          <div className="bot-info">
            <h3>MindWell Assistant</h3>
            <span className="status">🟢 Online</span>
          </div>
        </div>
        <button onClick={handleClose} className="close-chat">×</button>
      </div>
      
      <div className="chat-messages" onClick={onUserInteraction}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            <div className="message-avatar">
              {message.sender === 'bot' ? '🤖' : '😊'}
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask me about mental health..."
          className="chat-input"
          onFocus={onUserInteraction}
        />
        <button type="submit" className="send-message">
          <span>📤</span>
        </button>
      </form>
    </div>
  );
};

// Main ChatBot Component
const ChatBot3D = () => {
  const [isActive, setIsActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! I\'m your MindWell assistant. How can I help you today? 😊'
    }
  ]);
  
  const minimizeTimerRef = useRef(null);
  const MINIMIZE_DELAY = 3000; // 3 seconds

  const botResponses = [
    "That's a great question! Remember, it's okay to not be okay sometimes. 💙",
    "I'm here to listen. Mental health is just as important as physical health. 🌟",
    "Consider trying our breathing exercises or meditation guides. They're really helpful! 🧘‍♀️",
    "Have you checked out our community support? Sometimes talking to others helps. 🤝",
    "Self-care isn't selfish - it's necessary. What small thing can you do for yourself today? 🌸",
    "Remember: You are stronger than you think, braver than you feel, and more loved than you know. ❤️",
    "Try our mood tracking feature to better understand your emotional patterns. 📊",
    "Our mind games can help reduce stress and improve focus. Give them a try! 🎮",
    "Professional help is always available. Don't hesitate to reach out if you need it. 📞",
    "Taking breaks is important for mental health. Have you taken one today? ☕",
    "Gratitude can shift our perspective. What's one thing you're grateful for right now? 🙏",
    "Physical activity can boost mood. Even a short walk can make a difference! 🚶‍♀️"
  ];

  // Function to start the minimize timer
  const startMinimizeTimer = () => {
    clearTimeout(minimizeTimerRef.current);
    minimizeTimerRef.current = setTimeout(() => {
      if (!isChatOpen) {
        setIsMinimized(true);
      }
    }, MINIMIZE_DELAY);
  };

  // Function to handle user interaction (resets timer)
  const handleUserInteraction = () => {
    setIsMinimized(false);
    startMinimizeTimer();
  };

  // Start timer when component mounts
  useEffect(() => {
    startMinimizeTimer();
    
    // Cleanup timer on unmount
    return () => {
      clearTimeout(minimizeTimerRef.current);
    };
  }, []);

  // Restart timer when chat is closed
  useEffect(() => {
    if (!isChatOpen) {
      startMinimizeTimer();
    } else {
      clearTimeout(minimizeTimerRef.current);
      setIsMinimized(false);
    }
  }, [isChatOpen]);

  const handleBotClick = () => {
    setIsActive(true);
    if (isMinimized) {
      setIsMinimized(false);
      handleUserInteraction();
    } else {
      setIsChatOpen(true);
    }
    setTimeout(() => setIsActive(false), 1000);
  };

  const handleSendMessage = (text) => {
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);

    // Simulate bot response with typing delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = { sender: 'bot', text: randomResponse };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    handleUserInteraction(); // This will restart the minimize timer
  };

  return (
    <div className={`chatbot-container ${isMinimized ? 'minimized' : ''}`}>
      <AnimatedChatBot 
        isActive={isActive} 
        onClick={handleBotClick} 
        isMinimized={isMinimized}
      />
      
      {!isChatOpen && !isMinimized && (
        <div className="chatbot-prompt">
          <div className="prompt-bubble">
            <p>Hi! I'm your AI companion. Click me to chat! 💬</p>
            <div className="pulse-dot"></div>
          </div>
        </div>
      )}
      
      <ChatInterface
        isOpen={isChatOpen}
        onClose={handleChatClose}
        messages={messages}
        onSendMessage={handleSendMessage}
        onUserInteraction={handleUserInteraction}
      />
    </div>
  );
};

export default ChatBot3D; 