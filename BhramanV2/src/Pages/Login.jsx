import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (pass) =>
    pass.length >= 6;

  const setFieldError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === 'email') setEmail(value);
    else if (field === 'password') setPassword(value);
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const validateInput = () => {
    let valid = true;

    if (!email.trim()) {
      setFieldError('email', 'Email cannot be empty');
      valid = false;
    } else if (!isValidEmail(email)) {
      setFieldError('email', 'Invalid email format');
      valid = false;
    }

    if (!password) {
      setFieldError('password', 'Password cannot be empty');
      valid = false;
    } else if (!isStrongPassword(password)) {
      setFieldError('password', 'Password must be at least 6 characters');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    if (!validateInput()) return;

    try {
      const response = await fetch('http://localhost/samir/main.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          email,
          password,
          rememberMe: rememberMe ? '1' : '0'
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate('/');
      } else {
        if (data.error.includes('email')) setFieldError('email', data.error);
        else if (data.error.includes('password')) setFieldError('password', data.error);
        else setFieldError('general', data.error);
      }
    } catch (err) {
      setFieldError('general', 'Server error. Please try again.');
    }
  };

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
      <div className='flex w-9/12 h-9/12 rounded-lg shadow-xl overflow-hidden'>
        <div className='bg-mainRed shadow-lg flex text-white w-5/10 items-center justify-center text-2xl font-bold'>
          Logo
        </div>
        <div className="bg-white p-4 w-5/10 flex flex-col justify-center">
          <h2 className="text-xl font-semibold text-center mb-4">Login</h2>

          {errors.general && (
            <p className="text-red-500 text-center mb-4">{errors.general}</p>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <input
                type="email"
                id="Email"
                value={email}
                onChange={(e) => handleInputChange(e, 'email')}
                placeholder="Email Address"
                className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <input
                type="password"
                id="Password"
                value={password}
                onChange={(e) => handleInputChange(e, 'password')}
                placeholder="Password"
                className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-gray-700 text-sm">Remember Me</label>
            </div>

            <button type="submit" className="button bg-mainRed w-full text-white py-2 rounded">
              Login
            </button>
          </form>

          <p className="text-center mt-4 text-gray-500">
            Don't have an account? <button onClick={() => navigate("/signup")} className="text-blue-500">Click here to signup</button>
          </p>
        </div>
      </div>
    </div>
  );
}
