import apiClient from './apiClient';

export const startWorkout = async () => {
  const response = await apiClient.post('/workouts/start');
  return response.data;
};

export const getActiveWorkout = async () => {
  const response = await apiClient.get('/workouts/active');
  return response.data;
};

export const addSetToWorkout = async (setData) => {
  const response = await apiClient.post('/workouts/sets', setData);
  return response.data;
};

export const updateSetInWorkout = async (setId, weight, reps) => {
  const response = await apiClient.put(`/workouts/sets/${setId}`, null, {
    params: { weight, reps }
  });
  return response.data;
};

export const toggleSetCompletion = async (setId) => {
  const response = await apiClient.patch(`/workouts/sets/${setId}/toggle`);
  return response.data;
};

export const deleteSetFromWorkout = async (setId) => {
  await apiClient.delete(`/workouts/sets/${setId}`);
};

export const finishWorkout = async () => {
  const response = await apiClient.post('/workouts/finish');
  return response.data;
};

export const getWorkoutHistory = async () => {
  const response = await apiClient.get('/workouts/history');
  return response.data;
};

export const getPersonalRecords = async () => {
  const response = await apiClient.get('/workouts/records');
  return response.data;
};
