import api from './api';

export const getSummary = () => api.get('/dashboard/summary');
export const getDailyInsight = () => api.get('/dashboard/insight');
export const getStreaks = () => api.get('/streaks');
export const getWeeklyReport = () => api.get('/progress/weekly');
export const getMonthlyReport = () => api.get('/progress/monthly');