import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/achievement/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setAchievements(response.data);
        setIsLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          setError(err.message || 'Failed to load achievements');
          setIsLoading(false);
        }
      }
    };

    fetchAchievements();
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
          Error: {error}
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

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">My Achievements</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.length > 0 ? (
          achievements.map((achievement) => (
            <div key={achievement.id} className="p-6 bg-white rounded-lg shadow">
              <h3 className="mb-2 text-xl font-semibold text-indigo-600">
                {achievement.name}
              </h3>
              <div className="flex items-center justify-between mt-4">
                <span className="px-3 py-1 text-sm text-white bg-indigo-500 rounded-full">
                  Achievement ID: {achievement.id}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 p-8 text-center">
            <p className="text-gray-500">No achievements yet. Keep working!</p>
          </div>
        )}
      </div>
    </div>
  );
}