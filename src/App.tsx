import React from 'react';
import './App.css';
import AuthWrapper from './components/auth/AuthWrapper';
import DashboardRouter from './components/dashboard/DashboardRouter';
import { initializeGeminiKeys } from './config/geminiKeys';

function App() {
  // Initialize Gemini API keys for bot detection
  React.useEffect(() => {
    initializeGeminiKeys();
  }, []);

  return (
    <AuthWrapper>
      <DashboardRouter />
    </AuthWrapper>
  );
}

export default App;