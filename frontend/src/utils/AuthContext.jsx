import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { refreshAccessToken } from "./refreshAccessToken";
import useAutoLogout from "./useAutoLogout";
import Modal from "./Modal";

export const AuthContext = createContext({
  accessToken : null,
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { modalOpen, onConfirm, onClose } = useAutoLogout();

  useEffect(() => {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true' || sessionStorage.getItem('isLoggedIn') === 'true'


    if (token &&  isLoggedIn) {
      setAccessToken(token);
      setIsAuthenticated(true);
      fetchProfile(token);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

    const login = (token, userData = null, remember = false) => {
    if (remember) {
      localStorage.setItem('access', token);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      sessionStorage.setItem('access', token);
      sessionStorage.setItem('isLoggedIn', 'true');
    }

    setAccessToken(token);
    setIsAuthenticated(true);

    if (userData) {
      setUser(userData);
      setLoading(false);
    } else {
      fetchProfile(token);
    }
  };


    const logout = async () => {
      try {
        await axiosInstance.post("auth/jwt/logout/", {
          refresh: localStorage.getItem("refresh") || sessionStorage.getItem("refresh"),
        });
      } catch (error) {
        console.warn("Logout failed on backend (may already be expired):", error.response?.data || error.message);
      } finally {
        // Always clear client state regardless of backend response
        localStorage.clear();
        sessionStorage.clear();
        setAccessToken(null);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    };



  const fetchProfile = async (access = accessToken) => {
    try {
      const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");

      if (!access || !refresh) {
        logout();
        return;
      }

      const decoded = jwtDecode(access);
      const isExpired = dayjs.unix(decoded.exp).diff(dayjs()) < 0;

      if (isExpired) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) {
          logout();
          return;
        }

        access = newAccess;
        setAccessToken(newAccess);

        if (localStorage.getItem('refresh')) {
          localStorage.setItem('access', newAccess);
        } else {
          sessionStorage.setItem('access', newAccess);
        }
      }

      const res = await axiosInstance.get('auth/users/me/');
           
      setUser(res.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Profile fetch failed:", error);
      setIsAuthenticated(false);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isAuthenticated, loading, login, logout, setUser }}>
      {children}
      <Modal
        isOpen={modalOpen}
        title="Session expiring"
        message="You will be logged out due to inactivity. Do you want to stay logged in?"
        onConfirm={onConfirm}
        onClose={onClose}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);