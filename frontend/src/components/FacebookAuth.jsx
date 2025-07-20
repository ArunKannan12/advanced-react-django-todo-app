import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'react-bootstrap';
import { FaFacebook } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext'; // ✅ AuthContext
import axiosInstance from '../utils/axiosInstance';

const FacebookAuth = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login function from context

  useEffect(() => {
    const loadFacebookSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        initializeFacebook();
        return;
      }

      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log('✅ Facebook SDK loaded');
        initializeFacebook();
      };

      document.body.appendChild(script);
    };

    const initializeFacebook = () => {
      if (!window.FB) {
        console.error('❌ FB object not found');
        return;
      }

      try {
        window.FB.init({
          appId: '1270551067968843',
          cookie: true,
          xfbml: false,
          version: 'v18.0',
        });
        console.log('✅ FB.init done');
      } catch (error) {
        console.error('❌ FB.init error:', error);
      }
    };

    loadFacebookSDK();
  }, []);

  const handleLogin = () => {
    if (!window.FB) {
      console.error('❌ Facebook SDK not ready');
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api('/me', { fields: 'id,name,email' }, async (user) => {
            try {
              const res = await axiosInstance.post('auth/social/facebook/', {
                access_token: accessToken,
                user_id: user.id,
                email: user.email,
                name: user.name,
              });

              const { access_token, refresh_token } = res.data;

              // ✅ Save refresh token
              localStorage.setItem('refresh', refresh_token);

              // ✅ Get full user profile
              const profileRes = await axiosInstance.get('auth/users/me/', {
                headers: { Authorization: `Bearer ${access_token}` },
              });

              // ✅ Log in via context
              login(access_token, profileRes.data, true);

              toast.success(`Welcome ${profileRes.data.first_name}`);
              navigate('/profile');
            } catch (err) {
              console.error('❌ Backend login failed:', err.response?.data || err.message);
              console.table(err.response?.data); 

              const backendError = err.response?.data;

              let errorMessage = 'Facebook login failed. Please try again.';

              if (typeof backendError === 'string') {
                errorMessage = backendError;
              } else if (backendError?.error) {
                errorMessage = backendError.error;
              } else if (backendError?.detail) {
                errorMessage = backendError.detail;
              } else if (Array.isArray(backendError)) {
                errorMessage = backendError[0];
              }

              toast.error(`❌ ${errorMessage}`);
            }
          });
        } else {
          console.warn('❌ Facebook login cancelled');
          toast.warning('Facebook login cancelled');
        }
      },
      { scope: 'public_profile,email' }
    );
  };

  return (
    <Button
      variant="primary"
      onClick={handleLogin}
      className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3 px-3 py-2"
      style={{
        backgroundColor: '#1877F2',
        borderColor: '#1877F2',
        fontSize: '1rem',
        whiteSpace: 'nowrap',
      }}
    >
      <FaFacebook size={20} />
      <span className="d-none d-sm-inline">Continue with Facebook</span>
      <span className="d-inline d-sm-none">Login</span>
    </Button>

  );
};

export default FacebookAuth;
