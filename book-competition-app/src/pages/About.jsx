export default function About() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">About Our Platform</h1>
        
        <div className="p-8 mb-8 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">Our Mission</h2>
          <p className="mb-6 text-gray-700">
            We're dedicated to helping students track their academic progress, showcase their 
            achievements, and connect with opportunities that help them grow.
          </p>
          
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">Features</h2>
          <ul className="space-y-3 list-disc list-inside">
            <li className="text-gray-700">Personalized profile dashboard</li>
            <li className="text-gray-700">Achievement tracking and verification</li>
            <li className="text-gray-700">Academic progress monitoring</li>
            <li className="text-gray-700">Secure data management</li>
          </ul>
        </div>

        <div className="p-8 mb-8 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">Developer Information</h2>
          <div className="space-y-4">
            <p className="text-gray-700">
              <span className="font-medium">Platform Developed by:</span> Dayanch Salarov
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Institution:</span> Oguz Han Engineering and Technology University of Turkmenistan
            </p>
          </div>
        </div>

        <div className="p-8 bg-white rounded-lg shadow">
          <h2 className="mb-4 text-2xl font-semibold text-indigo-600">Contact Us</h2>
          <p className="mb-4 text-gray-700">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Developer Email:</span> dayanchkemalovich@gmail.com
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Developer Phone:</span> +993 61 53 58 24
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}