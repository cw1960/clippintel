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
      title="ClippIntell"
      subtitle="Intelligent Opportunity Discovery"
      showFeatures={true}
    >
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
