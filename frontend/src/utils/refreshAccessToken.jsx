import axios from 'axios';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh') || sessionStorage.getItem('refresh');

  if (!refreshToken) {
    console.warn('No refresh token found');
    return null;
  }

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/auth/jwt/refresh/',
      { refresh: refreshToken },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const newAccessToken = response.data?.access;
    const newRefreshToken = response.data?.refresh;

    if (newAccessToken) {
      // Update access token
      if (localStorage.getItem('refresh')) {
        localStorage.setItem('access', newAccessToken);
      } else {
        sessionStorage.setItem('access', newAccessToken);
      }

      // ✅ Update refresh token too (important for rotation)
      if (newRefreshToken) {
        if (localStorage.getItem('refresh')) {
          localStorage.setItem('refresh', newRefreshToken);
        } else {
          sessionStorage.setItem('refresh', newRefreshToken);
        }
      }

      return newAccessToken;
    }
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
  }

  return null;
};
