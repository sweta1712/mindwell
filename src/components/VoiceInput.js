import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from 'lucide-react';

const VoiceInput = ({ 
  onTextResult, 
  placeholder = "Click microphone to speak...", 
  autoSubmit = false,
  supportedPhrases = []
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const animationRef = useRef(null);
  const volumeMeterRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
        startVolumeMonitoring();
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        // Auto-process mood-related phrases
        if (finalTranscript) {
          processMoodPhrase(finalTranscript);
          
          if (autoSubmit) {
            onTextResult(finalTranscript);
            setTranscript('');
          }
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
        stopVolumeMonitoring();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        stopVolumeMonitoring();
      };
      
      setIsSupported(true);
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopVolumeMonitoring();
    };
  }, []);

  const startVolumeMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        setVolume(average);
        
        if (isListening) {
          animationRef.current = requestAnimationFrame(updateVolume);
        }
      };
      
      updateVolume();
      volumeMeterRef.current = { stream, audioContext };
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopVolumeMonitoring = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (volumeMeterRef.current) {
      volumeMeterRef.current.stream.getTracks().forEach(track => track.stop());
      volumeMeterRef.current.audioContext.close();
    }
    setVolume(0);
  };

  const processMoodPhrase = (text) => {
    const lowerText = text.toLowerCase();
    
    // Mood detection patterns
    const moodPatterns = {
      1: ['terrible', 'awful', 'horrible', 'very bad', 'extremely sad', 'depressed'],
      2: ['bad', 'not good', 'sad', 'down', 'upset', 'frustrated'],
      3: ['okay', 'alright', 'average', 'neutral', 'fine', 'so-so'],
      4: ['good', 'well', 'happy', 'positive', 'better', 'nice'],
      5: ['great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'perfect']
    };
    
    // Check for mood expressions
    for (const [mood, patterns] of Object.entries(moodPatterns)) {
      for (const pattern of patterns) {
        if (lowerText.includes(`feeling ${pattern}`) || 
            lowerText.includes(`i'm ${pattern}`) ||
            lowerText.includes(`i am ${pattern}`) ||
            lowerText.includes(`mood is ${pattern}`)) {
          
          // Provide audio feedback
          speak(`I understand you're feeling ${pattern}. Let me log that for you.`);
          
          // Auto-fill mood if callback provided
          if (onTextResult) {
            onTextResult({
              type: 'mood',
              mood: parseInt(mood),
              text: text,
              confidence: confidence
            });
          }
          return;
        }
      }
    }
    
    // Check for help requests
    if (lowerText.includes('help') || lowerText.includes('support') || lowerText.includes('crisis')) {
      speak('I detected you might need help. Let me show you crisis resources.');
      if (onTextResult) {
        onTextResult({
          type: 'crisis',
          text: text,
          urgency: 'high'
        });
      }
    }
  };

  const speak = (text, rate = 1, pitch = 1) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel(); // Stop any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    setTranscript('');
    setError('');
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    if (transcript.trim() && onTextResult) {
      onTextResult(transcript.trim());
      setTranscript('');
    }
  };

  const handleClear = () => {
    setTranscript('');
    setError('');
  };

  const getVolumeColor = (volume) => {
    if (volume < 10) return '#6b7280';
    if (volume < 30) return '#eab308';
    if (volume < 60) return '#f97316';
    return '#ef4444';
  };

  if (!isSupported) {
    return (
      <div className="voice-input-unsupported">
        <Mic className="w-6 h-6 text-gray-400" />
        <span className="text-sm text-gray-500">Voice input not supported</span>
      </div>
    );
  }

  return (
    <div className="voice-input-container">
      {/* Main Voice Button */}
      <div className="voice-main-section">
        <motion.button
          className={`voice-button ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="listening"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="voice-icon-container"
              >
                <Mic className="w-6 h-6" />
                {/* Volume visualization */}
                <motion.div 
                  className="volume-ring"
                  animate={{ 
                    scale: 1 + (volume / 100),
                    opacity: 0.6 + (volume / 200)
                  }}
                  style={{ 
                    borderColor: getVolumeColor(volume)
                  }}
                />
              </motion.div>
            ) : isSpeaking ? (
              <motion.div
                key="speaking"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Volume2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <MicOff className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="voice-status">
          {isListening && (
            <motion.div 
              className="listening-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="listening-dots">
                <motion.div 
                  className="dot"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div 
                  className="dot"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div 
                  className="dot"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
              <span className="listening-text">Listening...</span>
            </motion.div>
          )}
          
          {isSpeaking && (
            <motion.div 
              className="speaking-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Volume2 className="w-4 h-4" />
              <span>Speaking...</span>
            </motion.div>
          )}
          
          {!isListening && !isSpeaking && (
            <span className="voice-prompt">
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div 
            className="transcript-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="transcript-content">
              <h4 className="transcript-title">What you said:</h4>
              <p className="transcript-text">"{transcript}"</p>
              {confidence > 0 && (
                <div className="confidence-indicator">
                  <span className="confidence-label">Confidence:</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${confidence * 100}%` }}
                    />
                  </div>
                  <span className="confidence-value">{Math.round(confidence * 100)}%</span>
                </div>
              )}
            </div>
            
            {!autoSubmit && (
              <div className="transcript-actions">
                <button 
                  onClick={handleSubmit}
                  className="transcript-submit"
                  disabled={!transcript.trim()}
                >
                  Use This Text
                </button>
                <button 
                  onClick={handleClear}
                  className="transcript-clear"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div 
            className="voice-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <span className="error-text">{error}</span>
            <button 
              onClick={() => setError('')}
              className="error-dismiss"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help */}
      <div className="voice-help">
        <h5 className="voice-help-title">Voice Commands:</h5>
        <ul className="voice-help-list">
          <li>"I'm feeling great today" - Auto-detects mood</li>
          <li>"I need help" - Shows crisis resources</li>
          <li>"Start meditation" - Begins meditation session</li>
          <li>"My mood is..." - Logs mood entry</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceInput; 