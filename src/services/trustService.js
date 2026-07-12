// Mission 10 — Trust Graph
import api from './api.js';

export const getTrustDashboard = () => api.get('/trust/dashboard').then((r) => r.data);
export const getAllTrustFlags = () => api.get('/trust/flags').then((r) => r.data);
export const getTrustScore = (userId) => api.get(`/trust/${userId}/score`).then((r) => r.data);
export const getUnresolvedFlags = (userId) =>
  api.get(`/trust/${userId}/flags`).then((r) => r.data);
export const createTrustFlag = (userId, payload) =>
  api.post(`/trust/${userId}/flags`, payload).then((r) => r.data);
export const resolveTrustFlag = (flagId) =>
  api.patch(`/trust/flags/${flagId}/resolve`).then((r) => r.data);
