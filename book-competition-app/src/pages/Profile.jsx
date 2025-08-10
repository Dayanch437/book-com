import { useEffect, useState } from 'react';

const mockUserData = {
  id: 'user_123',
  name: 'Dayan Chaves',
  email: 'dayanch@example.com',
  studentId: 'STU2023001',
  department: 'Computer Science',
  joinDate: '2023-01-15',
  avatar: '/images/avatar.jpg',
  bio: 'Book enthusiast and competition participant',
  stats: {
    competitionsJoined: 5,
    competitionsWon: 2,
    submissions: 8
  }
};

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'competitions'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In production: const response = await axios.get('/api/profile');
        // setUserData(response.data);
        
        // Using mock data for now
        setTimeout(() => {
          setUserData(mockUserData);
          setIsLoading(false);
        }, 800); // Simulate network delay
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 mb-8 md:flex-row md:items-start">
        <div className="w-32 h-32 overflow-hidden border-4 border-white rounded-full shadow-lg">
          <img 
            src={userData.avatar} 
            alt={userData.name}
            className="object-cover w-full h-full"
          />
        </div>
        
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
          <p className="mb-2 text-gray-600">{userData.bio}</p>
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
              {userData.department}
            </span>
            <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
              ID: {userData.studentId}
            </span>
            <span className="px-3 py-1 text-sm text-gray-800 bg-gray-100 rounded-full">
              Member since {new Date(userData.joinDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
        <StatCard 
          title="Competitions Joined" 
          value={userData.stats.competitionsJoined}
          icon="🏆"
        />
        <StatCard 
          title="Competitions Won" 
          value={userData.stats.competitionsWon}
          icon="🎉"
        />
        <StatCard 
          title="Submissions" 
          value={userData.stats.submissions}
          icon="📚"
        />
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 font-medium text-sm ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm ${activeTab === 'competitions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('competitions')}
          >
            My Competitions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Personal Information</h2>
          <div className="space-y-4">
            <InfoField label="Full Name" value={userData.name} />
            <InfoField label="Email" value={userData.email} />
            <InfoField label="Student ID" value={userData.studentId} />
            <InfoField label="Department" value={userData.department} />
            <InfoField 
              label="Member Since" 
              value={new Date(userData.joinDate).toLocaleDateString()} 
            />
          </div>
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-800">My Active Competitions</h2>
          <p className="text-gray-600">Your registered competitions will appear here.</p>
          {/* You can reuse your ActiveCompetitions component here */}
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      <div className="mr-4 text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
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