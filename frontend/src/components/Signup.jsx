import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';


const Signup = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [loading,setLoading] = useState(false)
  const formRef = useRef(null);

  const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent form submit on Enter
    const form = formRef.current;
    const inputs = Array.from(form.querySelectorAll('input'));
    const index = inputs.indexOf(e.target);
    if (index > -1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }
};


  useEffect(() => {
    const accessToken = localStorage.getItem('access');

    inputRef.current?.focus();
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          navigate('/profile');
        } else {
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    re_password: '',
  });
  const {email,first_name,last_name,password,re_password} = formData;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  const [errors, setErrors] = useState({
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      re_password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prevError)=>({...prevError,[e.target.name]: ''}))
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';

    if (!first_name.trim()) newErrors.first_name = 'First name is required';

    if (!last_name.trim()) newErrors.last_name = 'Last name is required';

    if (!password.trim()) newErrors.password = 'Password is required';
    else if (!passwordRegex.test(password)) newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';

    if (!re_password.trim()) newErrors.re_password = 'Confirm password is required';
    else if (password !== re_password) newErrors.re_password = 'Passwords do not match';

    return newErrors;
  };


  const check = () => {
    return (
      email.trim() &&
      first_name.trim() &&
      last_name.trim() &&
      password.trim() &&
      re_password.trim()
  );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true)
      const res = await axiosInstance.post('auth/users/', formData);

      if (res.status === 201) {
      toast.success('Registration successful! Please check your email to verify.');
      setErrors({});
      setLoading(false);
      setTimeout(() => {
      navigate('/verify-email', { state: { email: email } });
    }, 200); 
  }

    } catch (err) {
      if (err.response?.data) {
        const apiErrors = {};
        for (const key in err.response.data) {
          apiErrors[key] = Array.isArray(err.response.data[key])
            ? err.response.data[key][0]
            : err.response.data[key];
        }
        setErrors(apiErrors);
      } else {
        setErrors({ api: 'Registration failed. Please try again later.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <h2 className="mb-4 text-center">Sign Up</h2>

              {errors.api && <div className="alert alert-danger">{errors.api}</div>}

              <form onSubmit={handleSubmit} noValidate ref={formRef}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>First Name</label>
                  <input
                  onKeyDown={handleKeyDown}
                    type="text"
                    name="first_name"
                    className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                    value={first_name}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  {errors.first_name && (
                    <div className="invalid-feedback">{errors.first_name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    onKeyDown={handleKeyDown}
                    name="last_name"
                    className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                    value={last_name}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                  {errors.last_name && (
                    <div className="invalid-feedback">{errors.last_name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <input
                  onKeyDown={handleKeyDown}
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={handleChange}
                    placeholder="********"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    onKeyDown={handleKeyDown}
                    name="re_password"
                    className={`form-control ${
                      errors.re_password ? 'is-invalid' : ''
                    }`}
                    value={re_password}
                    onChange={handleChange}
                    placeholder="********"
                  />
                  {errors.re_password && (
                    <div className="invalid-feedback">{errors.re_password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !check()}
                >
                  {loading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <span
                      className="text-primary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate('/')}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;