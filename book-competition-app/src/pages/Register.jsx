import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../config';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    father_name: '',
    department: 0,
    faculty: 0
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch faculties on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      try {     
        const response = await fetch(`${API_BASE_URL}/api/users/faculty/`);
        if (!response.ok) throw new Error('Failed to fetch faculties');
        const data = await response.json();
        setFaculties(data);
      } catch (err) {
        setErrors({general: err.message});
      }
    };
    fetchFaculties();
  }, []);

  // Fetch departments when faculty changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.faculty > 0) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/departments/?faculty=${formData.faculty}`);
          if (!response.ok) throw new Error('Failed to fetch departments');
          const data = await response.json();
          setDepartments(data);
        } catch (err) {
          setErrors({general: err.message});
        }
      } else {
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, [formData.faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess('');

    try {
      // Frontend validation
      const newErrors = {};
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.faculty || formData.faculty === '0') {
        newErrors.faculty = 'Please select a faculty';
      }
      
      if (!formData.department || formData.department === '0') {
        newErrors.department = 'Please select a department';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        return;
      }

      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...apiData } = formData;

      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors in the format {"field": ["error1", "error2"]}
        if (typeof data === 'object' && data !== null) {
          const backendErrors = {};
          Object.entries(data).forEach(([field, messages]) => {
            // Join array of messages into a single string
            backendErrors[field] = Array.isArray(messages) ? messages.join(' ') : messages;
          });
          setErrors(backendErrors);
        } else if (data.message) {
          setErrors({general: data.message});
        } else if (data.detail) {
          setErrors({general: data.detail});
        } else {
          setErrors({general: 'Registration failed. Please try again.'});
        }
        return;
      }

      setSuccess(data.message || 'Registration successful!');
      setTimeout(() => navigate('/'), 3000);
      
    } catch (err) {
      setErrors({general: err.message || 'An unexpected error occurred'});
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to render error messages for a field
  const renderError = (fieldName) => {
    if (!errors[fieldName]) return null;
    return (
      <p className="mt-1 text-sm text-red-600">
        <FiAlertCircle className="inline mr-1" />
        {errors[fieldName]}
      </p>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 mx-4 space-y-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600 mt-1">Get started with your account</p>
        </div>

        {errors.general && (
          <div className="flex items-center p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center p-3 text-sm text-green-600 bg-green-50 rounded-lg">
            <FiCheckCircle className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1.5 text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
                className={`w-full pl-10 pr-3 py-2.5 text-sm border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
            </div>
            {renderError('username')}
          </div>

          <div>
            <label htmlFor="email" className="block mb-1.5 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-3 py-2.5 text-sm border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                required
              />
            </div>
            {renderError('email')}
          </div>

          <div>
            <label htmlFor="password" className="block mb-1.5 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3 py-2.5 text-sm border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                required
                minLength="6"
              />
            </div>
            {renderError('password')}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1.5 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-10 pr-3 py-2.5 text-sm border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
                required
                minLength="6"
              />
            </div>
            {renderError('confirmPassword')}
          </div>

          <div>
            <label htmlFor="first_name" className="block mb-1.5 text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First name"
              className={`w-full px-3 py-2.5 text-sm border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {renderError('first_name')}
          </div>

          <div>
            <label htmlFor="last_name" className="block mb-1.5 text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last name"
              className={`w-full px-3 py-2.5 text-sm border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {renderError('last_name')}
          </div>

          <div>
            <label htmlFor="father_name" className="block mb-1.5 text-sm font-medium text-gray-700">
              Father's Name
            </label>
            <input
              id="father_name"
              name="father_name"
              type="text"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Father's name"
              className={`w-full px-3 py-2.5 text-sm border ${errors.father_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              required
            />
            {renderError('father_name')}
          </div>

          <div>
            <label htmlFor="faculty" className="block mb-1.5 text-sm font-medium text-gray-700">
              Faculty
            </label>
            <select
              id="faculty"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border ${errors.faculty ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              required
            >
              <option value="0">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
            {renderError('faculty')}
          </div>

          <div>
            <label htmlFor="department" className="block mb-1.5 text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-3 py-2.5 text-sm border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`}
              required
              disabled={!formData.faculty || departments.length === 0}
            >
              <option value="0">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {renderError('department')}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 transition flex justify-center items-center disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="pt-4 mt-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to="/" 
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}