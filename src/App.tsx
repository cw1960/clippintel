import React from 'react';
import './App.css';
import AccountAnalyzer from './components/AccountAnalyzer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AccountAnalyzer />
      </div>
    </div>
  );
}

export default App;