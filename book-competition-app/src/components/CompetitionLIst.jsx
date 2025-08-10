import { useNavigate } from 'react-router-dom';
import { FiBook } from 'react-icons/fi';

function CompetitionList({ competitions, onRegister }) {
  const navigate = useNavigate();

  const handleCardClick = (competition, e) => {
    // Only navigate if registered and not clicking the register button
    if (competition.is_registered && !e.target.closest('button')) {
      navigate(`/competitions/${competition.id}`);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map(competition => (
        <div 
          key={competition.id} 
          className={`p-6 bg-white rounded-lg shadow-md ${
            competition.is_registered 
              ? 'cursor-pointer hover:shadow-lg transition-shadow' 
              : ''
          }`}
          onClick={(e) => handleCardClick(competition, e)}
        >
          <h3 className="text-lg font-semibold text-gray-800">{competition.title}</h3>
          <p className="mt-2 text-gray-600">{competition.description}</p>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Organizer: {competition.full_name || 'Unknown'}</p>
            <p>Dates: {new Date(competition.start_date).toLocaleDateString()} - {new Date(competition.end_date).toLocaleDateString()}</p>
          </div>
          
          {competition.books.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Required Books:</h4>
              <ul className="space-y-1">
                {competition.books.map(book => (
                  <li key={book.id} className="flex items-center">
                    <FiBook className="mr-2 text-indigo-500" />
                    <span>{book.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {competition.is_registered ? (
            <>
              <div className="w-full mt-4 px-4 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg">
                Registered
              </div>
              <div className="mt-2 text-sm text-center text-indigo-600">
                Click anywhere to view details
              </div>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegister(competition.id);
              }}
              className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Register
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompetitionList;