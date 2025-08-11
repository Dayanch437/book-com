import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader, FiAlertCircle, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';

// Lazy load the CompetitionList
const CompetitionList = lazy(() => import('../components/CompetitionLIst'));

async function verifyToken(token) {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/token/verify/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export default function Dashboard() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    competitionId: null,
    studentCart: ''
  });
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState({ success: false, message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/');
          return;
        }

        const isTokenValid = await verifyToken(token);
        if (!isTokenValid) {
          localStorage.removeItem('accessToken');
          navigate('/');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/api/competitions-student/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('accessToken');
            navigate('/login');
            return;
          }
          throw new Error(`Failed to load competitions: ${response.status}`);
        }

        const data = await response.json();
        setCompetitions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRegisterClick = (competitionId) => {
    setRegistrationData({ ...registrationData, competitionId });
    setShowRegistrationForm(true);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegistrationStatus({ success: false, message: '' });

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication required');

      const isTokenValid = await verifyToken(token);
      if (!isTokenValid) {
        localStorage.removeItem('accessToken');
        navigate('/login');
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/competition/register/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          competition: registrationData.competitionId,
          student_cart: registrationData.studentCart
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Registration failed');
      }

      setRegistrationStatus({ success: true, message: 'Registration successful!' });
      setTimeout(() => {
        setShowRegistrationForm(false);
        setRegistrationData({ competitionId: null, studentCart: '' });
        window.location.reload(); // Refresh to update registration status
      }, 2000);

    } catch (err) {
      setRegistrationStatus({ success: false, message: err.message || 'Failed to register for competition' });
    } finally {
      setLoading(false);
    }
  };

  if (showRegistrationForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 py-8 mx-auto max-w-md">
          <button 
            onClick={() => setShowRegistrationForm(false)}
            className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Competitions
          </button>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Competition Registration</h2>
            
            {registrationStatus.message && !registrationStatus.success && (
              <div className="flex items-center p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
                <FiAlertCircle className="mr-2 flex-shrink-0" />
                <span>{registrationStatus.message}</span>
              </div>
            )}

            {registrationStatus.success && (
              <div className="flex items-center p-3 mb-4 text-sm text-green-600 bg-green-50 rounded-lg">
                <FiCheckCircle className="mr-2 flex-shrink-0" />
                <span>{registrationStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div>
                <label htmlFor="studentCart" className="block mb-2 text-sm font-medium text-gray-700">
                  Student ID Card Number
                </label>
                <input
                  id="studentCart"
                  type="text"
                  value={registrationData.studentCart}
                  onChange={(e) => setRegistrationData({...registrationData, studentCart: e.target.value})}
                  placeholder="Enter your student ID card number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <FiLoader className="w-4 h-4 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Available Competitions</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FiLoader className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="mt-2 text-gray-600">Loading competitions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-500">
            <FiAlertCircle className="w-8 h-8" />
            <p className="mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <Suspense fallback={<div className="flex justify-center py-12">Loading competitions...</div>}>
            <CompetitionList 
              competitions={competitions} 
              onRegister={handleRegisterClick} 
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
