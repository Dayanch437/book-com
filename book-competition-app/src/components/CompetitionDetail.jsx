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
  FiMessageSquare,
  FiStar,
  FiBookmark,
  FiLoader
} from 'react-icons/fi';

const StarRating = ({ rating, setRating, interactive = true, isLoading = false }) => {
  const [hoverRating, setHoverRating] = useState(0);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <FiLoader className="animate-spin mr-2" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`text-2xl focus:outline-none ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          {star <= (hoverRating || rating) ? (
            <FiStar className="text-yellow-400 fill-current" />
          ) : (
            <FiStar className="text-gray-300" />
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {rating === 0 ? 'Not rated' : `${rating} star${rating !== 1 ? 's' : ''}`}
      </span>
    </div>
  );
};

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
  
  // Book states
  const [bookProgress, setBookProgress] = useState({});
  const [bookRatings, setBookRatings] = useState({});
  const [dailyPages, setDailyPages] = useState({});
  const [totalPagesRead, setTotalPagesRead] = useState({});
  const [isRatingLoading, setIsRatingLoading] = useState({});
  const [isFetchingRatings, setIsFetchingRatings] = useState(false);
  
  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    type: 'book summary',
    text: '',
    book: null
  });
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

  // Fetch existing ratings for all books
  const fetchAllBookRatings = async () => {
    try {
      setIsFetchingRatings(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await axios.get(
        `${API_BASE_URL}/api/book-rating/?competition=${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Initialize with default ratings of 0
      const ratings = {};
      competition.books.forEach(book => {
        ratings[book.id] = 0;
      });

      // Update with actual ratings from API
      if (response.data && response.data.length > 0) {
        response.data.forEach(rating => {
          ratings[rating.book] = rating.rating;
        });
      }

      setBookRatings(ratings);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setIsFetchingRatings(false);
    }
  };

  // Submit new rating
  const handleBookRatingSubmit = async (bookId, rating) => {
    try {
      setIsRatingLoading(prev => ({...prev, [bookId]: true}));
      const token = getAuthToken();
      if (!token) return;

      await axios.post(
        `${API_BASE_URL}/api/book-rating/`,
        {
          competition: id,
          book: bookId,
          rating: rating
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Update local state
      setBookRatings(prev => ({
        ...prev,
        [bookId]: rating
      }));
    } catch (err) {
      console.error('Error saving rating:', err);
      // Revert UI if API call fails
      setBookRatings(prev => ({
        ...prev,
        [bookId]: prev[bookId] || 0
      }));
    } finally {
      setIsRatingLoading(prev => ({...prev, [bookId]: false}));
    }
  };

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = getAuthToken();
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/api/competitions-student/${id}/`, 
          {
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

        // Initialize states for each book
        const initialProgress = {};
        const initialDailyPages = {};
        const initialTotalPages = {};
        const initialRatingLoading = {};
        
        apiData.books.forEach(book => {
          initialProgress[book.id] = 0;
          initialDailyPages[book.id] = '';
          initialTotalPages[book.id] = 0;
          initialRatingLoading[book.id] = false;
        });
        
        setBookProgress(initialProgress);
        setDailyPages(initialDailyPages);
        setTotalPagesRead(initialTotalPages);
        setIsRatingLoading(initialRatingLoading);

        // Set first book as default for comments
        if (apiData.books.length > 0) {
          setNewComment(prev => ({
            ...prev,
            book: apiData.books[0].id
          }));
        }

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

  // Fetch ratings after competition data is loaded
  useEffect(() => {
    if (competition.books.length > 0) {
      fetchAllBookRatings();
    }
  }, [competition.books]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsCommentLoading(true);
        setCommentError(null);
        const token = getAuthToken();
        if (!token) return;

        const response = await axios.get(
          `${API_BASE_URL}/api/student-comments/?competition=${id}`,
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

    if (competition.is_registered) {
      fetchComments();
    }
  }, [id, competition.is_registered]);

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

  const handleDailyProgressSubmit = async (bookId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const pages = parseInt(dailyPages[bookId]) || 0;
      if (pages <= 0) return;

      await axios.post(
        `${API_BASE_URL}/api/daily-page/`,
        {
          competition: id,
          book: bookId,
          page: pages
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Update total progress
      setTotalPagesRead(prev => ({
        ...prev,
        [bookId]: (prev[bookId] || 0) + pages
      }));

      // Reset daily input
      setDailyPages(prev => ({
        ...prev,
        [bookId]: ''
      }));

    } catch (err) {
      console.error('Error saving daily progress:', err);
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
          type: newComment.type,
          competition: id,
          book: newComment.book,
          text: newComment.text
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setComments([response.data, ...comments]);
      setNewComment({
        type: 'book summary',
        text: '',
        book: newComment.book
      });
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
          <div className="space-y-6">
            {competition.books.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {book.title || 'Untitled Book'}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                    )}
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

                {competition.is_registered && (
                  <div className="mt-6 space-y-6">
                    {/* Daily Reading Progress */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FiBook className="mr-2 text-indigo-500" />
                        Reading Progress
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <input
                            type="number"
                            value={dailyPages[book.id] || ''}
                            onChange={(e) => setDailyPages({
                              ...dailyPages,
                              [book.id]: e.target.value
                            })}
                            className="w-24 p-2 border border-gray-300 rounded-md"
                            min="1"
                            placeholder="Today's pages"
                          />
                          <button
                            onClick={() => handleDailyProgressSubmit(book.id)}
                            disabled={!dailyPages[book.id] || parseInt(dailyPages[book.id]) <= 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                          >
                            Add Pages
                          </button>
                        </div>
                        <div className="text-sm text-gray-600">
                          Total read: {totalPagesRead[book.id] || 0} pages
                        </div>
                      </div>
                    </div>

                    {/* Book Rating */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                        <FiStar className="mr-2 text-yellow-500" />
                        Your Rating
                      </h4>
                      <div className="flex items-center justify-between">
                        <StarRating 
                          rating={bookRatings[book.id] || 0} 
                          setRating={(rating) => {
                            handleBookRatingSubmit(book.id, rating);
                          }}
                          isLoading={isRatingLoading[book.id] || isFetchingRatings}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
      {competition.is_registered && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FiMessageSquare className="mr-2" />
            Book Notes ({comments.length})
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type
                </label>
                <select
                  value={newComment.type}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    type: e.target.value
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="book summary">Book Summary</option>
                  <option value="favorite parts">Favorite Parts</option>
                  <option value="notes">Notes</option>
                  <option value="thoughts">Thoughts</option>
                  <option value="favorite quotes">Favorite Quotes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book
                </label>
                <select
                  value={newComment.book || ''}
                  onChange={(e) => setNewComment({
                    ...newComment,
                    book: parseInt(e.target.value)
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {competition.books.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <textarea
                value={newComment.text}
                onChange={(e) => setNewComment({
                  ...newComment,
                  text: e.target.value
                })}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="4"
                placeholder={`Enter your ${newComment.type.replace('_', ' ')}...`}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isCommentLoading || !newComment.text.trim() || !newComment.book}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isCommentLoading ? 'Posting...' : 'Post Note'}
            </button>
            {commentError && (
              <div className="mt-2 text-sm text-red-600">{commentError}</div>
            )}
          </form>

          {/* Comments List */}
          {isCommentLoading && comments.length === 0 ? (
            <div className="flex justify-center py-4">
              <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-800 capitalize">
                      <FiBookmark className="inline mr-2" />
                      {comment.type.replace('_', ' ')} • {comment.book_title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{comment.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No notes yet. Add your first note above!
            </div>
          )}
        </div>
      )}
    </div>
  );
}