// src/pages/Dashboard.jsx
import { useState } from 'react';
import CompetitionList from '../components/CompetitionList';
import ActiveCompetitions from '../components/ActiveCompetitions';

// Define mock data inside the component file
const mockCompetitions = [
  {
    id: 1,
    title: "Summer Reading Challenge",
    description: "Read 5 books over the summer and win exciting prizes!",
    created_by: "dayanch",
    start_date: "2025-06-01",
    end_date: "2025-08-31"
  },
  {
    id: 2,
    title: "Poetry Contest",
    description: "Submit your original poems for a chance to be published in our annual anthology.",
    created_by: "booklover42",
    start_date: "2025-08-01",
    end_date: "2025-09-15"
  },
  {
    id: 3,
    title: "Classic Literature Review",
    description: "Write reviews of classic literature for scholarship opportunities.",
    created_by: "literature_prof",
    start_date: "2025-07-15",
    end_date: "2025-10-01"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'

  return (
    <div className="min-h-screen bg-gray-50">
     
      
      <div className="container px-4 py-8 mx-auto">
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('all')}
          >
            All Competitions
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'my' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('my')}
          >
            My Competitions
          </button>
        </div>

        {activeTab === 'all' ? (
          <CompetitionList competitions={mockCompetitions} />
        ) : (
          <ActiveCompetitions />
        )}
      </div>
    </div>
  );
}