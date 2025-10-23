import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import apiService from '../services/api';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (loginData) => {
    setIsLoading(true);
    console.log('Login attempt:', loginData);
    
    try {
      const response = await apiService.login({
        email: loginData.email,
        password: loginData.password
      });

      if (response.success) {
        if (onAuthSuccess) {
          onAuthSuccess({
            type: 'login',
            user: {
              ...response.user,
              name: response.user.firstName && response.user.lastName 
                ? `${response.user.firstName} ${response.user.lastName}` 
                : response.user.name || response.user.email
            }
          });
        }
      } else {
        alert(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (signupData) => {
    setIsLoading(true);
    console.log('Signup attempt:', signupData);
    
    try {
      const response = await apiService.register({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password
      });

      if (response.success) {
        if (onAuthSuccess) {
          onAuthSuccess({
            type: 'signup',
            user: {
              ...response.user,
              name: response.user.firstName && response.user.lastName 
                ? `${response.user.firstName} ${response.user.lastName}` 
                : response.user.name || response.user.email
            }
          });
        }
      } else {
        alert(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse || {};
      if (!credential) {
        alert('Google sign-in failed.');
        return;
      }
      
      // Decode JWT credential (header.payload.signature)
      const parts = credential.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      
      const response = await apiService.googleAuth({
        email: payload.email,
        googleId: payload.sub,
        firstName: payload.given_name || '',
        lastName: payload.family_name || ''
      });

      if (response.success) {
        if (onAuthSuccess) {
          onAuthSuccess({
            type: 'login',
            user: {
              ...response.user,
              name: response.user.firstName && response.user.lastName 
                ? `${response.user.firstName} ${response.user.lastName}` 
                : response.user.name || response.user.email
            }
          });
        }
      } else {
        alert(response.message || 'Google sign-in failed');
      }
    } catch (err) {
      console.error('Google credential handling error:', err);
      alert('An error occurred with Google sign-in. Please try again.');
    }
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${isLogin ? 'login' : 'signup'}`}>
        {isLogin ? (
          <Login 
            onSwitchToSignup={switchToSignup}
            onLogin={handleLogin}
            onGoogleCredential={handleGoogleCredential}
          />
        ) : (
          <Signup 
            onSwitchToLogin={switchToLogin}
            onSignup={handleSignup}
            onGoogleCredential={handleGoogleCredential}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;


