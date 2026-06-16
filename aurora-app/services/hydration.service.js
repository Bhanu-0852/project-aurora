import api from './api';

export const getToday = () => api.get('/hydration/today');
export const logWater = (amount) => api.post('/hydration/log', { amount });
export const getHistory = () => api.get('/hydration/history');