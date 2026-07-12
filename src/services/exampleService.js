import api from './api.js';

export async function getExamples() {
  const { data } = await api.get('/examples');
  return data;
}
