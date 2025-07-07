import React, { useState } from "react";
import { AuthLayout, LoginForm, SignupForm } from "../components/auth";

export const LoginPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log("Forgot password clicked");
  };

  return (
    <AuthLayout
      title="Clipp Intelligence"
      subtitle="Intelligent Opportunity Discovery for Whop Content Clippers"
      showFeatures={true}
    >
      <div style={{ marginBottom: 24 }}>
        <ul style={{ color: '#F1F0F1', fontSize: 16, margin: 0, padding: 0, listStyle: 'none' }}>
          <li>Automate your Whop content opportunity discovery</li>
          <li>AI-powered matching for content clippers</li>
          <li>Never miss a profitable opportunity again</li>
        </ul>
      </div>
      {isSignUp ? (
        <SignupForm onSignIn={handleToggleForm} redirectTo="/dashboard" />
      ) : (
        <LoginForm
          onSignUp={handleToggleForm}
          onForgotPassword={handleForgotPassword}
          redirectTo="/dashboard"
        />
      )}
    </AuthLayout>
  );
};

export default LoginPage;
