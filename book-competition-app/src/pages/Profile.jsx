import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };

        const response = await axios.get(
          'http://127.0.0.1:8000/api/users/users/',
          config
        );
        
        if (!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
          throw new Error('No user data found');
        }
        
        setUserData(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        
        setError(err.response?.data?.message || err.message || 'Failed to fetch user data');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          Error loading profile: {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const getDisplayUser = () => {
    if (!userData) return null;
    if (Array.isArray(userData)) return userData[0] || null;
    return userData;
  };

  const displayUser = getDisplayUser();

  if (!displayUser) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
          No user data available
        </div>
      </div>
    );
  }

  const fullName = `${displayUser.first_name || ''} ${displayUser.last_name || ''}`.trim();
  const studentId = `ID: ${displayUser.username?.toUpperCase() || 'N/A'}`;

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 mb-8 md:flex-row md:items-start">
        <div className="w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-lg bg-gray-200 flex items-center justify-center">
          {displayUser.avatar ? (
            <img 
              src={displayUser.avatar} 
              alt={fullName || 'User avatar'}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-4xl text-gray-600">
              {displayUser.first_name?.charAt(0) || ''}{displayUser.last_name?.charAt(0) || ''}
            </span>
          )}
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{fullName || 'No name provided'}</h1>
          {displayUser.father_name && (
            <p className="mb-2 text-gray-600">Father's name: {displayUser.father_name}</p>
          )}
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            {displayUser.faculty && (
              <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
                {displayUser.faculty}
              </span>
            )}
            <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
              {studentId}
            </span>
            {displayUser.department && (
              <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
                {displayUser.department}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Overview Content */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Personal Information</h2>
        <div className="space-y-4">
          <InfoField label="Full Name" value={fullName || 'Not provided'} />
          <InfoField label="Email" value={displayUser.email || 'Not provided'} />
          <InfoField label="Username" value={displayUser.username || 'Not provided'} />
          {displayUser.father_name && (
            <InfoField label="Father's Name" value={displayUser.father_name} />
          )}
          {displayUser.faculty && <InfoField label="Faculty" value={displayUser.faculty} />}
          {displayUser.department && <InfoField label="Department" value={displayUser.department} />}
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center">
      <span className="w-32 text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}