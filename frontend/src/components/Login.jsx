import { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import GoogleAuth from './GoogleAuth';
import FacebookAuth from './FacebookAuth';
import { useAuth } from '../utils/AuthContext';
import axiosInstance from '../utils/axiosInstance';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const inputFocus = useRef(null);

  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    inputFocus.current.focus();
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated, navigate]);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleOnChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!loginData.email.trim()) newErrors.email = 'Email is required';
    if (!loginData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('auth/jwt/create/', loginData);
      const { access, refresh } = response.data;

      if (rememberMe) {
        localStorage.setItem('access', access);
        localStorage.setItem('refresh', refresh);
      } else {
        sessionStorage.setItem('access', access);
        sessionStorage.setItem('refresh', refresh);
      }

      login(access, null, rememberMe);
      toast.success('Login successful');
      navigate('/profile');
    } catch (error) {
      toast.error('Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input
                    ref={inputFocus}
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleOnChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleOnChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  <span
                    onClick={togglePassword}
                    style={{
                      position: 'absolute',
                      top: '38px',
                      right: '10px',
                      cursor: 'pointer',
                      color: '#6c757d',
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember Me
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="px-2 text-muted fw-medium">or</span>
                <hr className="flex-grow-1" />
              </div>

              <div className="d-flex flex-column align-items-center">
                <div className="w-100 mb-2">
                  <GoogleAuth />
                </div>
                <div className="w-100">
                  <FacebookAuth />
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/signup')}>
                    Register
                  </span>
                </p>
              </div>

              <div className="mt-2 text-center">
                <a href="/forgot-password" className="text-decoration-none">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
