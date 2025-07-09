import React from 'react';
import './App.css';
import AuthWrapper from './components/auth/AuthWrapper';
import DashboardRouter from './components/dashboard/DashboardRouter';

function App() {
  return (
    <AuthWrapper>
      <DashboardRouter />
    </AuthWrapper>
  );
}

export default App;