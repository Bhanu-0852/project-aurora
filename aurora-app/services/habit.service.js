import api from './api';

export const getHabits = () => api.get('/habits');
export const createHabit = (data) => api.post('/habits', data);
export const completeHabit = (id) => api.put(`/habits/${id}/complete`);
export const skipHabit = (id) => api.put(`/habits/${id}/skip`);
export const pauseHabit = (id) => api.put(`/habits/${id}/pause`);
export const editHabit = (id, data) => api.put(`/habits/${id}`, data);
export const deleteHabit = (id) => api.delete(`/habits/${id}`);