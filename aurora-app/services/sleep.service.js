import api from './api';

export const logSleep = (data) => api.post('/sleep/log', data);
export const getHistory = () => api.get('/sleep/history');
export const getAnalytics = () => api.get('/sleep/analytics');