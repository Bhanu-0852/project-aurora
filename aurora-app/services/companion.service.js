import api from './api';

export const chat = (message) => api.post('/companion/chat', { message });
export const voiceChat = (transcript) => api.post('/companion/voice', { transcript });