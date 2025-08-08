import CompetitionCard from './CompetitionCard';

export default function CompetitionList({ competitions }) {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-8 text-3xl font-bold text-gray-800">Current Competitions</h2>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {competitions.map(competition => (
          <CompetitionCard 
            key={competition.id} 
            competition={competition}
            onRegister={() => console.log('Register for:', competition.id)}
          />
        ))}
      </div>
    </div>
  );
}