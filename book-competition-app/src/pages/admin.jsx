import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('competitions');
  const [competitions, setCompetitions] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [selectedCommentUser, setSelectedCommentUser] = useState(null);

  // Competition form state
  const [competitionForm, setCompetitionForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  // Book form state
  const [bookForm, setBookForm] = useState({
    competition: '',
    title: '',
    file: null
  });

  // Fetch competitions
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/competitions/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCompetitions(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      setError('Failed to fetch competitions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/my-comments/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to fetch comments');
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // Handle competition form submission
  const handleCompetitionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');
      
      await axios.post('http://127.0.0.1:8000/api/competitions/', competitionForm, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Competition created successfully!');
      setCompetitionForm({ title: '', description: '', start_date: '', end_date: '' });
      fetchCompetitions(); // Refresh the list
    } catch (error) {
      console.error('Error creating competition:', error);
      setError('Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  // Handle book form submission
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('competition', bookForm.competition);
      formData.append('title', bookForm.title);
      formData.append('file', bookForm.file);

      await axios.post('http://127.0.0.1:8000/api/upload-book/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Book uploaded successfully!');
      setBookForm({ competition: '', title: '', file: null });
      fetchCompetitions(); // Refresh the list to show new book
    } catch (error) {
      console.error('Error uploading book:', error);
      setError('Failed to upload book');
    } finally {
      setLoading(false);
    }
  };

  // Delete competition
  const handleDeleteCompetition = async (id) => { 
    if (!window.confirm('Are you sure you want to delete this competition?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://127.0.0.1:8000/api/competitions/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Competition deleted successfully!');
      fetchCompetitions();
    } catch (error) {
      console.error('Error deleting competition:', error);
      setError('Failed to delete competition');
    }
  };

  // View competition details
  const handleViewCompetition = (competition) => {
    setSelectedCompetition(competition);
    setActiveTab('details');
  };

  // View comment details
  const handleViewComments = (commentUser) => {
    setSelectedCommentUser(commentUser);
    setActiveTab('commentDetails');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('competitions')}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
              activeTab === 'competitions'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Competitions
          </button>
          <button
            onClick={() => setActiveTab('addBook')}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
              activeTab === 'addBook'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Book
          </button>
          <button
            onClick={() => {
              setActiveTab('comments');
              fetchComments();
            }}
            className={`py-2 px-4 font-medium whitespace-nowrap ${
              activeTab === 'comments'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Comments
          </button>
          {selectedCompetition && (
            <button
              onClick={() => setActiveTab('details')}
              className={`py-2 px-4 font-medium whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Competition Details
            </button>
          )}
          {selectedCommentUser && (
            <button
              onClick={() => setActiveTab('commentDetails')}
              className={`py-2 px-4 font-medium whitespace-nowrap ${
                activeTab === 'commentDetails'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Comment Details
            </button>
          )}
        </div>

        {/* Notifications */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Competitions Tab */}
        {activeTab === 'competitions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Competition Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Create New Competition</h2>
              <form onSubmit={handleCompetitionSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={competitionForm.title}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    value={competitionForm.description}
                    onChange={(e) => setCompetitionForm({ ...competitionForm, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      required
                      value={competitionForm.start_date}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, start_date: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      required
                      value={competitionForm.end_date}
                      onChange={(e) => setCompetitionForm({ ...competitionForm, end_date: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Competition'}
                </button>
              </form>
            </div>

            {/* Competitions List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Competitions List</h2>
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : competitions.length === 0 ? (
                <div className="text-center text-gray-500">No competitions found</div>
              ) : (
                <div className="space-y-4">
                  {competitions.map((competition) => (
                    <div key={competition.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg">{competition.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{competition.description}</p>
                      <div className="text-xs text-gray-500 mb-2">
                        <p>Dates: {competition.start_date} to {competition.end_date}</p>
                        <p>Books: {competition.books.length}</p>
                        <p>Registrations: {competition.registrations.length}</p>
                        <p>Created by: {competition.full_name || 'Unknown'}</p>
                      </div>
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleViewCompetition(competition)}
                          className="text-indigo-600 text-sm hover:text-indigo-800"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeleteCompetition(competition.id)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Book Tab */}
        {activeTab === 'addBook' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Upload Book</h2>
            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Competition</label>
                <select
                  required
                  value={bookForm.competition}
                  onChange={(e) => setBookForm({ ...bookForm, competition: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a competition</option>
                  {competitions.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {comp.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Book Title</label>
                <input
                  type="text"
                  required
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Book File</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => setBookForm({ ...bookForm, file: e.target.files[0] })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload Book'}
              </button>
            </form>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">User Comments</h2>
              <button
                onClick={fetchComments}
                className="bg-indigo-600 text-white py-1 px-3 rounded-md hover:bg-indigo-700"
              >
                Refresh
              </button>
            </div>

            {commentsLoading ? (
              <div className="text-center">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center text-gray-500">No comments found</div>
            ) : (
              <div className="space-y-4">
                {comments.map((userComment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      User: {userComment.full_name?.trim() || `User ${userComment.id}`}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Total Comments: {userComment.comments?.length || 0}
                    </p>
                    <button
                      onClick={() => handleViewComments(userComment)}
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      View Comments
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Comment Details Tab */}
        {activeTab === 'commentDetails' && selectedCommentUser && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Comments by {selectedCommentUser.full_name?.trim() || `User ${selectedCommentUser.id}`}
              </h2>
              <button
                onClick={() => setActiveTab('comments')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← Back to Comments
              </button>
            </div>

            {selectedCommentUser.comments && selectedCommentUser.comments.length > 0 ? (
              <div className="space-y-4">
                {selectedCommentUser.comments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Type: {comment.type}</p>
                        <p className="text-sm text-gray-600">
                          Competition ID: {comment.competition}
                        </p>
                        <p className="text-sm text-gray-600">
                          Book: {comment.book?.title || 'N/A'}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md mt-2">
                      <p className="text-gray-800">{comment.text}</p>
                    </div>
                    {comment.book && (
                      <div className="mt-3">
                        <a
                          href={comment.book.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          Download Book
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No comments available for this user.</p>
            )}
          </div>
        )}

        {/* Competition Details Tab */}
        {activeTab === 'details' && selectedCompetition && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">{selectedCompetition.title}</h2>
              <button
                onClick={() => setActiveTab('competitions')}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ← Back to Competitions
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Competition Info */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Competition Information</h3>
                <div className="space-y-2">
                  <p><strong>Description:</strong> {selectedCompetition.description}</p>
                  <p><strong>Start Date:</strong> {selectedCompetition.start_date}</p>
                  <p><strong>End Date:</strong> {selectedCompetition.end_date}</p>
                  <p><strong>Created by:</strong> {selectedCompetition.full_name || 'Unknown'}</p>
                  <p><strong>Total Books:</strong> {selectedCompetition.books.length}</p>
                  <p><strong>Total Registrations:</strong> {selectedCompetition.registrations.length}</p>
                </div>
              </div>

              {/* Books Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Books ({selectedCompetition.books.length})</h3>
                {selectedCompetition.books.length === 0 ? (
                  <p className="text-gray-500">No books uploaded yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCompetition.books.map((book) => (
                      <div key={book.id} className="border border-gray-200 rounded p-3">
                        <p><strong>Title:</strong> {book.title}</p>
                        <p><strong>File:</strong> 
                          <a href={book.file} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-2">
                            Download
                          </a>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Registrations Section */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Registrations ({selectedCompetition.registrations.length})</h3>
              {selectedCompetition.registrations.length === 0 ? (
                <p className="text-gray-500">No registrations yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Student Card</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Group Number</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedCompetition.registrations.map((registration, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{registration.full_name}</td>
                          <td className="px-4 py-2 text-sm">{registration.student_cart}</td>
                          <td className="px-4 py-2 text-sm">{registration.group_number}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}