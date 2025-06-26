import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    } else if (email !== 'test@example.com') {
      setFieldError('email', 'No user found with this email');
      valid = false;
    }

    if (!password) {
      setFieldError('password', 'Password cannot be empty');
      valid = false;
    } else if (!isStrongPassword(password)) {
      setFieldError('password', 'Password must be at least 6 characters');
      valid = false;
    } else if (email === 'test@example.com' && password !== 'password123') {
      setFieldError('password', 'Incorrect password');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = () => {
    setErrors({ email: '', password: '', general: '' });

    setTimeout(() => {
      if (validateInput()) {
        console.log('Login successful!');
        // handle success (e.g., redirect or show toast)
      }
    }, 100); // simulate async
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

          <button className="button bg-mainRed w-full text-white py-2 rounded" onClick={handleSubmit}>
            Login
          </button>

          <p className="text-center mt-4 text-gray-500">
            Don't have an account? <a href="#" className="text-blue-500">Click here to signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}
