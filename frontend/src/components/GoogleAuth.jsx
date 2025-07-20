import React from 'react'
import {useGoogleLogin,GoogleLogin} from '@react-oauth/google'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const GoogleAuth = () => {
    const navigate = useNavigate();
    const {login} = useAuth();

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await axios.post('https://todo-backend-3fo7.onrender.com/api/auth/social/google/', {
            id_token: credentialResponse.credential
            });

            if (res.status === 200) {
            const { access_token, refresh_token } = res.data;

            // Store refresh
            localStorage.setItem('refresh', refresh_token);

            // ✅ Fetch complete user profile with .id
            const profileRes = await axios.get('https://todo-backend-3fo7.onrender.com/api/auth/users/me/', {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            login(access_token, profileRes.data, true); // 👈 contains full name, email, id, etc.
            toast.success(`Welcome ${profileRes.data.first_name}`);
            navigate('/profile');
            }
        } catch (error) {
            console.error('Google login failed:', error.response?.data || error.message);
            const errorMsg =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Google login failed. Please try again.';
            toast.error(errorMsg);
        }
        };

  return (
    <div className="d-flex justify-content-center w-100 mb-3">
    <div style={{ width: '100%', maxWidth: '350px' }}>
        <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => toast.error('Google sign-in failed')}
        />
    </div>
    </div>
  )
}

export default GoogleAuth