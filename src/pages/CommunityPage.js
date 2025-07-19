import React, { useState, useEffect } from 'react';
import { getChatMessages, saveChatMessage } from '../utils/localStorage';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  const chatRooms = [
    { id: 'general', name: 'General Support', description: 'A safe space for general mental health discussions', icon: '💬', members: 45, online: 12 },
    { id: 'anxiety', name: 'Anxiety Support', description: 'Connect with others who understand anxiety', icon: '🤝', members: 38, online: 8 },
    { id: 'depression', name: 'Depression Support', description: 'Share experiences and find hope together', icon: '🌟', members: 52, online: 15 },
    { id: 'stress', name: 'Stress Management', description: 'Discuss coping strategies for daily stress', icon: '🧘‍♀️', members: 33, online: 7 },
    { id: 'students', name: 'Student Support', description: 'Academic pressure and student life discussions', icon: '📚', members: 28, online: 9 },
    { id: 'workplace', name: 'Workplace Wellness', description: 'Work-life balance and career stress', icon: '💼', members: 41, online: 11 }
  ];

  const supportGroups = [
    { id: 'mindfulness', name: 'Daily Mindfulness Circle', description: 'Practice mindfulness together', time: 'Daily 7:00 PM', participants: 15, type: 'guided' },
    { id: 'gratitude', name: 'Gratitude Warriors', description: 'Share daily gratitude and positivity', time: 'Daily 9:00 AM', participants: 23, type: 'peer' },
    { id: 'goals', name: 'Goal Getters', description: 'Accountability for personal goals', time: 'Weekly Mon 6:00 PM', participants: 18, type: 'peer' },
    { id: 'creativity', name: 'Creative Healing', description: 'Art, writing, and creative expression', time: 'Tue & Thu 5:00 PM', participants: 12, type: 'guided' }
  ];

  const successStories = [
    { id: 1, title: 'From Panic to Peace', author: 'Anna M.', preview: 'Six months ago, I couldn\'t leave my house...', category: 'Anxiety', likes: 47, time: '2 days ago' },
    { id: 2, title: 'Finding Light Again', author: 'Mike R.', preview: 'After months of feeling hopeless...', category: 'Depression', likes: 62, time: '5 days ago' },
    { id: 3, title: 'Work-Life Balance Win', author: 'Sarah K.', preview: 'I used to work 80-hour weeks...', category: 'Stress', likes: 38, time: '1 week ago' },
    { id: 4, title: 'College Comeback Story', author: 'Josh L.', preview: 'Failed my first semester, but...', category: 'Student Life', likes: 29, time: '1 week ago' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Mental Health Awareness Webinar', date: '2024-01-20', time: '2:00 PM', type: 'Educational', attendees: 234 },
    { id: 2, title: 'Guided Meditation Session', date: '2024-01-22', time: '7:00 PM', type: 'Wellness', attendees: 89 },
    { id: 3, title: 'Peer Support Training', date: '2024-01-25', time: '6:00 PM', type: 'Training', attendees: 45 },
    { id: 4, title: 'Art Therapy Workshop', date: '2024-01-27', time: '4:00 PM', type: 'Creative', attendees: 67 }
  ];

  const mentors = [
    { id: 1, name: 'Dr. Emma Wilson', specialty: 'Anxiety & Stress', experience: '8 years', rating: 4.9, sessions: 127, available: true },
    { id: 2, name: 'Mark Thompson', specialty: 'Depression Support', experience: '5 years', rating: 4.8, sessions: 89, available: false },
    { id: 3, name: 'Lisa Chen', specialty: 'Student Wellness', experience: '6 years', rating: 4.9, sessions: 156, available: true },
    { id: 4, name: 'Alex Rodriguez', specialty: 'Workplace Stress', experience: '7 years', rating: 4.7, sessions: 203, available: true }
  ];

  useEffect(() => {
    if (selectedRoom) {
      const roomMessages = getChatMessages(selectedRoom.id);
      setMessages(roomMessages);
    }
  }, [selectedRoom]);

  useEffect(() => {
    const weeklyChallenge = {
      id: 'week47',
      title: 'Gratitude Photo Challenge',
      description: 'Take a photo of something you\'re grateful for each day',
      participants: 156,
      daysLeft: 4,
      myProgress: 3,
      totalDays: 7,
      reward: '50 XP + Gratitude Badge'
    };
    setCurrentChallenge(weeklyChallenge);
  }, []);

  const handleSetName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsNameSet(true);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoom) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: userName,
      timestamp: new Date().toLocaleString(),
      roomId: selectedRoom.id
    };

    saveChatMessage(selectedRoom.id, message);
    const updatedMessages = getChatMessages(selectedRoom.id);
    setMessages(updatedMessages);
    setNewMessage('');
  };

  const handleJoinGroup = (groupId) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
    }
  };

  if (!isNameSet) {
    return (
      <div className="page-container">
        <div className="community-welcome">
          <div className="welcome-hero">
            <h1>🌟 Welcome to Our Community</h1>
            <p>Join thousands of people supporting each other on their mental health journey</p>
          </div>
          
          <div className="community-stats">
            <div className="stat-item">
              <span className="stat-number">2,847</span>
              <span className="stat-label">Active Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">156</span>
              <span className="stat-label">Online Now</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">12,394</span>
              <span className="stat-label">Messages Today</span>
            </div>
          </div>

          <div className="name-setup">
            <form onSubmit={handleSetName} className="name-form">
              <h3>Choose Your Anonymous Identity</h3>
              <p>Your privacy is protected. Pick any name you'd like!</p>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter anonymous name (e.g., SupportFriend)"
                className="name-input"
                required
              />
              <button type="submit" className="name-submit">🚀 Join Community</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const renderChatRooms = () => (
    <div className="chat-section">
      <div className="section-header">
        <h2>💬 Chat Rooms</h2>
        <p>Connect instantly with peers in real-time discussions</p>
      </div>
      
      <div className="rooms-grid">
        {chatRooms.map(room => (
          <div key={room.id} className="room-card enhanced">
            <div className="room-header">
              <div className="room-icon">{room.icon}</div>
              <div className="room-stats">
                <span className="members-count">{room.members} members</span>
                <span className="online-count">🟢 {room.online} online</span>
              </div>
            </div>
            <h3>{room.name}</h3>
            <p>{room.description}</p>
            <div className="room-activity">
              <div className="activity-dots">
                <span className="dot active"></span>
                <span className="dot active"></span>
                <span className="dot"></span>
              </div>
              <span>Active discussion</span>
            </div>
            <button onClick={() => setSelectedRoom(room)} className="join-btn pulse">
              Join Conversation
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupportGroups = () => (
    <div className="support-groups-section">
      <div className="section-header">
        <h2>🤝 Support Groups</h2>
        <p>Structured group activities and peer support sessions</p>
      </div>
      
      <div className="groups-grid">
        {supportGroups.map(group => (
          <div key={group.id} className="group-card">
            <div className="group-type-badge">
              {group.type === 'guided' ? '👨‍⚕️ Guided' : '👥 Peer-led'}
            </div>
            <h3>{group.name}</h3>
            <p>{group.description}</p>
            <div className="group-details">
              <div className="detail-item">
                <span className="icon">⏰</span>
                <span>{group.time}</span>
              </div>
              <div className="detail-item">
                <span className="icon">👥</span>
                <span>{group.participants} participants</span>
              </div>
            </div>
            <button 
              className={`group-join-btn ${joinedGroups.includes(group.id) ? 'joined' : ''}`}
              onClick={() => handleJoinGroup(group.id)}
              disabled={joinedGroups.includes(group.id)}
            >
              {joinedGroups.includes(group.id) ? '✅ Joined' : 'Join Group'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuccessStories = () => (
    <div className="success-stories-section">
      <div className="section-header">
        <h2>🌟 Success Stories</h2>
        <p>Real stories of hope, healing, and triumph from our community</p>
      </div>
      
      <div className="stories-grid">
        {successStories.map(story => (
          <div key={story.id} className="story-card">
            <div className="story-category">{story.category}</div>
            <h3>{story.title}</h3>
            <p className="story-author">by {story.author}</p>
            <p className="story-preview">{story.preview}</p>
            <div className="story-footer">
              <div className="story-likes">
                <span className="heart">❤️</span>
                <span>{story.likes} likes</span>
              </div>
              <span className="story-time">{story.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMentorship = () => (
    <div className="mentorship-section">
      <div className="section-header">
        <h2>🎯 Peer Mentorship</h2>
        <p>Connect with experienced mentors for personalized guidance</p>
      </div>
      
      <div className="mentors-grid">
        {mentors.map(mentor => (
          <div key={mentor.id} className="mentor-card">
            <div className="mentor-avatar">
              <div className="avatar-circle">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={`availability-indicator ${mentor.available ? 'available' : 'busy'}`}>
                {mentor.available ? '🟢' : '🔴'}
              </div>
            </div>
            <h3>{mentor.name}</h3>
            <p className="mentor-specialty">{mentor.specialty}</p>
            <div className="mentor-stats">
              <div className="stat">
                <span className="stat-value">{mentor.rating}</span>
                <span className="stat-label">⭐ Rating</span>
              </div>
              <div className="stat">
                <span className="stat-value">{mentor.sessions}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat">
                <span className="stat-value">{mentor.experience}</span>
                <span className="stat-label">Experience</span>
              </div>
            </div>
            <button 
              className={`mentor-connect-btn ${mentor.available ? 'available' : 'unavailable'}`}
              disabled={!mentor.available}
            >
              {mentor.available ? 'Connect Now' : 'Currently Busy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChallenges = () => (
    <div className="challenges-section">
      <div className="section-header">
        <h2>🎯 Weekly Challenge</h2>
        <p>Join community challenges to build positive habits together</p>
      </div>
      
      {currentChallenge && (
        <div className="challenge-card active">
          <div className="challenge-header">
            <h3>{currentChallenge.title}</h3>
            <div className="challenge-timer">
              <span className="days-left">{currentChallenge.daysLeft}</span>
              <span className="days-label">days left</span>
            </div>
          </div>
          
          <p className="challenge-description">{currentChallenge.description}</p>
          
          <div className="challenge-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{width: `${(currentChallenge.myProgress / currentChallenge.totalDays) * 100}%`}}
              ></div>
            </div>
            <span className="progress-text">
              {currentChallenge.myProgress}/{currentChallenge.totalDays} days completed
            </span>
          </div>
          
          <div className="challenge-stats">
            <div className="stat-item">
              <span className="stat-icon">👥</span>
              <span>{currentChallenge.participants} participants</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🏆</span>
              <span>{currentChallenge.reward}</span>
            </div>
          </div>
          
          <button className="challenge-action-btn">
            📸 Upload Today's Photo
          </button>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h2>📅 Upcoming Events</h2>
        <p>Join live sessions, workshops, and community gatherings</p>
      </div>
      
      <div className="events-timeline">
        {upcomingEvents.map(event => (
                     <div key={event.id} className="event-card">
            <div className="event-date">
              <span className="date-day">{new Date(event.date).getDate()}</span>
              <span className="date-month">{new Date(event.date).toLocaleDateString('en', {month: 'short'})}</span>
            </div>
            <div className="event-content">
              <h3>{event.title}</h3>
              <div className="event-details">
                <span className="event-time">🕐 {event.time}</span>
                <span className="event-type">{event.type}</span>
                <span className="event-attendees">👥 {event.attendees} attending</span>
              </div>
            </div>
            <button className="event-join-btn">Join Event</button>
          </div>
        ))}
      </div>
    </div>
  );

  if (selectedRoom) {
    return (
      <div className="page-container">
        <div className="chat-room enhanced">
          <div className="chat-header">
            <button onClick={() => setSelectedRoom(null)} className="back-btn">
              ← Back to Community
            </button>
            <div className="room-info">
              <h2>{selectedRoom.icon} {selectedRoom.name}</h2>
              <span className="room-members">{selectedRoom.members} members • {selectedRoom.online} online</span>
            </div>
            <span className="user-info">You: {userName}</span>
          </div>
          
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-chat">
                <p>🌟 Start the conversation! Be the first to share something positive.</p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`message ${message.sender === userName ? 'own' : 'other'}`}>
                  <div className="message-sender">{message.sender}</div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.timestamp}</div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="message-form enhanced">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message... Remember to be kind and supportive 💙"
              className="message-input"
            />
            <button type="submit" className="send-btn">
              <span>📤</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="community-header">
        <h1 className="page-title">🌍 Community Support</h1>
        <p className="page-description">
          Welcome back, <strong>{userName}</strong>! Connect, share, and grow together.
        </p>
        
        <div className="community-navigation">
          <button 
            className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat Rooms
          </button>
          <button 
            className={`nav-tab ${activeTab === 'groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('groups')}
          >
            🤝 Support Groups
          </button>
          <button 
            className={`nav-tab ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('stories')}
          >
            🌟 Success Stories
          </button>
          <button 
            className={`nav-tab ${activeTab === 'mentorship' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentorship')}
          >
            🎯 Mentorship
          </button>
          <button 
            className={`nav-tab ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            🏆 Challenges
          </button>
          <button 
            className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events
          </button>
        </div>
      </div>

      <div className="community-content">
        {activeTab === 'chat' && renderChatRooms()}
        {activeTab === 'groups' && renderSupportGroups()}
        {activeTab === 'stories' && renderSuccessStories()}
        {activeTab === 'mentorship' && renderMentorship()}
        {activeTab === 'challenges' && renderChallenges()}
        {activeTab === 'events' && renderEvents()}
      </div>

      <div className="user-actions">
        <button onClick={() => setIsNameSet(false)} className="change-name-btn">
          👤 Change Name
        </button>
      </div>

      <div className="crisis-section">
        <div className="crisis-card enhanced">
          <h3>🚨 Need Immediate Help?</h3>
          <p>Crisis support is available 24/7</p>
          <div className="crisis-contacts">
            <a href="tel:988" className="crisis-link primary">📞 988 - Crisis Lifeline</a>
            <a href="sms:741741" className="crisis-link secondary">💬 Text HOME to 741741</a>
            <a href="tel:911" className="crisis-link emergency">🚨 911 - Emergency</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage; 