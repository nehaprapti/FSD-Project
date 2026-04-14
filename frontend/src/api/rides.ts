import api from './config';

export const estimateRide = async (data: any) => {
  return await api.post('/rides/estimate', data);
};

export const bookRide = async (data: any) => {
  return await api.post('/rides/book', data);
};

export const getRide = async (id: string) => {
  return await api.get(`/rides/${id}`);
};

export const getSharedGroup = async (groupId: string) => {
  return await api.get(`/rides/shared/${groupId}`);
};

export const getRideHistory = async () => {
  return await api.get('/rides/history');
};
