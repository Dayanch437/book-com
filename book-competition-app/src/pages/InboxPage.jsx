// pages/InboxPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiUser, FiBell } from 'react-icons/fi';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// const API_BASE_URL = 'http://127.0.0.1:8000';

const InboxPage = () => {
  const [notificationGroups, setNotificationGroups] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/token/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/');
          return;
        }

        const isTokenValid = await verifyToken(token);
        if (!isTokenValid) {
          localStorage.removeItem('accessToken');
          navigate('/');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/inbox/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Calculate total unread count (assuming all are unread for demo)
        const totalUnread = response.data.reduce((count, group) => {
          return count + group.notifications.length;
        }, 0);

        setNotificationGroups(response.data);
        setUnreadCount(totalUnread);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/');
        } else {
          setError(err.message || 'Failed to load notifications');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total notifications count
  const totalNotifications = notificationGroups.reduce(
    (count, group) => count + group.notifications.length, 
    0
  );

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <div className="relative ml-4">
          <FiBell className="text-gray-600 text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {totalNotifications === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FiMail className="mx-auto text-4xl mb-4 text-gray-300" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notificationGroups.map((group) => (
              group.notifications.length > 0 && (
                <div key={group.id} className="p-4">
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(group.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <ul className="space-y-3">
                    {group.notifications.map((notification, idx) => (
                      <li key={idx} className="hover:bg-gray-50 transition-colors p-2 rounded">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                            <FiUser className="text-indigo-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.get_user_full_name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {notification.text}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;