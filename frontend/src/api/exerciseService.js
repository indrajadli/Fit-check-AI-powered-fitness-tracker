import apiClient from './apiClient';

export const getExercises = async (bodyPart) => {
  const params = bodyPart && bodyPart !== 'ALL' ? { bodyPart } : {};
  const response = await apiClient.get('/exercises', { params });
  return response.data;
};

export const getExerciseById = async (id) => {
  const response = await apiClient.get(`/exercises/${id}`);
  return response.data;
};

export const searchExercises = async (query) => {
  const response = await apiClient.get('/exercises/search', { params: { q: query } });
  return response.data;
};
