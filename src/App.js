import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import MoodTrackingPage from './pages/MoodTrackingPage';
import MeditationPage from './pages/MeditationPage';
import CommunityPage from './pages/CommunityPage';
import SelfHelpPage from './pages/SelfHelpPage';
import MindGamesPage from './pages/MindGamesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { GameStatsProvider } from './context/GameStatsContext';
import useLenis from './hooks/useLenis';
import './App.css';

// Inner component that runs inside Router context
function AppContent() {
  // Initialize smooth scrolling - now inside Router context
  useLenis();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
        <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute>
              <ResourcesPage />
            </ProtectedRoute>
          } />
          <Route path="/mood-tracking" element={
            <ProtectedRoute>
              <MoodTrackingPage />
            </ProtectedRoute>
          } />
          <Route path="/meditation" element={
            <ProtectedRoute>
              <MeditationPage />
            </ProtectedRoute>
          } />
          <Route path="/community" element={
            <ProtectedRoute>
              <CommunityPage />
            </ProtectedRoute>
          } />
          <Route path="/self-help" element={
            <ProtectedRoute>
              <SelfHelpPage />
            </ProtectedRoute>
          } />
          <Route path="/mind-games" element={
            <ProtectedRoute>
              <MindGamesPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <GameStatsProvider>
        <Router>
          <AppContent />
        </Router>
      </GameStatsProvider>
    </AuthProvider>
  );
}

export default App;
