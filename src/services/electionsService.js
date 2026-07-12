// Mission 9 — Elections & Voting
import api from './api.js';

export const getActiveElection = () => api.get('/elections/active').then((r) => r.data);
export const listElections = () => api.get('/elections').then((r) => r.data);
export const getElectionHistory = () => api.get('/elections/history').then((r) => r.data);

export const getCandidates = (electionId) =>
  api.get(`/elections/${electionId}/candidates`).then((r) => r.data);
export const compareElectionCandidates = (electionId) =>
  api.get(`/elections/${electionId}/candidates/compare`).then((r) => r.data);
export const getCandidateProfile = (electionId, candidateId) =>
  api.get(`/elections/${electionId}/candidates/${candidateId}`).then((r) => r.data);

export const getTimeline = (electionId) =>
  api.get(`/elections/${electionId}/timeline`).then((r) => r.data);
export const getResults = (electionId) =>
  api.get(`/elections/${electionId}/results`).then((r) => r.data);

// Student
export const castVote = (electionId, payload) =>
  api.post(`/elections/${electionId}/vote`, payload).then((r) => r.data);
export const hasVoted = (electionId) =>
  api.get(`/elections/${electionId}/has-voted`).then((r) => r.data);

// Admin
export const createElection = (payload) => api.post('/elections', payload).then((r) => r.data);
export const addCandidate = (electionId, payload) =>
  api.post(`/elections/${electionId}/candidates`, payload).then((r) => r.data);
export const getAdminView = (electionId) =>
  api.get(`/elections/${electionId}/admin`).then((r) => r.data);
export const updateElectionStatus = (electionId, status) =>
  api.patch(`/elections/${electionId}/status`, { status }).then((r) => r.data);
export const getActivityLog = (electionId) =>
  api.get(`/elections/${electionId}/activity`).then((r) => r.data);
