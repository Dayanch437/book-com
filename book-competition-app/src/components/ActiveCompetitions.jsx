import { useEffect, useState } from 'react';
import axios from 'axios';
import ActiveCompetitionCard from './ActiveCompetitionCard'; // Make sure to import this

// Mock data for development
const mockActiveRegistrations = [
  {
    id: 1,
    competition: {
      id: 101,
      title: "Summer Reading Challenge",
      description: "Read 5 books over the summer and win exciting prizes!",
      created_by: "library_admin",
      start_date: "2025-06-01",
      end_date: "2025-08-31",
      image_url: "/images/reading-challenge.jpg"
    },
    student_cart: "STU2023001",
    created_at: "2025-06-15T10:30:00Z",
    submission_status: "pending"
  },
  {
    id: 2,
    competition: {
      id: 102,
      title: "Poetry Writing Contest",
      description: "Submit your original poems for a chance to be published",
      created_by: "poetry_club",
      start_date: "2025-07-01",
      end_date: "2025-09-30",
      image_url: "/images/poetry-contest.jpg"
    },
    student_cart: "STU2023001",
    created_at: "2025-07-05T14:45:00Z",
    submission_status: "submitted"
  }
];

export default function ActiveCompetitions({ useMockData = false }) {
  const [activeRegistrations, setActiveRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
      try {
        let data;
        
        if (useMockData) {
          data = mockActiveRegistrations;
        } else {
          const response = await axios.get('/api/my-registrations');
          data = response.data;
        }
        
        setActiveRegistrations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching active competitions:', error);
        setError(error);
        if (useMockData) {
          setActiveRegistrations(mockActiveRegistrations);
        } else {
          setActiveRegistrations([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveCompetitions();
  }, [useMockData]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <div className="p-4 text-center rounded-lg bg-red-50">
        <p className="text-red-600">Error loading competitions. Showing mock data instead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Active Competitions</h2>
      
      {activeRegistrations.length === 0 ? (
        <div className="p-6 text-center rounded-lg bg-gray-50">
          <p className="text-gray-600">You haven't registered for any competitions yet.</p>
          <button className="px-4 py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Browse Competitions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeRegistrations.map((registration) => (
            <ActiveCompetitionCard 
              key={registration.id}
              competition={registration.competition}
              registrationDate={registration.created_at}
              status={registration.submission_status}
            />
          ))}
        </div>
      )}
    </div>
  );
}