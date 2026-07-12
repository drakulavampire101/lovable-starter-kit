// Mission 7 — Peer ratings
import api from './api.js';

// Peer actions (STUDENT)
export const getRatingRoster = () => api.get('/ratings/roster').then((r) => r.data);
export const getMyRated = () => api.get('/ratings/my-rated').then((r) => r.data);
export const submitRating = (targetId, payload) =>
  api.post(`/ratings/rate/${targetId}`, payload).then((r) => r.data);

// Public
export const getRatingLeaderboard = () => api.get('/ratings/leaderboard').then((r) => r.data);
export const getStudentProfile = (id) => api.get(`/ratings/profile/${id}`).then((r) => r.data);
export const getPublicComments = (id) =>
  api.get(`/ratings/profile/${id}/comments`).then((r) => r.data);

// Moderation (ADMIN)
export const getModerationQueue = () => api.get('/ratings/moderate').then((r) => r.data);
export const moderateRating = (id, decision) =>
  api.patch(`/ratings/moderate/${id}`, decision).then((r) => r.data);
export const getRatingAnalytics = () => api.get('/ratings/analytics').then((r) => r.data);
