import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { 
  FiCalendar, 
  FiUser, 
  FiBook, 
  FiDownload, 
  FiCheckCircle, 
  FiArrowLeft,
  FiMessageSquare 
} from 'react-icons/fi';

export default function CompetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState({
    id: 0,
    title: '',
    books: [],
    description: '',
    created_by: 0,
    full_name: '',
    start_date: '',
    end_date: '',
    is_registered: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [studentCart, setStudentCart] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const getAuthToken = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = getAuthToken();
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/api/competitions-student/${id}/`,          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        const apiData = response.data;
        setCompetition({
          id: apiData.id || 0,
          title: apiData.title || '',
          books: apiData.books || [],
          description: apiData.description || '',
          created_by: apiData.created_by || 0,
          full_name: apiData.full_name || '',
          start_date: apiData.start_date || '',
          end_date: apiData.end_date || '',
          is_registered: apiData.is_registered === "true" || apiData.is_registered === true
        });

      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('accessToken');
          navigate('/login');
        } else {
          setError(err.response?.data?.detail || err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetition();
  }, [id, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsCommentLoading(true);
        setCommentError(null);
        const token = getAuthToken();
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/api/student-comments/?competition=${id}/`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );

        setComments(response.data || []);
      } catch (err) {
        setCommentError(err.response?.data?.detail || err.message);
      } finally {
        setIsCommentLoading(false);
      }
    };

    fetchComments();
  }, [id]);

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);
      setRegistrationStatus(null);
      const token = getAuthToken();
      if (!token) return;

      await axios.post(
        `${API_BASE_URL}/api/competitions-student/`,          
        {
          competition: id,
          student_cart: studentCart
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setRegistrationStatus({ 
        success: true, 
        message: 'Registration successful!' 
      });
      setCompetition(prev => ({ 
        ...prev, 
        is_registered: true 
      }));

    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setRegistrationStatus({
          success: false,
          message: err.response?.data?.detail || 'Registration failed. Please try again.'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsCommentLoading(true);
      setCommentError(null);
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.post(
        `${API_BASE_URL}/api/student-comments/`,          
        {
          competition: id,
          comment: newComment
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setCommentError(err.response?.data?.detail || 'Failed to post comment');
    } finally {
      setIsCommentLoading(false);
    }
  };

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
          Error: {error}
        </div>
        <button 
          onClick={() => navigate('/competitions')}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Back to Competitions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate('/competitions')}
        className="flex items-center mb-6 text-indigo-600 hover:text-indigo-800"
      >
        <FiArrowLeft className="mr-2" />
        Back to Competitions
      </button>

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {competition.title || 'No title available'}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>Created by {competition.full_name || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>
                  {competition.start_date ? new Date(competition.start_date).toLocaleDateString() : 'N/A'} - 
                  {competition.end_date ? new Date(competition.end_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
          
          {competition.is_registered && (
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              <FiCheckCircle className="mr-1" />
              Registered
            </div>
          )}
        </div>
        
        <p className="text-gray-700 whitespace-pre-line">
          {competition.description || 'No description available'}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FiBook className="mr-2" />
          Required Books
        </h2>
        
        {competition.books.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {competition.books.map(book => (
                <li key={book.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {book.title || 'Untitled Book'}
                      </h3>
                    </div>
                    {book.file && (
                      <button
                        onClick={() => handleDownload(book.file)}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 flex items-center"
                      >
                        <FiDownload className="mr-2" />
                        Download
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-500">No books required for this competition</p>
        )}
      </div>

      {!competition.is_registered && (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Register for this Competition</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID Card Number
            </label>
            <input
              type="text"
              value={studentCart}
              onChange={(e) => setStudentCart(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your student card number"
              required
            />
          </div>
          
          {registrationStatus && (
            <div className={`p-3 mb-4 rounded-md ${
              registrationStatus.success 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {registrationStatus.message}
            </div>
          )}
          
          <button
            onClick={handleRegister}
            disabled={isSubmitting || !studentCart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FiMessageSquare className="mr-2" />
          Discussion ({comments.length})
        </h2>

        {/* Comment Form */}
        {competition.is_registered && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="mb-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                placeholder="Share your thoughts about this competition..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={isCommentLoading || !newComment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isCommentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            {commentError && (
              <div className="mt-2 text-sm text-red-600">{commentError}</div>
            )}
          </form>
        )}

        {/* Comments List */}
        {isCommentLoading && comments.length === 0 ? (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-800">{comment.user_name || 'Anonymous'}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{comment.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No comments yet. {competition.is_registered ? 'Be the first to share your thoughts!' : 'Register to participate in the discussion.'}
          </div>
        )}
      </div>
    </div>
  );
}