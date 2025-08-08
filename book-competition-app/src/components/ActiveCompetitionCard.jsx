// src/components/ActiveCompetitionCard.jsx
export default function ActiveCompetitionCard({ competition, registrationDate }) {
  return (
    <div className="overflow-hidden bg-white border-l-4 border-indigo-500 shadow-md rounded-xl">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{competition.title}</h3>
          <span className="px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
            Registered
          </span>
        </div>
        
        <p className="mb-4 text-gray-600 line-clamp-2">{competition.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>
            <span className="font-medium">{new Date(competition.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>
            <span className="font-medium">{new Date(competition.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Registered On:</span>
            <span className="font-medium">{new Date(registrationDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex mt-6 space-x-2">
          <button className="flex-1 py-2 text-indigo-600 transition border border-indigo-600 rounded-lg hover:bg-indigo-50">
            View Details
          </button>
          <button className="flex-1 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700">
            Submit Work
          </button>
        </div>
      </div>
    </div>
  );
}