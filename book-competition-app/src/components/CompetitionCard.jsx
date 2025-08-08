import { useState } from 'react';

export default function CompetitionCard({ competition, onRegister }) {
  const [isLoading, setIsLoading] = useState(false);
  const [studentCard, setStudentCard] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onRegister({
        competition: competition.id,
        student_cart: studentCard
      });
      setShowForm(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden transition-shadow duration-300 bg-white shadow-md rounded-xl hover:shadow-xl">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <h3 className="mb-2 text-xl font-bold text-gray-800">{competition.title}</h3>
          <span className="px-2 py-1 text-xs text-indigo-800 bg-indigo-100 rounded-full">
            Active
          </span>
        </div>
        <p className="mb-4 text-gray-600 line-clamp-2">{competition.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Created by</p>
            <p className="font-medium">{competition.created_by}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ends in</p>
            <p className="font-medium">{new Date(competition.end_date).toLocaleDateString()}</p>
          </div>
        </div>

        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="w-full py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Register Now
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="studentCard" className="block mb-1 text-sm font-medium text-gray-700">
                Student Card Number
              </label>
              <input
                type="text"
                id="studentCard"
                value={studentCard}
                onChange={(e) => setStudentCard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
                placeholder="Enter your student card number"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-2 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center flex-1 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}