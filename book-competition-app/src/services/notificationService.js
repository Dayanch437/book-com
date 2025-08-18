// services/notificationService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/notification/';

export const getNotifications = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};