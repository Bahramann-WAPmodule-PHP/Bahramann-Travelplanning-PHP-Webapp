import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    general: ''
  });

  const [userExists, setUserExists] = useState(false);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    switch (field) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'emailAddress':
        setEmailAddress(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (pass) =>
    pass.length >= 6;

  const setFieldError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

const validateInput = () => {
  let valid = true;

  if (!firstName.trim()) {
    setFieldError('firstName', 'First Name cannot be empty');
    valid = false;
  }
  if (!lastName.trim()) {
    setFieldError('lastName', 'Last Name cannot be empty');
    valid = false;
  }
  if (!emailAddress.trim()) {
    setFieldError('emailAddress', 'Email cannot be empty');
    valid = false;
  } else if (!isValidEmail(emailAddress)) {
    setFieldError('emailAddress', 'Invalid email format');
    valid = false;
  } else if (emailAddress === "test@example.com") {
    setFieldError('emailAddress', 'User already exists with this email');
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



const handleSubmit = async () => {
  setErrors({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    general: ''
  });

  if (!validateInput()) return;

  try {
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('emailAddress', emailAddress);
    formData.append('password', password);

    const response = await fetch('http://localhost/Bhramanapp/Backend/server/signup.php', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Signup successful → redirect to login with success message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.',
          messageType: 'success' 
        }
      });
    } else {
      // Show server-side error
      if (data.errors) {
        // Handle multiple validation errors from backend
        for (const [field, message] of Object.entries(data.errors)) {
          setFieldError(field === 'email' ? 'emailAddress' : field, message);
        }
      } else {
        // Show general error
        setErrors(prev => ({ ...prev, general: data.error || 'Signup failed' }));
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    setErrors(prev => ({ ...prev, general: 'Network error occurred' }));
  }
};



 

  return (
    <div className='w-screen h-screen flex items-center justify-center bg-gray-100'>
      <div className='flex w-9/12 h-9/12 rounded-lg shadow-xl overflow-hidden'>
        <div className='bg-mainRed shadow-lg flex text-white w-5/10 items-center justify-center text-2xl font-bold'>
          Logo
        </div>
        <div className="bg-white p-4 w-5/10 flex flex-col justify-center">
                  <h2 className="text-xl font-semibold text-center mb-4">Signup</h2>
          {errors.general && (
            <p className="text-red-500 text-center mb-4">{errors.general}</p>
          )}
          <div className="mb-6">
            <input
              type="text"
              id="FirstName"
              value={firstName}
              onChange={(e) => handleInputChange(e, 'firstName')}
              placeholder="First Name"
              className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          <div className="mb-6">
            <input
              type="text"
              id="LastName"
              value={lastName}
              onChange={(e) => handleInputChange(e, 'lastName')}
              placeholder="Last Name"
              className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
          <div className="mb-6">
            <input
              type="email"
              id="EmailAddress"
              value={emailAddress}
              onChange={(e) => handleInputChange(e, 'emailAddress')}
              placeholder="Email Address"
              className={`w-full border ${errors.emailAddress ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 focus:outline-none`}
            />
            {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
          </div>
          <div className="mb-6">
            <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => handleInputChange(e, 'password')}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-mainRed'
                }`}
              placeholder="Enter your password"
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
            />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}
          <button className="button bg-mainRed w-full" onClick={handleSubmit}>Signup</button>
          <p className="text-center mt-4 text-gray-500">
            Already have an account? <button  className="text-blue-500" onClick={()=>navigate('/login')}>click here to login </button>
          </p>
        </div>
      </div>
    </div>
  )
}
