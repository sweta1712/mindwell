// Mood tracking localStorage utilities
export const getMoodEntries = () => {
  try {
    const entries = localStorage.getItem('moodEntries');
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error retrieving mood entries:', error);
    return [];
  }
};

export const saveMoodEntry = (entry) => {
  try {
    const existingEntries = getMoodEntries();
    const newEntries = [...existingEntries, entry];
    localStorage.setItem('moodEntries', JSON.stringify(newEntries));
    return true;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return false;
  }
};

export const deleteMoodEntry = (entryId) => {
  try {
    const existingEntries = getMoodEntries();
    const filteredEntries = existingEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('moodEntries', JSON.stringify(filteredEntries));
    return true;
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return false;
  }
};

// Chat messages localStorage utilities
export const getChatMessages = (roomId) => {
  try {
    const messages = localStorage.getItem(`chatMessages_${roomId}`);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    return [];
  }
};

export const saveChatMessage = (roomId, message) => {
  try {
    const existingMessages = getChatMessages(roomId);
    const newMessages = [...existingMessages, message];
    localStorage.setItem(`chatMessages_${roomId}`, JSON.stringify(newMessages));
    return true;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return false;
  }
};

// User preferences localStorage utilities
export const getUserPreferences = () => {
  try {
    const preferences = localStorage.getItem('userPreferences');
    return preferences ? JSON.parse(preferences) : {
      anonymousName: '',
      reminderTime: '',
      notifications: true
    };
  } catch (error) {
    console.error('Error retrieving user preferences:', error);
    return {
      anonymousName: '',
      reminderTime: '',
      notifications: true
    };
  }
};

export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
}; 