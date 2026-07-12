// Mission 8 — Captain recommendation engine
import api from './api.js';

// Roster
export const getCandidateRoster = () => api.get('/candidates/roster').then((r) => r.data);
export const getStudentCaptainStatus = (id) =>
  api.get(`/candidates/roster/${id}/captain`).then((r) => r.data);
export const getCaptainRoster = () => api.get('/candidates/captains').then((r) => r.data);

// Rounds
export const listRounds = () => api.get('/candidates/rounds').then((r) => r.data);
export const createRound = (payload) => api.post('/candidates/rounds', payload).then((r) => r.data);
export const getRound = (id) => api.get(`/candidates/rounds/${id}`).then((r) => r.data);
export const updateWeights = (id, weights) =>
  api.patch(`/candidates/rounds/${id}/weights`, weights).then((r) => r.data);

// Candidates within a round
export const getRankedCandidates = (roundId) =>
  api.get(`/candidates/rounds/${roundId}/candidates`).then((r) => r.data);
export const compareCandidates = (roundId, ids) =>
  api
    .get(`/candidates/rounds/${roundId}/candidates/compare`, {
      headers: {},
    })
    .then((r) => r.data);
export const getRoundAnalytics = (roundId) =>
  api.get(`/candidates/rounds/${roundId}/analytics`).then((r) => r.data);
export const getCandidateProfile = (roundId, userId) =>
  api.get(`/candidates/rounds/${roundId}/candidates/${userId}`).then((r) => r.data);
export const upsertCandidateProfile = (roundId, userId, payload) =>
  api.put(`/candidates/rounds/${roundId}/candidates/${userId}`, payload).then((r) => r.data);
export const submitOverride = (roundId, userId, payload) =>
  api
    .post(`/candidates/rounds/${roundId}/candidates/${userId}/override`, payload)
    .then((r) => r.data);

// History
export const getCandidateHistory = () => api.get('/candidates/history').then((r) => r.data);
