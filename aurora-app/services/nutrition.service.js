import api from './api';

export const getToday = () => api.get('/nutrition/today');
export const logMeal = (data) => api.post('/nutrition/log', data);