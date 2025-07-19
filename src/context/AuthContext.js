import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      // Initialize demo users if not already present
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.length === 0) {
        const demoUsers = [
          {
            id: 'demo1',
            name: 'Demo User',
            email: 'demo@example.com',
            password: 'demo123',
            avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=667eea&color=ffffff',
            joinDate: new Date().toISOString(),
            preferences: {
              theme: 'light',
              notifications: true,
              privacy: 'public'
            },
            stats: {
              daysActive: 5,
              activitiesCompleted: 12,
              badgesEarned: ['First Steps', 'Mood Tracker']
            }
          },
          {
            id: 'admin1',
            name: 'Admin Demo',
            email: 'admin@example.com',
            password: 'admin123',
            avatar: 'https://ui-avatars.com/api/?name=Admin+Demo&background=764ba2&color=ffffff',
            joinDate: new Date().toISOString(),
            preferences: {
              theme: 'light',
              notifications: true,
              privacy: 'public'
            },
            stats: {
              daysActive: 15,
              activitiesCompleted: 25,
              badgesEarned: ['First Steps', 'Mood Tracker', 'Game Master', 'Community Helper']
            }
          }
        ];
        localStorage.setItem('users', JSON.stringify(demoUsers));
      }
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('currentUser');
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const register = async (userData) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (existingUsers.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=667eea&color=ffffff`,
        joinDate: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true,
          privacy: 'public'
        },
        stats: {
          daysActive: 1,
          activitiesCompleted: 0,
          badgesEarned: []
        }
      };
      
      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      
      // Set as current user (auto-login after registration)
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user
      const foundUser = existingUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Update last login
      foundUser.lastLogin = new Date().toISOString();
      
      // Update users list
      const updatedUsers = existingUsers.map(u => 
        u.id === foundUser.id ? foundUser : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Set as current user
      setUser(foundUser);
      
      return { success: true, user: foundUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    
    // Update in users list
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 