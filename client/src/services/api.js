import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach admin or participant token automatically
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('gld_admin_token');
  const participantToken = localStorage.getItem('gld_participant_token');

  // If request URL starts with /admin or relates to admin routes, use adminToken
  if (config.url?.includes('/admin') || config.url?.includes('/draw') || config.url?.includes('/reports') || config.url?.includes('/audit-logs')) {
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else if (config.url?.includes('/participant') || config.url?.includes('/claims')) {
    // For participant endpoints
    if (participantToken) {
      config.headers.Authorization = `Bearer ${participantToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
  } else {
    // Default fallback
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (participantToken) {
      config.headers.Authorization = `Bearer ${participantToken}`;
    }
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
